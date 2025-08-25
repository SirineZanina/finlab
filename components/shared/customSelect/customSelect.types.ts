import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface CustomSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  // Form props
  control: Control<TFieldValues>;
  name: TName;

  // UI props
  label?: string;
  description?: string;
  placeholder?: string;
  options: readonly SelectOption[];

  // Styling
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  // Behavior
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  searchable?: boolean;

  // Events
  onValueChange?: (value: string) => void;
  onSearch?: (query: string) => void;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

interface SelectOption {
  readonly value: string;
  readonly label: string | React.ReactNode;
  readonly disabled?: boolean;
  readonly description?: string;
}
