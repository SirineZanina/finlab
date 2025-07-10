import { Control, FieldPath } from 'react-hook-form';
import z from 'zod';
import { authFormSchema } from '@/app/(auth)/_nextjs/components/authForm/authForm.utils';

export const signUpSchema = authFormSchema('sign-up');

export const signInSchema = authFormSchema('sign-in');

export type CustomInputProps = {
	control: Control<z.infer<typeof signUpSchema>>;
	name: FieldPath<z.infer<typeof signUpSchema>>;
	label: string;
	placeholder: string;
}
