'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../../store';
import { completeOnboarding } from '@/lib/actions/user.actions';
import CustomButton from '@/components/shared/customButton/customButton';
import { CheckCircle, Shield } from 'lucide-react';
import { AppError } from '@/lib/errors/appError';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';
import { Checkbox } from '@/components/ui/checkbox';

const OnboardingCompletionStep = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessName = useOnboardingStore((state) => state.businessName);
  const industry = useOnboardingStore((state) => state.industry);
  const currencyId = useOnboardingStore((state) => state.currencyId);
  const roleId = useOnboardingStore((state) => state.roleId);
  const { setTerms, terms } = useOnboardingStore();

  // Get all data from the store
  const onboardingData = useOnboardingStore();
  const { reset: resetStore } = useOnboardingStore();

  const totalSteps = 7;

  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated()) return;

    if (!businessName || !industry || !currencyId || !roleId) {
      console.warn('Business info incomplete, redirecting to business-info form.');
      router.push('/onboarding/business-info');
    }
  }, [businessName, industry, currencyId, roleId, router]);

  const handleCompleteOnboarding = async () => {
    if (!terms) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update terms in store
      setTerms(true);

      // Transform the store data to match the server action expectations
      const submissionData = {
        accountType: onboardingData.accountType,
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        dateOfBirth: onboardingData.dateOfBirth!,
        email: onboardingData.email,
        password: onboardingData.password,
        confirmPassword: onboardingData.confirmPassword,
        address: onboardingData.address,
        ssn: onboardingData.ssn,
        phoneNumber: onboardingData.phoneNumber,
        businessName: onboardingData.businessName,
        industry: onboardingData.industry,
        currencyId: onboardingData.currencyId,
        roleId: onboardingData.roleId,
        terms: true,
      };

      console.log('Submitting onboarding data:', submissionData);

      const result = await completeOnboarding(submissionData);

      if (result.success) {
        resetStore();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);

      if (error instanceof AppError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove unused functions and simplify
  const handleBack = () => {
    router.push('/onboarding/business-info');
  };

  const handleTermsChange = (checked: boolean) => {
    setTerms(checked);
    if (error && checked) {
      setError(null); // Clear error when terms are accepted
    }
  };

  return (
    <section className="flex flex-col gap-8 pb-8">
      <OnboardingStepHeader
        currentStep={totalSteps}
        totalSteps={totalSteps}
        title="Complete Your Account Setup"
        subtitle="Review and accept terms to finish"
        onBack={handleBack}
        showProgressBar={false}
      />

      <div className="max-w-2xl mx-auto w-full space-y-6">
		 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Legal Agreement</h4>
              <p className="text-sm text-blue-700">Required to create your account</p>
            </div>
          </div>

          <div className="flex items-center" >
            <Checkbox
              checked={terms}
              onCheckedChange={(checked) => handleTermsChange(!!checked)}
              id="terms"
              className="cursor-pointer"
		  />
		  <label htmlFor="terms" className="ml-3 select-none text-sm text-gray-700">
			I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Privacy Policy</a>.
		  </label>
		  </div>
        </div>

        {/* Complete button section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="text-center space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Ready to Get Started?</h4>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your account will be created and you&apos;ll be automatically signed in to access your dashboard
            </p>
          </div>

          <div className="mt-6">
            <CustomButton
              variant="default"
              className={`w-full h-12 flex items-center justify-center gap-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
                terms && !isSubmitting
                  ? 'bg-primary-700 hover:bg-primary-800'
                  : 'bg-gray-400 cursor-not-allowed hover:shadow-md'
              }`}
              disabled={isSubmitting || !terms}
              onClick={handleCompleteOnboarding}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Your Account...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete Account Setup
                </>
              )}
            </CustomButton>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OnboardingCompletionStep;
