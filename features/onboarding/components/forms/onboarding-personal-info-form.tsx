'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { onboardingSchema } from '@/features/onboarding/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useOnboardingStore } from '../../store';
import CustomInput from '@/components/shared/customInput/customInput';
import CustomButton from '@/components/shared/customButton/customButton';
import { ArrowRight } from 'lucide-react';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';
import CalendarDatePicker from '@/components/shared/calendar-date-picker/calendar-date-picker';
import { useEffect } from 'react';
import { format } from 'date-fns';

const onboardingPersonalInfoSchema = onboardingSchema.pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
});

type OnboardingPersonalInfoSchema = z.infer<typeof onboardingPersonalInfoSchema>;

export default function OnboardingPersonalInfoForm() {
  const router = useRouter();

  const accountType = useOnboardingStore((state) => state.accountType);

  const {
    setPersonalInfo,
    firstName,
    lastName,
    dateOfBirth
  } = useOnboardingStore();

  const totalSteps = 7;

  const form = useForm<OnboardingPersonalInfoSchema>({
    resolver: zodResolver(onboardingPersonalInfoSchema),
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth || undefined, // ✅ Use Date object, not string
    },
  });

  // Check form validation status
  const isFormValid = form.formState.isValid;

  useEffect(() => {
	  if (!useOnboardingStore.persist.hasHydrated) return;
	  if (!accountType) {
	  console.warn('Account type is not set, redirecting to account type selection.');
	  router.push('/onboarding/account-type');
	  }
  }, [accountType, router]);

  const onSubmit = (data: OnboardingPersonalInfoSchema) => {
    setPersonalInfo({
      ...data,
      dateOfBirth: new Date(format(data.dateOfBirth!, 'yyyy-MM-dd')) // Ensure it's a Date object
    });
    console.log('Form submitted with data:', data);
    router.push('/onboarding/account-setup');
  };

  const handleBack = () => {
    router.push('/onboarding/account-type');
  };

  return (
    <section className='flex flex-col gap-8'>
      <OnboardingStepHeader
        currentStep={2}
        totalSteps={totalSteps}
        title="Tell us about yourself"
        subtitle="Please provide your personal information to proceed with the onboarding process."
        onBack={handleBack}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              required
            />

            <CustomInput
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              required
            />
          </div>

          <FormField
            name='dateOfBirth'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <CalendarDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    closeOnSelect
                    showTodayButton={false}
                    error={!!form.formState.errors.dateOfBirth}
                    errorMessage={form.formState.errors.dateOfBirth?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
