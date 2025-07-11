import { Control, FieldPath } from 'react-hook-form';
import z from 'zod';
import { signUpSchema } from '../authForm/authForm.schema';

export type CustomInputProps = {
	control: Control<z.infer<typeof signUpSchema>>;
	name: FieldPath<z.infer<typeof signUpSchema>>;
	label: string;
	placeholder: string;
}
