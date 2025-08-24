import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type CustomInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url' | 'search';
  className?: string;
  isTextarea?: boolean;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  autoComplete?: string;
  readOnly?: boolean;
}
