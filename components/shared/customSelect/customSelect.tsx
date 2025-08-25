import React, { useState, useMemo } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomSelectProps } from './customSelect.types';

const CustomSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    placeholder = 'Select an option...',
    options,
    className,
    triggerClassName,
    contentClassName,
    disabled = false,
    required = false,
    clearable = false,
    searchable = true,
    onValueChange,
    onSearch,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
  }: CustomSelectProps<TFieldValues, TName>) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue.trim()) {
      return options;
    }

    const query = searchValue.toLowerCase().trim();
    return options.filter(option =>
      typeof option.label === 'string' && option.label.toLowerCase().includes(query)  ||
      option.value.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query)
    );
  }, [options, searchValue, searchable]);

  const handleSearchChange = (query: string) => {
    setSearchValue(query);
    onSearch?.(query);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleValueChange = (value: string) => {
          const newValue = clearable && value === field.value ? '' : value;
          field.onChange(newValue);
          onValueChange?.(newValue);
          setOpen(false);
          setSearchValue('');
        };

        const handleClearSelection = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          field.onChange('');
          onValueChange?.('');
        };

        const selectedOption = options.find(option => option.value === field.value);
        const isEmpty = !field.value;
        const hasError = !!fieldState.error;

        return (
          <FormItem className={cn('flex flex-col space-y-2', className)}>
            {/* Label Section */}
            {label && (
              <div className="space-y-1">
                <FormLabel
                  className={cn(
                    'text-sm font-medium leading-none',
                    'text-slate-700 dark:text-slate-300',
                    hasError && 'text-red-600 dark:text-red-400',
                    disabled && 'text-slate-400 dark:text-slate-600'
                  )}
                  htmlFor={field.name}
                >
                  {label}
                  {required && (
                    <span className="ml-1 text-red-500" aria-label="required">
                      *
                    </span>
                  )}
                </FormLabel>

                {description && (
                  <FormDescription className="text-xs text-slate-600 dark:text-slate-400">
                    {description}
                  </FormDescription>
                )}
              </div>
            )}

            {/* Select Control */}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    type="button"
                    aria-expanded={open}
                    disabled={disabled || !options.length}
                    className={cn(
                      'w-full justify-between text-left font-normal',
                      'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                      'focus:ring-2 focus:ring-blue-500/20',
                      hasError && 'border-red-500 focus:ring-red-500/20',
                      disabled && 'cursor-not-allowed opacity-50',
                      isEmpty && 'text-slate-500 dark:text-slate-400',
                      triggerClassName
                    )}
                    id={field.name}
                    aria-label={ariaLabel || label}
                    aria-describedby={ariaDescribedBy || (description ? `${field.name}-description` : undefined)}
                    aria-invalid={hasError}
                    aria-required={required}
                  >
                    <span className="truncate">
                      {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center gap-1">
                      {clearable && field.value && (
                        <X
                          className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                          onClick={handleClearSelection}
                        />
                      )}
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    </div>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className={cn(
                    'w-[--radix-popover-trigger-width] p-0',
                    'shadow-lg border border-slate-200 dark:border-slate-800',
                    contentClassName
                  )}
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Command shouldFilter={false}>
                    {searchable && (
                      <CommandInput
                        placeholder="Search options..."
                        value={searchValue}
                        onValueChange={handleSearchChange}
                        className="h-9"
                      />
                    )}
                    <CommandList className="max-h-48">
                      <CommandEmpty>
                        {searchValue ? (
                          <div className="text-center py-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                              No results for {searchValue}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchValue('')}
                              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-auto p-1"
                            >
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
                            No options available
                          </p>
                        )}
                      </CommandEmpty>

                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            onSelect={() => handleValueChange(option.value)}
                            className={cn(
                              'flex items-center gap-2 cursor-pointer',
                              'hover:bg-slate-100 dark:hover:bg-slate-800',
                              option.disabled && 'cursor-not-allowed opacity-50'
                            )}
                          >
                            <Check
                              className={cn(
                                'h-4 w-4',
                                option.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-medium truncate">
                                {option.label}
                              </span>
                              {option.description && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {option.description}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>

            {/* Error Message */}
            <FormMessage className="text-xs text-red-600 dark:text-red-400 font-medium" />
          </FormItem>
        );
      }}
    />
  );
};

export default CustomSelect;
