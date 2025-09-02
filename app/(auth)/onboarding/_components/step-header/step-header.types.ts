export type OnboardingStepHeaderProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  onBack: () => void;
  stepLabel?: string;
  showProgressBar?: boolean;
}
