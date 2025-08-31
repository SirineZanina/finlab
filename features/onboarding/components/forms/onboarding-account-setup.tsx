'use client';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '../../store';
import { useEffect } from 'react';
import { onboardingSchema } from '../../schema';
import z from 'zod';
import CustomInput from '@/components/shared/customInput/customInput';
import CustomButton from '@/components/shared/customButton/customButton';
import { ArrowRight } from 'lucide-react';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';

const onboardingAccountSetupSchema = onboardingSchema.pick({
  email: true,
  password: true,
  confirmPassword: true,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // This will show the error on the confirmPassword field
});

type OnboardingAccountSetupSchema = z.infer<typeof onboardingAccountSetupSchema>;

export default function OnboardingAccountSetupForm() {

  const router = useRouter();

  const firstName = useOnboardingStore((state) => state.firstName);
  const lastName = useOnboardingStore((state) => state.lastName);
  const dateOfBirth = useOnboardingStore((state) => state.dateOfBirth);

  const {
    setAccountInfo,
    email,
    password,
    confirmPassword
  } = useOnboardingStore();

  const totalSteps = 8;
  const form = useForm<OnboardingAccountSetupSchema>({
    resolver: zodResolver(onboardingAccountSetupSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: email || '',
      password: password || '',
      confirmPassword: confirmPassword || '',
    },
  });

  // Watch specific fields directly
  const watchedPassword = form.watch('password');
  const watchedConfirmPassword = form.watch('confirmPassword');

  // Check form validation status
  const isFormValid = form.formState.isValid;

  // Computed values based on watched fields
  const passwordsMatch = watchedPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword;
  const showPasswordMismatch = watchedPassword && watchedConfirmPassword && watchedPassword !== watchedConfirmPassword;

  // Handle form submission with auto-save
  const onSubmit = (data: OnboardingAccountSetupSchema) => {
    console.log('Form submitted with data:', data);
    setAccountInfo(data);
    router.push('/onboarding/contact-details');
  };

  const handleBack = () => {
    router.push('/onboarding/personal-info');
  };

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated) return;
    // Ensure previous step data is present
    if (!firstName || !lastName || !dateOfBirth) {
	  console.warn('Personal info is incomplete, redirecting to personal info form.');
	  router.push('/onboarding/personal-info');
    }
  }, [firstName, lastName, dateOfBirth, router]);

  return (
    <section className='flex flex-col gap-8'>
      <OnboardingStepHeader
        currentStep={3}
        totalSteps={totalSteps}
        title="Account Setup"
        subtitle="Fill in your account credentials"
        onBack={handleBack}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <CustomInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            description="We'll use this email for account verification and communication"
            required

          />
          <CustomInput
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            description="Password must be at least 8 characters long"
            required

          />
          <CustomInput
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            description={
              showPasswordMismatch
                ? "⚠️ Passwords don't match"
                : passwordsMatch
                  ? '✅ Passwords match'
                  : 'Please confirm your password'
            }
            required
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
