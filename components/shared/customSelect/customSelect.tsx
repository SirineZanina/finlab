import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomSelectProps } from './customSelect.types';

const CustomSelect = <T extends Record<string, string>>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  className = ''
}: CustomSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${className}`}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full text-sm" id={field.name}>
                    <SelectValue className='truncate' placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs text-error-500" />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomSelect;
