import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CustomInputProps } from './customInput.types';

const CustomInput = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  className = '',
  isTextarea = false
}: CustomInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <div className='flex w-full flex-col gap-2'>
            <div>
              <FormLabel className="text-sm font-medium text-gray-700">
                {label}
              </FormLabel>
              {description && (
                <FormDescription className="text-xs font-normal text-gray-600">
                  {description}
                </FormDescription>
              )}
            </div>
            <div className="flex w-full flex-col ">
              <FormControl>
                {isTextarea ? (
                  <Textarea
                    placeholder={placeholder}
                    id={field.name}
                    {...field}
                  />
                ) : (
                  <Input
                    placeholder={placeholder}
                    type={type}
                    id={field.name}
                    {...field}
                    className='text-sm '
                  />
                )}
              </FormControl>
              <FormMessage className="text-xs text-red-500 mt-1" />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
