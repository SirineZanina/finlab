
import { z } from 'zod';

// Schema for creating a new account (excludes auto-generated fields)
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
});

// Schema for updating an account (all fields optional)
export const updateAccountSchema = createAccountSchema.partial();

// Type inference
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
