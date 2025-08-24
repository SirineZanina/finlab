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
  currencyId: string;

  // Step 5: Verification
  ssn: string;
  phoneNumber: string;

  // Step 6: Business fields - required for all users since every user needs a business
  businessName: string;
  industry: string;

  // Step 7: Terms
  terms: boolean;
}

type OnboardingState = OnboardingData & {
  // Actions
  setAccountType: (type: 'individual' | 'business') => void;
  setPersonalInfo: (data: Pick<OnboardingData, 'firstName' | 'lastName' | 'dateOfBirth'>) => void;
  setAccountInfo: (data: Pick<OnboardingData, 'email' | 'password' | 'confirmPassword'>) => void; // New action
  setContactDetails: (data: Pick<OnboardingData, 'address' | 'currencyId'>) => void;
  setVerification: (data: Pick<OnboardingData, 'ssn' | 'phoneNumber'>) => void;
  setBusinessInfo: (data: Pick<OnboardingData, 'businessName' | 'industry'>) => void;
  setTerms: (terms: boolean) => void;

  // Utilities
  reset: () => void;
  canProceedFromStep: (step: number) => boolean;
}

const initialState: OnboardingData = {
  accountType: null,
  firstName: '',
  lastName: '',
  dateOfBirth: null, // Changed to null initially
  email: '',
  password: '',
  confirmPassword: '',
  address: null,
  ssn: '',
  phoneNumber: '',
  businessName: '',
  industry: '',
  currencyId: '',
  terms: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Specific setters for type safety
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
        set(data);

        // Auto-update business name for individual users
        const state = get();
        if (state.accountType === 'individual' && data.firstName && data.lastName) {
          set({ businessName: `${data.firstName} ${data.lastName}` });
        }
      },

      setAccountInfo: (data) => set(data), // New action for account setup

      setContactDetails: (data) => set(data),

      setVerification: (data) => set(data),

      setBusinessInfo: (data) => set(data),

      setTerms: (terms) => set({ terms }),

      // Utility functions
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
          return !!(state.businessName && state.industry && state.currencyId);
        case 7:
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
            // Convert dateOfBirth string back to Date object
            if (parsed.state?.dateOfBirth) {
              parsed.state.dateOfBirth = new Date(parsed.state.dateOfBirth);
            }
            return JSON.stringify(parsed); // getItem must return a string
          } catch (error) {
            console.error('Error parsing from localStorage:', error);
            return null;
          }
        },

        setItem: (key, value) => {
          try {
            const parsed = JSON.parse(value); // value is already a JSON string

            // Convert Date object to string before storing
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
        businessName: state.businessName,
        industry: state.industry,
        currencyId: state.currencyId,
        terms: state.terms,
	  }),
    }
  )
);
