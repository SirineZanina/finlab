import { RoleType, BusinessIndustry } from '@prisma/client';
import z from 'zod';

export const authFormSchema = (type: string) => z.object({
  // sign up
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  businessName: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  businessIndustry: type === 'sign-in' ? z.string().optional() : z.enum(Object.values(BusinessIndustry) as [BusinessIndustry, ...BusinessIndustry[]]),
  countryId: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'Country is required'),
  currencyId: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'Currency is required'),
  street: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'Street is required'),
  city: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'City is required'),
  state: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'State is required'),
  postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'Postal code is required'),
  phoneNumber: type === 'sign-in' ? z.string().optional() : z.string().min(1, 'Phone number is required'), // ✅ Fixed!
  roleType: type === 'sign-in' ? z.string().optional() : z.enum(Object.values(RoleType) as [RoleType, ...RoleType[]]),
  // both sign-in and sign-up
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const signUpSchema = authFormSchema('sign-up');
export const signInSchema = authFormSchema('sign-in');

// session schema
const roleTypeValues = Object.values(RoleType) as [string, ...string[]];

export const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(roleTypeValues),
  businessId: z.string()
});
