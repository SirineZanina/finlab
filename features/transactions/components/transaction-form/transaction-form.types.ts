import { CreateTransactionAPISchema, CreateTransactionSchema } from '@/types/schemas/transaction-schema';
import z from 'zod';

export const formSchema = z.object({
  name: z.string(),
  paymentChannel: z.string().optional(),
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().optional(),
  payee: z.string(),
  notes: z.string().optional(),
  amount: z.string(),
});

export const apiSchema = CreateTransactionAPISchema.omit({
  pending: true,
});

export type FormValues = z.infer<typeof formSchema>;
export type ApiFormValues = z.infer<typeof apiSchema>;

export type TransactionFormProps = {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: ( values: ApiFormValues ) => void;
	onDelete?: () => void;
	disabled?: boolean;
	accountOptions: {label: string; value: string;}[];
	categoryOptions: {label: string; value: string;}[];
	onCreateAccount: (name: string) => void;
	onCreateCategory: (name: string) => void;
}
