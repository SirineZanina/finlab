import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { CustomInputProps } from './customInput.types';
import { FieldValues } from 'react-hook-form';

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  className = '',
  isTextarea = false,
  required = false,
  disabled = false,
  maxLength,
  rows = 4,
  min,
  max,
  step,
  autoComplete,
  readOnly = false
}: CustomInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={`flex flex-col gap-2 ${className}`}>
          <div className="flex flex-col gap-1">
            <FormLabel className={`text-sm font-semibold transition-colors ${
              fieldState.error
                ? 'text-error-600'
                : isFocused
                  ? 'text-primary-700'
                  : 'text-gray-700'
            }`}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            {description && (
              <FormDescription className="text-xs text-gray-500 leading-relaxed">
                {description}
              </FormDescription>
            )}
          </div>

          <FormControl>
            {isTextarea ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  maxLength={maxLength}
                  rows={rows}
                  autoComplete={autoComplete}
                  {...field}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`resize-y transition-all duration-200 ${
                    fieldState.error
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                  } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${
                    readOnly ? 'bg-gray-50 cursor-default' : ''
                  }`}
                />
                {maxLength && (
                  <div className="text-xs text-gray-400">
                    {field.value?.length || 0}/{maxLength}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {isPassword ? (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={placeholder}
                      type={inputType}
                      disabled={disabled}
                      readOnly={readOnly}
                      maxLength={maxLength}
                      min={min}
                      max={max}
                      step={step}
                      autoComplete={autoComplete}
                      {...field}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className={`flex-1 transition-all duration-200 ${
                        fieldState.error
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${
                        readOnly ? 'bg-gray-50 cursor-default' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                        fieldState.error
                          ? 'border-red-300 hover:border-red-500 text-red-400 hover:text-red-600'
                          : 'border-gray-300 hover:border-gray-400 text-gray-400 hover:text-gray-600'
                      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      disabled={disabled}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <Input
                    placeholder={placeholder}
                    type={inputType}
                    disabled={disabled}
                    readOnly={readOnly}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                    step={step}
                    autoComplete={autoComplete}
                    {...field}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`transition-all duration-200 ${
                      fieldState.error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${
                      readOnly ? 'bg-gray-50 cursor-default' : ''
                    }`}
                  />
                )}

                {maxLength && !isTextarea && (
                  <div className="text-xs text-gray-400">
                    {field.value?.length || 0}/{maxLength}
                  </div>
                )}
              </div>
            )}
          </FormControl>

          <FormMessage className="text-xs text-red-600 mt-1 flex items-center gap-1" />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
