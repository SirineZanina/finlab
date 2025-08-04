'use server';
import z from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { BusinessIndustry, RoleType } from '@prisma/client';
import { signInSchema, signUpSchema } from '@/app/(auth)/_nextjs/schema';
import { comparePasswords, generateSalt, hashPassword } from '@/app/(auth)/_core/passwordHasher';
import { removeUserFromSession } from '@/app/(auth)/_core/session/session';
import { AppError } from '../errors/appError';
import { createDwollaCustomer, deactivateDwollaCustomer } from './dwolla.actions';
import { extractCustomerIdFromUrl } from '../utils';
import { LoginParams, SignUpParams } from '@/types/user';
import { createUserSession } from '@/app/(auth)/_core/session/createUserSession';

// ================ SIGN IN ================

export async function signIn(unsafeData: LoginParams) {

  const { success, data } = signInSchema.safeParse(unsafeData);
  if (!success) throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 400);

  const user =  await prisma.user.findFirst({
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

  if (user == null) throw new AppError('USER_NOT_FOUND', 'User not found', 404);

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt
  });

  if (!isCorrectPassword) throw new AppError('INVALID_CREDENTIALS', 'Invalid password', 400);

  await createUserSession({
    id: user.id,
    role: user.role.roleType,
    businessId: user.businessId
  }, await cookies());

  redirect('/dashboard');
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
    // Create business if it doesn't exist
    const business = await prisma.business.create({
      data: {
        name: validatedData.businessName,
        industry: validatedData.businessIndustry,
      },
    });

    // Create dwolla customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      businessName: validatedData.businessName,
      businessIndustry: validatedData.businessIndustry,
      country: validatedData.country,
      phoneNumber: '5551234567',
      roleType: validatedData.roleType,
      email: validatedData.email,
      type: 'personal',
      address1: '123 Main St', // Replace with actual address if needed
      city: 'Sample City', // Replace with actual city if needed
      state: 'NY', // Replace with actual state if needed
	  dateOfBirth: '1990-01-01', // Replace with actual date of
      postalCode: '12345', // Replace with actual postal code if needed
	  ssn: '1234', // Replace with actual last 4 digits of SSN
      // Add any other required fields for NewDwollaCustomerParams here
    });

    if (!dwollaCustomerUrl) {
	  throw new AppError('DWOLLA_ERROR', 'Unable to create Dwolla customer', 500);
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: hashedPassword,
        salt,
        country: validatedData.country,
        phoneNumber: validatedData.phoneNumber,
        businessId: business.id,
        roleId: userRole.id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      },
	  include: {
        role: true,
        business: true,
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

// Define this type to avoid repeating inline assertions
type ValidatedSignUpData = z.infer<typeof signUpSchema> & {
  firstName: string;
  lastName: string;
  businessName: string;
  businessIndustry: BusinessIndustry;
  country: string;
  phoneNumber: string;
  roleType: RoleType;
};

// ================ LOG OUT ================

export async function logOut() {

  await removeUserFromSession(await cookies());
  redirect('/');
}
