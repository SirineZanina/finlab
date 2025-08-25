import { Country } from '@/types/client/entities';

export type PhoneInputProps =  {
  value?: string;
  onChange?: (value: string, country: Country) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  addressCountryId?: string; // ISO country code from address input
  className?: string;
}
