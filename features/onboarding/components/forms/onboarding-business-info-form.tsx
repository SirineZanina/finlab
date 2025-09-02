'use client';
import React, { useEffect } from 'react';
import { onboardingSchema } from '../../schema';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { useGetCurrencies } from '@/features/currencies/api/use-get-currencies';
import { useOnboardingStore } from '../../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';
import { Form } from '@/components/ui/form';
import CustomInput from '@/components/shared/customInput/customInput';
import CustomButton from '@/components/shared/customButton/customButton';
import CustomSelect from '@/components/shared/customSelect/customSelect';
import { BusinessIndustries } from '@/types/client/entities';
import { ArrowRight } from 'lucide-react';
import { useGetRoles } from '@/features/auth/api/use-get-roles';

const onboardingBusinessInfoSchema = onboardingSchema.pick({
  businessName: true,
  industry: true,
  currencyId: true,
  roleId: true,
});

type OnboardingBusinessInfoSchema = z.infer<typeof onboardingBusinessInfoSchema>;

const OnboardingBusinessInfoForm = () => {
  const router = useRouter();

  // API hooks
  const { data: currencies = [] } = useGetCurrencies();
  const { data: roles = [] } = useGetRoles();

  // Transform data for select options
  const currencyOptions = currencies.map(currency => ({
    value: currency.id,
    label: `${currency.name} (${currency.code})`
  }));

  const industryOptions = Object.values(BusinessIndustries).map(industry => ({
    value: industry,
    label: industry.charAt(0).toUpperCase() + industry.slice(1).toLowerCase().replace(/_/g, ' '),
  }));

  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.roleType.charAt(0).toUpperCase() + role.roleType.slice(1).toLowerCase().replace(/_/g, ' '),
  }));

  // Store state
  const {
    setBusinessInfo,
    businessName,
    industry,
    currencyId,
    roleId,
    ssn,
    phoneNumber,
  } = useOnboardingStore();

  const totalSteps = 7;

  const form = useForm<OnboardingBusinessInfoSchema>({
    resolver: zodResolver(onboardingBusinessInfoSchema),
    defaultValues: {
      businessName: businessName || '',
      industry: industry || '',
      currencyId: currencyId || '',
      roleId: roleId || '',
    },
  });

  const { formState: { isValid, isSubmitting } } = form;

  // Redirect if previous steps aren't completed
  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated) return;

    if (!ssn || !phoneNumber) {
      console.warn('Account info is incomplete, redirecting to verification step.');
      router.push('/onboarding/verification');
    }
  }, [ssn, phoneNumber, router]);

  const onSubmit = (data: OnboardingBusinessInfoSchema) => {
    console.log('Business info form submitted:', data);
    setBusinessInfo(data);
    router.push('/onboarding/summary');
  };

  const handleBack = () => {
    router.push('/onboarding/verification');
  };

  return (
    <section className="flex flex-col gap-8">
      <OnboardingStepHeader
        currentStep={6}
        totalSteps={totalSteps}
        title="Business Information"
        subtitle="Tell us about your business to customize your experience."
        onBack={handleBack}
      />

      <div className="max-w-lg mx-auto w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name and Role - Same line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Business Name"
                placeholder="Enter your business name"
                control={form.control}
                name="businessName"
                required
              />
              <CustomSelect
                label="Your Role"
                placeholder="Select your role in the business"
                control={form.control}
                name="roleId"
                options={roleOptions}
                required
              />
            </div>

            {/* Industry and Currency - Same line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomSelect
                label="Business Industry"
                placeholder="Select your business industry"
                control={form.control}
                name="industry"
                options={industryOptions}
                required
              />
              <CustomSelect
                label="Preferred Currency"
                placeholder="Select your preferred currency"
                control={form.control}
                name="currencyId"
                options={currencyOptions}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <CustomButton
                variant="default"
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isSubmitting || !isValid}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Processing...' : 'Continue'}
              </CustomButton>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default OnboardingBusinessInfoForm;
