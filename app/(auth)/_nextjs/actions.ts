'use server';
import z from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { signInSchema, signUpSchema } from './schema';
import { comparePasswords, generateSalt, hashPassword } from '../_core/passwordHasher';
import { createUserSession, removeUserFromSession } from '../_core/session';
import { cookies } from 'next/headers';
import { BusinessIndustry, RoleType } from '@prisma/client';

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {

  const { success, data } = signInSchema.safeParse(unsafeData);
  if (!success) return 'Unable to log you in';

  const user =  await prisma.user.findFirst({
    where: { email: data.email },
    select: {
	  id: true,
	  password: true,
	  salt: true,
	  email: true,
	  role: true
    }
  });

  if (user == null) return 'Unable to log you in';

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt
  });

  if (!isCorrectPassword) return 'Unable to log you in';

  await createUserSession({ id: user.id, role: user.role.roleType }, await cookies());

  redirect('/dashboard');
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);
  if (!success) {
    return 'Unable to create your account';
  }

  const validatedData = data as z.infer<typeof signUpSchema> & {
    firstName: string;
    lastName: string;
    businessName: string;
    businessIndustry: BusinessIndustry;
    country: string;
    phoneNumber: string;
    roleType: RoleType;
  };

  const existingUser = await prisma.user.findFirst({
    where: { email: validatedData.email }
  });

  if (existingUser != null) return 'Account already exists for this email';

  try {
	 const userRole = await prisma.userRole.findUnique({
      where: { roleType: validatedData.roleType},
    });

    if (!userRole) {
      throw new Error(`Role ${validatedData.roleType} not found. Please seed the database.`);
    }

	 const salt = generateSalt();
    const hashedPassword = await hashPassword(validatedData.password, salt);

    const business = await prisma.business.create({
      data: {
        name: validatedData.businessName,
        industry: validatedData.businessIndustry,
      },
    });

    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        country: validatedData.country,
        phoneNumber: validatedData.phoneNumber,
        email: validatedData.email,
        password: hashedPassword,
        businessId: business.id,
        salt,
        roleId: userRole.id,
      },
	  select: {
        id: true,
        role:{
          select: {
            roleType: true
          }
        }
      },
    });

    if (user == null) return 'Unable to create account';

    await createUserSession({ id: user.id, role: user.role.roleType }, await cookies());

  } catch (error) {
    console.error('Error creating user:', error);
    return 'Unable to create account';
  }

  redirect('/sign-in');

}

export async function logOut() {

  await removeUserFromSession(await cookies());
  redirect('/');
}
