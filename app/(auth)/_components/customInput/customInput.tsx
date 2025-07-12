import React from 'react';
// components
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
// types
import { CustomInputProps } from './customInput.types';

const CustomInput = ({ control, name, label, placeholder } : CustomInputProps ) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel>
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={name === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className='form-message mt-2'/>
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
