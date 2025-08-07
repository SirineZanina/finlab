import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  name: z.string().min(1, 'Transaction name is required'),
  amount: z.coerce.number(),
  payee: z.string().min(1, 'Payee is required'),
  notes: z.string().optional(),
  date: z.string()
  		.transform((dateString) => new Date(dateString))
   		.refine((date) => !isNaN(date.getTime()), 'Invalid date'),
  paymentChannel: z.string().min(1, 'Payment channel is required'),
  pending: z.boolean().default(false),
  image: z.string().url().optional(),
  // Include the foreign key fields
  accountId: z.string().cuid('Invalid account ID'),
  categoryId: z.string().cuid('Invalid category ID').optional(),
});

// Schema for creating a transaction
export const CreateTransactionAPISchema = CreateTransactionSchema.extend({
  date: z.date().transform(date => date.toISOString())
});

// Schema for updating (all fields optional )
export const UpdateTransactionSchema = CreateTransactionSchema.partial();

// Type inference
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type CreateTransactionAPIInput = z.infer<typeof CreateTransactionAPISchema>;
