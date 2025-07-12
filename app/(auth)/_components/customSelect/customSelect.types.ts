import { Control } from 'react-hook-form';

export interface CustomSelectProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
}
