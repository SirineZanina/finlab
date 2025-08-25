export type OnboardingStepHeaderProps = {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBackButton?: boolean;
  stepLabel?: string;
}

