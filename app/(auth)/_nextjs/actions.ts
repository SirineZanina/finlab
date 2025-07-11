'use server';

import z from 'zod';
import { redirect } from 'next/navigation';
import { signInSchema, signUpSchema } from './components/customInput/customInput.types';
import { prisma } from '@/lib/prisma';
import { generateSalt, hashPassword } from '../(core)/auth.utils';

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {

  const { success, data } = signInSchema.safeParse(unsafeData);
  if (!success) {
    return 'Unable to log you in';
  }

  // TODO: Implement sign-in logic here
  redirect('/');
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {

  const { success, data } = signUpSchema.safeParse(unsafeData);
  if (!success) {
    return 'Unable to create your account';
  }

  const existingUser = await prisma.user.findFirst({
    where: { email : data.email}
  });

  if (existingUser != null) return 'Acount already exists for this email';

  const hashedPassword = await hashPassword(data.password, generateSalt());
  console.log(hashedPassword);
  //TODO : Implement sign-up logic here
  redirect('/');
}

export async function logOut() {
  //TODO: Implement log-out logic here
  redirect('/');
}
