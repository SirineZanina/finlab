
import { z } from 'zod';

// Schema for creating a new account (excludes auto-generated fields)
export const CreateAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  bankId: z.string().min(1, 'Bank is required'),
  currencyId: z.string().min(1, 'Currency is required'),
});

// Schema for updating an account (all fields optional)
export const UpdateAccountSchema = CreateAccountSchema.partial();

// Type inference
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>
