import { Control, FieldPath } from 'react-hook-form';
import z from 'zod';
import { authFormSchema } from '../authForm/authForm.utils';

const formSchema = authFormSchema('sign-up');

export type CustomInputProps = {
	control: Control<z.infer<typeof formSchema>>;
	name: FieldPath<z.infer<typeof formSchema>>;
	label: string;
	placeholder: string;
}
