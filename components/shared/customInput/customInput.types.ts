import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type CustomInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  description?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  isTextarea?: boolean;
}
