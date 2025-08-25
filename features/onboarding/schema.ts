// onboardingSchema.ts
import { z } from 'zod';

export const onboardingSchema = z.object({
  // Step 1: Account Type
  accountType: z.enum(['individual', 'business']).nullable(),

  // Step 2: Personal Info
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  dateOfBirth: z.date(), // Transform to YYYY-MM-DD format

  // Step 3 : account setup
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters long'),

  // Step 4: Contact Details
  address: z.object({
    street: z.string().min(1).max(100),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    postalCode: z.string().min(1).max(20),
    countryId: z.string().min(1).max(50), // Increased for cuid
  }).nullable(),

  // Step 5: Verification
  ssn: z.string().min(9).max(11).regex(/^\d{9,11}$/, { // Fixed regex to allow 9-11 digits
    message: 'SSN must be 9-11 digits',
  }),
  phoneNumber: z.string().min(1).max(20), // Adjusted max length for international numbers

  // Step 6 Business fields - required since every user needs a business
  businessName: z.string().min(1).max(50), // Removed optional
  industry: z.string().min(1).max(50), // Removed optional
  currencyId: z.string().min(1).max(50), // Added missing field

  // Step 7: Terms and Conditions
  terms: z.boolean().refine((data) => data, {
    message: 'You must accept the terms and conditions',
  }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
