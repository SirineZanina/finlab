import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomSelectProps } from './customSelect.types';

const CustomSelect = ({ control, name, label, placeholder, options }: CustomSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='flex flex-col gap-1.5 w-full'>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className='w-full' id={field.name}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className='max-h-60 overflow-y-auto'>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className='form-message mt-2' />
        </div>
      )}
    />
  );
};

export default CustomSelect;
