import { createAccountSchema } from '@/types/schemas/account-schema';
import z from 'zod';

export const formSchema = createAccountSchema.pick({
  name: true
});

export type FormValues = z.infer<typeof formSchema>;

export type AccountFormProps = {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: ( values: FormValues ) => void;
	onDelete?: () => void;
	disabled?: boolean;
}
