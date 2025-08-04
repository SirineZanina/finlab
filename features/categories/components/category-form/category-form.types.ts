import { CreateCategorySchema } from '@/types/schemas/category-schema';
import z from 'zod';

export const formSchema = CreateCategorySchema.pick({
  name: true
});

export type FormValues = z.infer<typeof formSchema>;

export type CategoryFormProps = {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: ( values: FormValues ) => void;
	onDelete?: () => void;
	disabled?: boolean;
}
