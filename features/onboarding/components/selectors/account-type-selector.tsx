'use client';
import React from 'react';
import { useOnboardingStore } from '../../store';
import { useRouter } from 'next/navigation';
import IndividualCard from './individual-card/individual-card';
import BusinessCard from './business-card/business-card';
import OnboardingStepHeader from '@/app/(auth)/onboarding/_components/step-header/step-header';

type AccountType = 'individual' | 'business'

const AccountTypeSelector = () => {
  const router = useRouter();
  const { accountType, setAccountType } = useOnboardingStore();

  const totalSteps = 7;

  // Only handle selection, no navigation
  const handleSelection = (type: AccountType) => {
    setAccountType(type);
    router.push('/onboarding/personal-info');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
	  <OnboardingStepHeader
        currentStep={1}
        totalSteps={totalSteps}
        title='Choose your account type'
        subtitle='Select the type of account that best suits your needs.'
      />
      {/* Account Type Cards */}
      <div className="space-y-3">
        <IndividualCard
          isSelected={accountType === 'individual'}
          onSelect={() => handleSelection('individual')}
        />
        <BusinessCard
          isSelected={accountType === 'business'}
          onSelect={() => handleSelection('business')}

        />
      </div>

    </div>
  );
};

export default AccountTypeSelector;
