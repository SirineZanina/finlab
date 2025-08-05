import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  name: z.string().min(1, 'Transaction name is required'),
  amount: z.number().int().min(1, 'Amount must be a positive integer'),
  payee: z.string().min(1, 'Payee is required'),
  notes: z.string().optional(),
  date: z.date().optional(), // Optional date field for manual entry
  paymentChannel: z.string().min(1, 'Payment channel is required'),
  pending: z.boolean().default(false),
  image: z.string().url().optional(),
  // Include the foreign key fields
  accountId: z.string().cuid('Invalid account ID'),
  categoryId: z.string().cuid('Invalid category ID').optional(),
  type: z.string().min(1, 'Transaction type is required'),
});

// Schema for updating (all fields optional )
export const UpdateTransactionSchema = CreateTransactionSchema.partial();

// Schema for API requests where date comes as string
export const CreateTransactionAPISchema = CreateTransactionSchema.extend({
  date: z.string().datetime().transform((str) => new Date(str)).optional(),
});

// Schema for bulk operations
export const BulkDeleteTransactionSchema = z.object({
  transactionIds: z.array(z.string().cuid()).min(1, 'At least one transaction ID is required'),
});

// Query/filter schema
export const TransactionQuerySchema = z.object({
  accountId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  startDate: z.string().datetime().transform((str) => new Date(str)).optional(),
  endDate: z.string().datetime().transform((str) => new Date(str)).optional(),
  search: z.string().optional(),
  type: z.string().optional(),
  pending: z.boolean().optional(),
});

// Response schema (what comes back from database with relations)
export const TransactionResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  amount: z.number(),
  payee: z.string(),
  notes: z.string().nullable(),
  date: z.string().datetime().transform((str) => new Date(str)).nullable(),
  paymentChannel: z.string(),
  pending: z.boolean(),
  image: z.string().nullable(),
  accountId: z.string().cuid(),
  categoryId: z.string().cuid().nullable(),
  type: z.string(),
  createdAt: z.string().datetime().transform((str) => new Date(str)),
  updatedAt: z.string().datetime().transform((str) => new Date(str)),
  // Include relations if populated
  account: z.object({
    id: z.string().cuid(),
    name: z.string(),
  }).optional(),
  category: z.object({
    id: z.string().cuid(),
    name: z.string(),
  }).nullable().optional(),
});

// Type inference
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type CreateTransactionAPIInput = z.infer<typeof CreateTransactionAPISchema>;
export type TransactionQueryInput = z.infer<typeof TransactionQuerySchema>;
export type BulkDeleteTransactionInput = z.infer<typeof BulkDeleteTransactionSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
