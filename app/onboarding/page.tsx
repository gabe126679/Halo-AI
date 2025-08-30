import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export const metadata = {
  title: 'Onboarding - Halo AI',
  description: 'Configure your AI voice agent and start capturing leads.',
};

export default function OnboardingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Let's Build Your Voice Agent
          </h1>
          <p className="text-lg text-muted-foreground">
            Follow these steps to configure your AI assistant and see it in action.
          </p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  );
}