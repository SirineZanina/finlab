'use server';
import z from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { BusinessIndustry, RoleType } from '@prisma/client';
import { signInSchema, signUpSchema } from '@/app/(auth)/_lib/schema';
import { comparePasswords, generateSalt, hashPassword } from '@/app/(auth)/_lib/utils/passwordHasher';
import { removeUserFromSession } from '@/app/(auth)/_lib/utils/session/session';
import { AppError } from '../errors/appError';
import { createDwollaCustomer, deactivateDwollaCustomer } from './dwolla.actions';
import { extractCustomerIdFromUrl } from '../utils';
import { LoginParams, SignUpParams } from '@/types/client/user';
import { createUserSession } from '@/app/(auth)/_lib/utils/session/createUserSession';

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

export async function signUp(unsafeData: SignUpParams) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  let dwollaCustomerUrl;
  try {
    if (!success) throw new Error('Unable to create your account');

    // Validate the data
    const validatedData = data as ValidatedSignUpData;

    // Check if user with this email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: validatedData.email },
    });

    if (existingUser) throw new AppError('USER_EXISTS', 'User with this email already exists', 400);

    // Get the user role from the database
    const userRole = await prisma.userRole.findUnique({
      where: { roleType: data.roleType as RoleType },
    });

    // If the role does not exist, throw an error
    if (!Object.values(RoleType).includes(userRole?.roleType as RoleType) || userRole == null) {
      throw new AppError('INVALID_ROLE', 'Invalid user role', 400);
    }

    // Hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    // Create business
    // Check if business already exists
    const existingBusiness = await prisma.business.findFirst({
		 where: { name: validatedData.businessName },
    });

    if (existingBusiness) {
	  throw new AppError('BUSINESS_EXISTS', 'Business with this name already exists', 400);
    }

    // 🔧 FIX 1: Create Address first (required for User)
    const address = await prisma.address.create({
      data: {
        street: validatedData.street,
        city: validatedData.city,
        state: validatedData.state,
        postalCode: validatedData.postalCode,
        countryId: validatedData.countryId, // Use the countryId from form
      },
    });

    // Create business if it doesn't exist
    const business = await prisma.business.create({
      data: {
        name: validatedData.businessName,
        industry: validatedData.businessIndustry,
        countryId: validatedData.countryId,
        currencyId: validatedData.currencyId,
      },
    });

    if (!business) {
	  throw new AppError('BUSINESS_CREATION_FAILED', 'Failed to create business', 500);
    }

    // TODO: dwolla

    // // Create dwolla customer
    // const dwollaCustomerUrl = await createDwollaCustomer({
    //   firstName: validatedData.firstName,
    //   lastName: validatedData.lastName,
    //   businessName: validatedData.businessName,
    //   businessIndustry: validatedData.businessIndustry,
    //   country: validatedData.,
    //   phoneNumber: validatedData.phoneNumber, // 🔧 FIX 2: Use actual phone number
    //   roleType: validatedData.roleType,
    //   email: validatedData.email,
    //   type: 'personal',
    //   address1: validatedData.address1 || '123 Main St',
    //   city: validatedData.city || 'Sample City',
    //   state: validatedData.state || 'NY',
    //   dateOfBirth: validatedData.dateOfBirth || '1990-01-01',
    //   postalCode: validatedData.postalCode || '12345',
    //   ssn: validatedData.ssn || '1234',
    // });

    // if (!dwollaCustomerUrl) {
    //   throw new AppError('DWOLLA_ERROR', 'Unable to create Dwolla customer', 500);
    // }

    // const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // 🔧 FIX 3: Create user with addressId (not country string)
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        salt,
        addressId: address.id, // 🔧 Use addressId instead of country
        phoneNumber: validatedData.phoneNumber,
        businessId: business.id,
        roleId: userRole.id,
        // dwollaCustomerId,
        // dwollaCustomerUrl,
      },
	  include: {
        role: true,
        business: true,
        address: { // 🔧 Include address in response
          include: {
            country: true
          }
        },
      },
    });

    // Create session + set cookie
    await createUserSession(
      { id: user.id, role: user.role.roleType, businessId: user.businessId },
      await cookies()
    );

    return user;

  } catch (error) {
    if (dwollaCustomerUrl) {
      await deactivateDwollaCustomer(dwollaCustomerUrl);
    }
    console.error('Error creating user:', error);
    throw error;
  }
}

// 🔧 FIX 4: Updated type to match schema requirements
type ValidatedSignUpData = z.infer<typeof signUpSchema> & {
  firstName: string;
  lastName: string;
  businessName: string;
  businessIndustry: BusinessIndustry;
  countryId: string;
  currencyId: string;
  phoneNumber: string;
  roleType: RoleType;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  ssn: string;
};

// ================ LOG OUT ================

export async function logOut() {

  await removeUserFromSession(await cookies());
  redirect('/');
}
