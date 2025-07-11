import z from 'zod';

export const authFormSchema = (type: string) => z.object({
  // sign up
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  lastName:type === 'sign-in' ? z.string().optional() : z.string().min(3),
  businessName:type === 'sign-in' ? z.string().optional() : z.string().max(50),
  businessIndustry:type === 'sign-in' ? z.string().optional() : z.string().max(50),
  country:type === 'sign-in' ? z.string().optional() : z.string().max(50),
  phoneNumber: type === 'sign-in'
    ? z.string().optional()
    : z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be at most 15 digits')
      .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  // both sign-in and sign-up
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const signUpSchema = authFormSchema('sign-up');
export const signInSchema = authFormSchema('sign-in');
