'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { OnboardingStepHeaderProps } from './step-header.types';

const STEP_LABELS = {
  1: 'Account Type',
  2: 'Personal Information',
  3: 'Account Setup',
  4: 'Contact Details',
  5: 'Verification',
  6: 'Business Information',
  7: 'Terms & Conditions',
} as const;

export default function OnboardingStepHeader({
  currentStep,
  totalSteps,
  title,
  subtitle,
  onBack,
  stepLabel,
  showProgressBar = true,
}: OnboardingStepHeaderProps) {
  const defaultStepLabel = STEP_LABELS[currentStep as keyof typeof STEP_LABELS] || 'Step';
  const displayLabel = stepLabel || defaultStepLabel;

  return (
    <div className='flex flex-col gap-6'>
      <div className="flex items-center justify-between">
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={onBack}
            className={cn(!onBack ? 'hidden': 'rounded-full border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0 inline-flex items-center justify-center' )}
            aria-label="Go back to previous step"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold whitespace-nowrap">
              Step {currentStep} of {totalSteps}
          </span>
        </div>
        <span className="truncate text-xs font-medium text-muted-foreground">{displayLabel}</span>
      </div>

      <div className='flex flex-col gap-1'>
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {title}
        </h2>
        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {showProgressBar && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">
              Progress
            </span>
            <span className="text-xs font-medium text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-700 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
