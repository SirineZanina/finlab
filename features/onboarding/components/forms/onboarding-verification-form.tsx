'use client';
import { Form, FormField } from '@/components/ui/form';
import { onboardingSchema } from '@/features/onboarding/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useOnboardingStore } from '../../store';
import { useEffect } from 'react';
import CustomInput from '@/components/shared/customInput/customInput';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';
import { ArrowRight } from 'lucide-react';
import CustomButton from '@/components/shared/customButton/customButton';
import PhoneInput from '@/components/shared/phone-number-input/phone-number-input';

const onboardingVerificationSchema = onboardingSchema.pick({
  ssn: true,
  phoneNumber: true,
});

type OnboardingVerificationSchema = z.infer<typeof onboardingVerificationSchema>;

export default function OnboardingVerificationForm() {
  const router = useRouter();

  const address = useOnboardingStore((state) => state.address);

  const {
    setVerification,
    ssn,
    phoneNumber,
  } = useOnboardingStore();

  const totalSteps = 7;
  const form = useForm<OnboardingVerificationSchema>({
    resolver: zodResolver(onboardingVerificationSchema),
    mode: 'onChange',
    defaultValues: {
      ssn: ssn || '',
	  phoneNumber: phoneNumber || '',
    },
  });

  // Check form validation status
  const isFormValid = form.formState.isValid;

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated) return;
    if (!address) {
      console.warn('Account info is incomplete, redirecting to account setup form.');
      router.push('/onboarding/contact-details');
    }
  }, [address, router]);

  const onSubmit = (data: OnboardingVerificationSchema) => {
    console.log('Form submitted with data:', data);
    setVerification(data);
    router.push('/onboarding/business-info');
  };

  const handleBack = () => {
    router.push('/onboarding/contact-details');
  };

  return (
    <section className='flex flex-col gap-8'>
      <OnboardingStepHeader
        currentStep={5}
        totalSteps={totalSteps}
        title='Verification'
        subtitle='Provide your verification details'
        onBack={handleBack}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>

          <CustomInput
            label='Social Security Number (SSN)'
            placeholder='Enter your SSN'
            control={form.control}
            name='ssn'
            required
		  />
		 <FormField
		  control={form.control}
		  name="phoneNumber"
		  render={({ field }) => (
              <PhoneInput
			  value={field.value}
			  onChange={(value) => field.onChange(value)}
			  onValidationChange={(isValid) => {
                  if (!isValid) {
				  form.setError('phoneNumber', { type: 'manual', message: 'Invalid phone number' });
                  } else {
				  form.clearErrors('phoneNumber');
                  }
			  }}
			  className="w-full"
                addressCountryId={address?.countryId}
			  placeholder="Enter your phone number"
			  />

		  )}
		 />

          <CustomButton
			 variant="default"
			 type="submit"
			 className="flex items-center gap-2"
            disabled={form.formState.isSubmitting || !isFormValid}
			 rightIcon={<ArrowRight className="w-4 h-4" />}
          >
			 {form.formState.isSubmitting ? 'Processing...' : 'Continue'}
          </CustomButton>
        </form>
      </Form>
    </section>
  );
}
