import { CreateAccountSchema } from '@/types/schemas/account-schema';
import z from 'zod';

export type FormValues = z.infer<typeof CreateAccountSchema>;

export type AccountFormProps = {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: ( values: FormValues ) => void;
	onDelete?: () => void;
	disabled?: boolean;
}
