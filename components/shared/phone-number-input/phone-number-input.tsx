'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Search, Loader2, X, Check } from 'lucide-react';
import { PhoneInputProps } from './phone-number-input.types';
import { formatPhoneNumber, isValidPhoneNumber } from './phone-number-input.utils';
import Image from 'next/image';
import { useGetCountries } from '@/features/countries/api/use-get-countries';
import { useGetCountry } from '@/features/countries/api/use-get-country';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const PhoneInput = ({
  value = '',
  onChange,
  onValidationChange,
  placeholder = 'Enter phone number',
  disabled = false,
  addressCountryId,
  className = '',
}: PhoneInputProps) => {
  const { data: countries = [], isLoading, error } = useGetCountries();
  const addressCountry = useGetCountry(addressCountryId);

  const [searchQuery, setSearchQuery] = useState('');

  // Parse phone number and country from value prop
  const { selectedCountry, phoneNumber } = useMemo(() => {
    if (!value || countries.length === 0) {
      // Priority: addressCountry > US default > first country
      const defaultCountry = addressCountry?.data ||
                           countries.find(c => c.code === 'US') ||
                           countries[0];
      return {
        selectedCountry: defaultCountry || null,
        phoneNumber: ''
      };
    }

    // Find country by matching dial code
    const matchingCountry = countries
      .sort((a, b) => b.dialCode.length - a.dialCode.length) // Longest dial code first
      .find(c => value.startsWith(c.dialCode));

    if (matchingCountry) {
      return {
        selectedCountry: matchingCountry,
        phoneNumber: value.replace(matchingCountry.dialCode, '').replace(/\D/g, '')
      };
    }

    // Fallback to default country
    const defaultCountry = addressCountry?.data ||
                         countries.find(c => c.code === 'US') ||
                         countries[0];
    return {
      selectedCountry: defaultCountry || null,
      phoneNumber: value.replace(/\D/g, '')
    };
  }, [value, countries, addressCountry?.data]);

  // Filtered countries for dropdown
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(query)
    );
  }, [searchQuery, countries]);

  // Formatted phone display
  const formattedPhone = useMemo(() => {
    return formatPhoneNumber(phoneNumber, selectedCountry?.phoneFormat);
  }, [phoneNumber, selectedCountry?.phoneFormat]);

  // Validation state
  const isValid = useMemo(() => {
    if (!phoneNumber || !selectedCountry) return false;
    return isValidPhoneNumber(phoneNumber, selectedCountry.phoneFormat);
  }, [phoneNumber, selectedCountry]);

  // Handlers
  const handleCountrySelect = useCallback((countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      const fullNumber = country.dialCode + phoneNumber;
      onChange?.(fullNumber, country);
      setSearchQuery('');
    }
  }, [countries, phoneNumber, onChange]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCountry) return;

    const input = e.target.value;
    const numbersOnly = input.replace(/\D/g, '');
    const fullNumber = selectedCountry.dialCode + numbersOnly;
    const isValidNumber = isValidPhoneNumber(numbersOnly, selectedCountry.phoneFormat);

    onChange?.(fullNumber, selectedCountry);
    onValidationChange?.(isValidNumber);
  }, [selectedCountry, onChange, onValidationChange]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Loading state - show loading indicators in place but keep the component structure
  const showLoadingState = isLoading;

  // Error state
  if (error) {
    return (
      <div className={cn('flex items-center p-4 border-2 border-red-300 rounded-lg bg-red-50', className)}>
        <span className="text-red-600">Failed to load countries</span>
      </div>
    );
  }

  const getBorderColor = () => {
    if (disabled) return 'border-gray-200';
    if (phoneNumber) {
      return isValid ? 'border-green-500' : 'border-red-500';
    }
    return 'border-gray-300';
  };

  return (
    <div className={className}>
      <div className={cn(
        'flex items-center border-2 rounded-md transition-all duration-200',
        getBorderColor(),
        disabled && 'bg-gray-50 cursor-not-allowed text-gray-500',
      )}>
        {/* Country Selector */}
        <div className="border-r border-gray-200">
          <Select
            value={selectedCountry?.id || ''}
            onValueChange={handleCountrySelect}
            disabled={disabled || countries.length === 0}
          >
            <SelectTrigger className="border-0 rounded-l-lg rounded-r-none focus:ring-0 shadow-none w-auto min-w-[120px]" disabled={disabled || showLoadingState}>
              <SelectValue>
                {showLoadingState ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-4 animate-spin text-gray-400" />
                    <span className="text-gray-400 text-sm">Loading...</span>
                  </div>
                ) : selectedCountry ? (
                  <div className="flex items-center gap-2">
                    {selectedCountry.flagUrl ? (
                      <Image
                        src={selectedCountry.flagUrl}
                        alt={`${selectedCountry.name} flag`}
                        className="w-5 h-4 object-cover rounded border"
                        width={20}
                        height={16}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-5 h-4 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs">🏳️</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-700 text-sm">
                      {selectedCountry.dialCode}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Select country</span>
                )}
              </SelectValue>
            </SelectTrigger>

            <SelectContent className="w-80 p-0" align="start" side="top" sideOffset={4}>
              {/* Search Header */}
              <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-9 text-sm border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Countries List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={country.id}
                      className={cn(
                        'cursor-pointer focus:bg-primary-50 data-[highlighted]:bg-primary-50',
                        selectedCountry?.id === country.id && 'bg-primary-50 text-primary-700'
                      )}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {country.flagUrl ? (
                          <Image
                            src={country.flagUrl}
                            alt={`${country.name} flag`}
                            className="w-6 h-4 object-cover rounded border flex-shrink-0"
                            width={24}
                            height={16}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-6 h-4 bg-gray-300 rounded flex items-center justify-center flex-shrink-0 ">
                            <span className="text-xs">🏳️</span>
                          </div>
                        )}
                        <span className="flex-1 truncate text-sm">{country.name}</span>
                        <span className="font-medium text-gray-500 flex-shrink-0 text-sm">
                          {country.dialCode}
                        </span>
                        {selectedCountry?.id === country.id && (
                          <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-gray-500 text-sm">
                    No countries found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Phone Input */}
        <div className="flex-1 relative">
          <Input
            type="tel"
            value={showLoadingState ? '' : formattedPhone}
            onChange={handlePhoneChange}
            placeholder={showLoadingState ? 'Loading...' : placeholder}
            disabled={disabled || showLoadingState}
            className={cn(
              'border-0 rounded-l-none rounded-r-lg focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pr-10',
              (disabled || showLoadingState) && 'cursor-not-allowed text-gray-500 bg-transparent'
            )}
            autoComplete="tel"
          />
          {showLoadingState && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>

        {/* Validation Indicator */}
        {!showLoadingState && phoneNumber && (
          <div className="px-3 flex items-center" aria-hidden="true">
            <div className={cn(
              'w-2 h-2 rounded-full transition-colors duration-200',
              isValid ? 'bg-green-500' : 'bg-red-500'
            )} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInput;
