import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the onboarding data shape matching your new schema
export type OnboardingData = {
  // Step 1: Account Type
  accountType: 'individual' | 'business' | null;

  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null; // Changed to allow null initially

  // Step 3: Account Setup
  email: string;
  password: string;
  confirmPassword: string;

  // Step 4: Contact Details
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    countryId: string;
  } | null;

  // Step 5: Verification
  ssn: string;
  phoneNumber: string;

  // Step 7: OTP Verification
  OTPcode: string;
  isPhoneVerified: boolean;

  // Step 7: Business fields - required for all users since every user needs a business
  businessName: string;
  industry: string;
    currencyId: string;

  // Step 8: Terms
  terms: boolean;
}

type OnboardingState = OnboardingData & {
  // Actions
  setAccountType: (type: 'individual' | 'business') => void;
  setPersonalInfo: (data: Pick<OnboardingData, 'firstName' | 'lastName' | 'dateOfBirth'>) => void;
  setAccountInfo: (data: Pick<OnboardingData, 'email' | 'password' | 'confirmPassword'>) => void;
  setContactDetails: (data: Pick<OnboardingData, 'address'>) => void;
  setVerification: (data: Pick<OnboardingData, 'ssn' | 'phoneNumber'>) => void;
  setOTPVerification: (data: Pick<OnboardingData, 'OTPcode'>) => void;
  setBusinessInfo: (data: Pick<OnboardingData, 'businessName' | 'industry' | 'currencyId'>) => void;
  setTerms: (terms: boolean) => void;

  // Utilities
  reset: () => void;
  canProceedFromStep: (step: number) => boolean;
}

const initialState: OnboardingData = {
  accountType: null,
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  email: '',
  password: '',
  confirmPassword: '',
  address:{
    street: '',
    city: '',
    state: '',
    postalCode: '',
    countryId: '',
  },
  ssn: '',
  phoneNumber: '',
  OTPcode: '',
  isPhoneVerified: false,
  businessName: '',
  industry: '',
  currencyId: '',
  terms: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setAccountType: (type) => {
        set({ accountType: type });
        // Auto-populate business name for individual users
        if (type === 'individual') {
          const state = get();
          if (state.firstName && state.lastName) {
            set({ businessName: `${state.firstName} ${state.lastName}` });
          }
        }
      },

      setPersonalInfo: (data) => {
        // Ensure dateOfBirth is properly handled
        const processedData = {
          ...data,
          dateOfBirth: data.dateOfBirth instanceof Date ? data.dateOfBirth :
            data.dateOfBirth ? new Date(data.dateOfBirth) : null
        };
        set(processedData);
        // Auto-update business name for individual users
        const state = get();
        if (state.accountType === 'individual' && processedData.firstName && processedData.lastName) {
          set({ businessName: `${processedData.firstName} ${processedData.lastName}` });
        }
      },

      setAccountInfo: (data) => set(data),

      setContactDetails: (data) => set(data),

      setVerification: (data) => {
        set(data);
        // Reset phone verification if phone number changes
        const currentState = get();
        if (data.phoneNumber && data.phoneNumber !== currentState.phoneNumber) {
          set({ isPhoneVerified: false, OTPcode: '' });
        }
      },

      setOTPVerification: (data) => {
        set({
          ...data,
          isPhoneVerified: true, // Mark phone as verified when OTP is set
        });
      },

      setBusinessInfo: (data) => set(data),

      setTerms: (terms) => set({ terms }),

      reset: () => set(initialState),

      canProceedFromStep: (step: number) => {
        const state = get();
        switch (step) {
        case 1:
          return !!state.accountType;
        case 2:
          return !!(state.firstName && state.lastName && state.dateOfBirth);
        case 3:
          return !!(state.email && state.password && state.confirmPassword);
        case 4:
          return !!state.address;
        case 5:
          return !!(state.ssn.length >= 9 && state.phoneNumber);
        case 6:
          return !!(state.OTPcode && state.isPhoneVerified);
        case 7:
          return !!(state.businessName && state.industry && state.currencyId);
        case 8:
          return state.terms;
        default:
          return false;
        }
      }
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const item = localStorage.getItem(key);
          if (!item) return null;
          try {
            const parsed = JSON.parse(item);
            // Convert dateOfBirth string back to Date object after parsing
            if (parsed.state?.dateOfBirth && typeof parsed.state.dateOfBirth === 'string') {
              const date = new Date(parsed.state.dateOfBirth);
              parsed.state.dateOfBirth = isNaN(date.getTime()) ? null : date;
            }
            return item; // Return the original JSON string, Zustand will parse it
          } catch (error) {
            console.error('Error parsing from localStorage:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            const parsed = JSON.parse(value);
            // Convert Date object to ISO string before storing
            if (parsed.state?.dateOfBirth instanceof Date) {
              parsed.state.dateOfBirth = parsed.state.dateOfBirth.toISOString();
            }
            localStorage.setItem(key, JSON.stringify(parsed));
          } catch (error) {
            console.error('Error storing to localStorage:', error);
            localStorage.setItem(key, value); // fallback to original value
          }
        },
        removeItem: (key) => localStorage.removeItem(key),
      })),
      partialize: (state) => ({
        // Persist all fields except passwords for security
        accountType: state.accountType,
        firstName: state.firstName,
        lastName: state.lastName,
        dateOfBirth: state.dateOfBirth,
        email: state.email,
        address: state.address,
        ssn: state.ssn,
        phoneNumber: state.phoneNumber,
        OTPcode: state.OTPcode,
        isPhoneVerified: state.isPhoneVerified,
        businessName: state.businessName,
        industry: state.industry,
        currencyId: state.currencyId,
        terms: state.terms,
      }),
      // Add onRehydrateStorage as a backup to ensure dates are properly converted
      onRehydrateStorage: () => (state) => {
        if (state && state.dateOfBirth && typeof state.dateOfBirth === 'string') {
          const date = new Date(state.dateOfBirth);
          state.dateOfBirth = isNaN(date.getTime()) ? null : date;
        }
      },
    }
  )
);
