'use server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { BusinessIndustry  } from '@prisma/client';
import { signInSchema } from '@/app/(auth)/_lib/schema';
import { comparePasswords, generateSalt, hashPassword } from '@/app/(auth)/_lib/utils/passwordHasher';
import { removeUserFromSession } from '@/app/(auth)/_lib/utils/session/session';
import { AppError } from '../errors/appError';
import { createDwollaCustomer, deactivateDwollaCustomer } from './dwolla.actions';
import { extractCustomerIdFromUrl, formatState } from '../utils';
import { createUserSession } from '@/app/(auth)/_lib/utils/session/createUserSession';
import { LoginParams } from '@/types/client/entities';
import { onboardingSchema, OnboardingSchema } from '@/features/onboarding/schema';

// Helper function to map industry strings to BusinessIndustry enum
function mapToBusinessIndustry(industry: string): BusinessIndustry {
  const industryMap: Record<string, BusinessIndustry> = {
    'Technology': BusinessIndustry.TECHNOLOGY,
    'Finance': BusinessIndustry.FINANCE,
    'Healthcare': BusinessIndustry.HEALTHCARE,
    'Retail': BusinessIndustry.RETAIL,
    'Manufacturing': BusinessIndustry.MANUFACTURING,
    'Education': BusinessIndustry.EDUCATION,
    'Hospitality': BusinessIndustry.HOSPITALITY,
    'Construction': BusinessIndustry.CONSTRUCTION,
    'Real Estate': BusinessIndustry.REAL_ESTATE,
    'Transportation': BusinessIndustry.TRANSPORTATION,
    'Other': BusinessIndustry.OTHER,
  };

  const mappedIndustry = industryMap[industry];
  if (!mappedIndustry) {
    const validIndustries = Object.keys(industryMap).join(', ');
    throw new AppError('INVALID_INDUSTRY', `Invalid industry: ${industry}. Valid options: ${validIndustries}`, 400);
  }

  return mappedIndustry;
}

// ================ SIGN IN ================

export async function signIn(unsafeData: LoginParams) {
  console.log('🚀 SignIn server action called');
  console.log('📧 Email:', unsafeData.email);

  try {
    const { success, data } = signInSchema.safeParse(unsafeData);

    if (!success) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 400);
    }

    const user = await prisma.user.findFirst({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
        salt: true,
        email: true,
        role: true,
        businessId: true,
      }
    });

    if (user == null) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    const isCorrectPassword = await comparePasswords({
      hashedPassword: user.password,
      password: data.password,
      salt: user.salt
    });

    if (!isCorrectPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid password', 400);
    }

    await createUserSession({
      id: user.id,
      role: user.role.roleType,
      businessId: user.businessId
    }, await cookies());

    return { success: true };

  } catch (error) {
    console.error('Error during sign in:', error);

    // Re-throw the error so it gets caught by the client
    throw error;
  }
}

// ================ SIGN UP ================
export async function completeOnboarding(unsafeData: OnboardingSchema) {
  let dwollaCustomerUrl;

  try {
    // Validate the data
    const { success, data, error } = onboardingSchema.safeParse(unsafeData);

    if (!success) {
      console.error('Validation errors:', error.errors);
      throw new AppError('VALIDATION_ERROR', 'Invalid onboarding data', 400);
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('USER_EXISTS', 'User with this email already exists', 400);
    }

    // Check if business already exists
    const existingBusiness = await prisma.business.findFirst({
      where: { name: data.businessName },
    });

    if (existingBusiness) {
      throw new AppError('BUSINESS_EXISTS', 'Business with this name already exists', 400);
    }

    // Get the user role from the database
    const userRole = await prisma.userRole.findUnique({
      where: { id: data.roleId },
    });

    if (!userRole) {
      throw new AppError('INVALID_ROLE', 'Invalid user role', 400);
    }

    // Hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    // Ensure address is not null
    if (!data.address) {
      throw new AppError('ADDRESS_REQUIRED', 'Address information is required', 400);
    }
    // Create address
    const address = await prisma.address.create({
      data: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        postalCode: data.address.postalCode,
        countryId: data.address.countryId,
      },
    });

    // Create business with properly mapped industry
    const business = await prisma.business.create({
      data: {
        name: data.businessName,
        industry: mapToBusinessIndustry(data.industry), // Use the mapping function
        currencyId: data.currencyId,
        addressId: address.id,
      },
    });

    if (!data.accountType) {
	  throw new AppError('ACCOUNT_TYPE_REQUIRED', 'Account type is required', 400);
    }

    const country = await prisma.country.findUnique({
	  where: { id: data.address.countryId },
    });
    if (!country) {
	  throw new AppError('INVALID_COUNTRY', 'Invalid country', 400);
    }

    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      businessIndustry: data.industry,
      phoneNumber: data.phoneNumber,
      roleType: userRole.roleType,
      email: data.email,
      type: 'personal',
      address1: data.address.street,
      city: data.address.city,
      state: formatState(data.address.state),
      country: country.name,
      dateOfBirth: (data.dateOfBirth).toISOString(),
      postalCode: data.address.postalCode,
      ssn: data.ssn,
    });

    if (!dwollaCustomerUrl) {
	  throw new AppError('DWOLLA_CUSTOMER_CREATION_FAILED', 'Failed to create Dwolla customer', 500);
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    if (!dwollaCustomerId) {
	  throw new AppError('DWOLLA_CUSTOMER_ID_EXTRACTION_FAILED', 'Failed to extract Dwolla customer ID', 500);
    }
    console.log('Dwolla Customer ID:', dwollaCustomerId);
    console.log('Dwolla Customer URL:', dwollaCustomerUrl);

    const existingDwollaUser = await prisma.user.findFirst({
	  where: { dwollaCustomerId: dwollaCustomerId },
    });
    if (existingDwollaUser) {
	  throw new AppError('DWOLLA_USER_EXISTS', 'User with this Dwolla customer ID already exists', 400);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        salt,
        addressId: address.id,
        phoneNumber: data.phoneNumber,
        businessId: business.id,
        roleId: userRole.id,
        ssn: data.ssn,
        dateOfBirth: data.dateOfBirth,
        dwollaCustomerId: dwollaCustomerId,
        dwollaCustomerUrl: dwollaCustomerUrl,
      },
      include: {
        role: true,
        business: true,
        address: {
          include: {
            country: true
          }
        },
      },
    });

    // Create session
    await createUserSession(
      { id: user.id, role: user.role.roleType, businessId: user.businessId },
      await cookies()
    );

    return { success: true, user };

  } catch (error) {
    // Cleanup Dwolla customer if created
    if (dwollaCustomerUrl) {
      await deactivateDwollaCustomer(dwollaCustomerUrl);
    }
    console.error('Error completing onboarding:', error);
    throw error;
  }
}

// ================ LOG OUT ================

export async function logOut() {

  await removeUserFromSession(await cookies());
  redirect('/');
}
