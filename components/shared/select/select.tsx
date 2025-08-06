'use client';

import { useMemo } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
// types
import { SelectProps } from './select.types';

export const Select = ({
  value,
  onChange,
  onCreate,
  options = [],
  placeholder,
  disabled
}: SelectProps) => {
  const onSelect = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#187D7E',
          primary75: '#31b099CC',
          primary50: '#31b09980',
          primary25: '#31b09940',
        },
      })}
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: 'transparent',
          borderColor: state.isFocused ? '#31b099' : '#e3e9f1',
          boxShadow: state.isFocused
            ? '0 0 0 3px rgba(49, 176, 153, 0.5)'
            : 'none',
          borderRadius: '0.5rem',
          minHeight: '2.5rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#31b099',
          },
        }),
        placeholder: (base) => ({
          ...base,
          color: '#62748e',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? '#187d7e'
            : state.isFocused
              ? '#31b09940'
              : 'transparent',
          color: state.isSelected ? 'white' : '#374151',
          '&:hover': {
            backgroundColor: state.isSelected ? '#187d7e' : '#31b09940',
          },
        }),
        menu: (base) => ({
          ...base,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};
