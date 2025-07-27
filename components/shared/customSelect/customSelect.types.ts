import { Control, FieldPath, FieldValues } from 'react-hook-form';

export type CustomSelectProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
  className?: string;
}
