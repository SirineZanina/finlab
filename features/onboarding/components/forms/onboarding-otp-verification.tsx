'use client';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';
import React, { useEffect, useState, useCallback } from 'react';
import { onboardingSchema } from '../../schema';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '../../store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import CustomButton from '@/components/shared/customButton/customButton';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestOTP } from '@/features/auth/api/use-request-otp';
import { useVerifyOTP } from '@/features/auth/api/use-verify-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const onBoardingVerifyOTPSchema = onboardingSchema.pick({
  OTPcode: true,
  isPhoneVerified: true,
});

type OnBoardingVerifyOTPSchema = z.infer<typeof onBoardingVerifyOTPSchema>;

const OnboardingOtpVerification = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [initialOTPSent, setInitialOTPSent] = useState(false);

  const phoneNumber = useOnboardingStore((state) => state.phoneNumber);
  const ssn = useOnboardingStore((state) => state.ssn);
  const {
    setOTPVerification,
    OTPcode,
    isPhoneVerified,
  } = useOnboardingStore();

  // React Query hooks
  const requestOTP = useRequestOTP();
  const verifyOTP = useVerifyOTP();

  const totalSteps = 7;

  const form = useForm<OnBoardingVerifyOTPSchema>({
    resolver: zodResolver(onBoardingVerifyOTPSchema),
    mode: 'onChange',
    defaultValues: {
      OTPcode: OTPcode || '',
	  isPhoneVerified: isPhoneVerified || false,
    },
  });

  // Check form validation status
  const isFormValid = form.formState.isValid && form.watch('OTPcode')?.length === 6;

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = useCallback(async () => {
    if (!phoneNumber) {
      toast.error('Phone number is missing');
      return;
    }

    try {
      const result = await requestOTP.mutateAsync({ phoneNumber });

      if (result.success) {
        toast.success('OTP sent successfully');
        setCountdown(result.retryAfter || 60); // Use retryAfter from API response or default to 60
      }
    } catch (error) {
      // Handle different error types from your API
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    }
  }, [phoneNumber, requestOTP]);

  // Check if user has completed previous steps and send initial OTP
  useEffect(() => {
    if (!useOnboardingStore.persist.hasHydrated()) return;

    if (!phoneNumber || !ssn) {
      console.warn('Verification is incomplete, redirecting to verification step.');
      router.push('/onboarding/verification');
      return;
    }

    // Send OTP automatically when component loads (if not already sent)
    if (phoneNumber && !initialOTPSent) {
      sendOTP();
      setInitialOTPSent(true);
    }
  }, [phoneNumber, ssn, router, initialOTPSent, sendOTP]);

  const onSubmit = async (data: OnBoardingVerifyOTPSchema) => {
    if (!phoneNumber) {
      toast.error('Phone number is missing');
      return;
    }

    try {
      const result = await verifyOTP.mutateAsync({
        phoneNumber,
        otp: data.OTPcode,
      });

      if (result.success) {
        // Update the store with verified OTP
        setOTPVerification({ OTPcode: data.OTPcode });

        toast.success('Phone number verified successfully');
        // Navigate to next step (business info)
        router.push('/onboarding/business-info');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed. Please try again.';
      toast.error(errorMessage);
      form.setError('OTPcode', {
        type: 'manual',
        message: 'Invalid OTP code',
      });
    }
  };

  const handleBack = () => {
    router.push('/onboarding/verification');
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      sendOTP();
      form.reset({ OTPcode: '' }); // Clear the OTP input
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Basic formatting - adjust based on your phone number format
    if (phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone; // Return as-is if not standard 10-digit format
  };

  return (
    <section className='flex flex-col gap-8'>
      <OnboardingStepHeader
        currentStep={6} // This should be step 6 for OTP verification
        totalSteps={totalSteps}
        title='Phone Verification'
        subtitle={`Enter the 6-digit code sent to ${formatPhoneNumber(phoneNumber)}`}
        onBack={handleBack}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name="OTPcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="w-full flex justify-between">
                      <InputOTPSlot index={0} className="flex-1" />
                      <InputOTPSlot index={1} className="flex-1" />
                      <InputOTPSlot index={2} className="flex-1" />
                      <InputOTPSlot index={3} className="flex-1" />
                      <InputOTPSlot index={4} className="flex-1" />
                      <InputOTPSlot index={5} className="flex-1" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col gap-4'>
			 <CustomButton
              variant='secondary'
              type="button"
              className="flex items-center gap-2 w-full"
              disabled={countdown > 0 || requestOTP.isPending}
              onClick={handleResendOTP}
              leftIcon={requestOTP.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : undefined}
            >
              {requestOTP.isPending ? 'Sending...' : countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
            </CustomButton>

            <CustomButton
              variant="default"
              type="submit"
              className="flex items-center gap-2 w-full"
              disabled={!isFormValid || verifyOTP.isPending}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {verifyOTP.isPending ? 'Verifying...' : 'Verify & Continue'}
            </CustomButton>
		 </div>

        </form>
      </Form>
    </section>
  );
};

export default OnboardingOtpVerification;
