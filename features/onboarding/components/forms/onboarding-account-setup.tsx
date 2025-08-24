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
import OnboardingStepHeader from '@/app/onboarding/_components/step-header/step-header';

const onboardingAccountSetupSchema = onboardingSchema.pick({
  email: true,
  password: true,
  confirmPassword: true,
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

  const totalSteps = 7;

  const form = useForm<OnboardingAccountSetupSchema>({
    resolver: zodResolver(onboardingAccountSetupSchema),
    defaultValues: {
	  email: email || '',
	  password: password || '',
	  confirmPassword: confirmPassword || '',
    },
  });

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated) return;
    if (!firstName || !lastName || !dateOfBirth) {
	  console.warn('Personal info is incomplete, redirecting to personal info form.');
	  router.push('/onboarding/personal-info');
    }
  }, [firstName, lastName, dateOfBirth, router]);

  const onSubmit = (data: OnboardingAccountSetupSchema) => {
    console.log('Form submitted with data:', data);
    setAccountInfo(data);
    router.push('/onboarding/contact-details');
  };

  const handleBack = () => {
    router.push('/onboarding/personal-info');
  };

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
            required
          />
          <CustomButton
            variant="default"
            type="submit"
            className="flex items-center gap-2"
            disabled={form.formState.isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {form.formState.isSubmitting ? 'Processing...' : 'Continue'}
          </CustomButton>
        </form>
      </Form>
    </section>
  );

}
