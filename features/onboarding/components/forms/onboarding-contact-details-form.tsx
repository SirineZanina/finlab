'use client';
import { Form } from '@/components/ui/form';
import { onboardingSchema } from '@/features/onboarding/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useOnboardingStore } from '../../store';
import { useEffect } from 'react';
import { useGetCountries } from '@/features/countries/api/use-get-countries'; // Assuming you have this
import CustomInput from '@/components/shared/customInput/customInput';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';
import { ArrowRight } from 'lucide-react';
import CustomSelect from '@/components/shared/customSelect/customSelect';
import CustomButton from '@/components/shared/customButton/customButton';

const onboardingContactDetailsSchema = onboardingSchema.pick({
  address: true,
});

type OnboardingContactDetailsSchema = z.infer<typeof onboardingContactDetailsSchema>;

export default function OnboardingContactDetails() {
  const router = useRouter();

  const countries = useGetCountries(); // You'll need this hook

  const countryOptions = countries.data?.map(country => ({
    value: country.id,
    label: country.name,
  })) || [];

  const email = useOnboardingStore((state) => state.email);
  const password = useOnboardingStore((state) => state.password);
  const confirmPassword = useOnboardingStore((state) => state.confirmPassword);

  const {
    setContactDetails,
    address,
  } = useOnboardingStore();

  const totalSteps = 8;
  const form = useForm<OnboardingContactDetailsSchema>({
    resolver: zodResolver(onboardingContactDetailsSchema),
    defaultValues: {
      address: address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        countryId: '',
      },
    },
  });

  // Check form validation status
  const isFormValid = form.formState.isValid;

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated) return;
    if (!email || !password || !confirmPassword) {
      console.warn('Account info is incomplete, redirecting to account setup form.');
      router.push('/onboarding/account-setup');
    }
  }, [email, password, confirmPassword, router]);

  const onSubmit = (data: OnboardingContactDetailsSchema) => {
    console.log('Form submitted with data:', data);
    setContactDetails(data);
    router.push('/onboarding/verification');
  };

  const handleBack = () => {
    router.push('/onboarding/account-setup');
  };

  return (
    <section className='flex flex-col gap-8'>
      <OnboardingStepHeader
        currentStep={4}
        totalSteps={totalSteps}
        title="Contact Details"
        subtitle="Please provide your contact details to proceed with the onboarding process."
        onBack={handleBack}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>

            <CustomInput
              control={form.control}
              name="address.street"
              label="Street Address"
              placeholder="Enter your street address"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                control={form.control}
                name="address.city"
                label="City"
                placeholder="Enter your city"
                required
              />

              <CustomInput
                control={form.control}
                name="address.state"
                label="State/Province"
                placeholder="Enter your state or province"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                control={form.control}
                name="address.postalCode"
                label="Postal Code"
                placeholder="Enter your postal code"
                required
              />
              <CustomSelect
                control={form.control}
                name="address.countryId"
                label="Country"
                placeholder="Select your country"
                options={countryOptions}
                required
              />
            </div>
          </div>

          <CustomButton
			 variant="default"
			 type="submit"
			 className="flex items-center gap-2"
            disabled={form.formState.isSubmitting || !isFormValid}

            onClick={() => {
              console.log(form.formState.isValid);
              console.log(form.getValues());
            }}
			 rightIcon={<ArrowRight className="w-4 h-4" />}
          >
			 {form.formState.isSubmitting ? 'Processing...' : 'Continue'}
          </CustomButton>
        </form>
      </Form>
    </section>
  );
}
