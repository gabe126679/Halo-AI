'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import { toast } from 'sonner';

import { BusinessBasics } from './steps/business-basics';
import { GoalsChannels } from './steps/goals-channels';
import { Integrations } from './steps/integrations';
import { ScriptsFAQs } from './steps/scripts-faqs';
import { ComplianceRules } from './steps/compliance-rules';
import { VoicePersonality } from './steps/voice-personality';
import { Simulation } from './steps/simulation';
import { RecommendationPricing } from './steps/recommendation-pricing';
import { ReviewSubmit } from './steps/review-submit';

const steps = [
  { title: 'Business Basics', component: BusinessBasics },
  { title: 'Goals & Channels', component: GoalsChannels },
  { title: 'Integrations', component: Integrations },
  { title: 'Scripts & FAQs', component: ScriptsFAQs },
  { title: 'Compliance & Rules', component: ComplianceRules },
  { title: 'Voice & Personality', component: VoicePersonality },
  { title: 'Simulation', component: Simulation },
  { title: 'Recommendation', component: RecommendationPricing },
  { title: 'Review & Submit', component: ReviewSubmit },
];

export interface OnboardingData {
  businessBasics: {
    companyName: string;
    website: string;
    industry: string;
    teamSize: string;
    contactEmail: string;
    contactPhone: string;
  };
  goalsChannels: {
    goals: string[];
    priorities: string[];
  };
  integrations: {
    crms: string[];
    calendar: string;
    email: string;
  };
  scriptsFAQs: {
    uploadedFiles: File[];
    pastedContent: string;
    parsedQA: { question: string; answer: string }[];
  };
  complianceRules: {
    tcpaConsent: boolean;
    geoRestrictions: string[];
    businessHours: { start: string; end: string };
    escalationRules: string[];
  };
  voicePersonality: {
    agentName: string;
    tone: { friendly: number; concise: number; professional: number };
    language: string;
    speechRate: number;
    speechPitch: number;
    greeting: string;
    closing: string;
  };
  simulation: {
    completed: boolean;
    transcript: any[];
    outcome: string;
  };
  recommendedTier: string;
}

const defaultData: OnboardingData = {
  businessBasics: {
    companyName: '',
    website: '',
    industry: 'Real Estate',
    teamSize: '1-10',
    contactEmail: '',
    contactPhone: '',
  },
  goalsChannels: {
    goals: [],
    priorities: [],
  },
  integrations: {
    crms: [],
    calendar: '',
    email: '',
  },
  scriptsFAQs: {
    uploadedFiles: [],
    pastedContent: '',
    parsedQA: [],
  },
  complianceRules: {
    tcpaConsent: true,
    geoRestrictions: [],
    businessHours: { start: '09:00', end: '17:00' },
    escalationRules: [],
  },
  voicePersonality: {
    agentName: 'Alex',
    tone: { friendly: 70, concise: 50, professional: 80 },
    language: 'en-US',
    speechRate: 50,
    speechPitch: 50,
    greeting: 'Hi! Thanks for calling [Company Name]. How can I help you today?',
    closing: 'Thank you for your interest. Have a great day!',
  },
  simulation: {
    completed: false,
    transcript: [],
    outcome: '',
  },
  recommendedTier: 'Growth',
};

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setData(parsedData);
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify(data));
  }, [data]);

  const updateData = (section: keyof OnboardingData, sectionData: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...sectionData }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitOnboarding = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit onboarding');
      }

      const result = await response.json();
      
      toast.success('Onboarding completed successfully!');
      localStorage.removeItem('onboarding-progress');
      router.push('/success');
    } catch (error) {
      toast.error('Failed to submit onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Stepper 
        steps={steps.map(step => step.title)} 
        currentStep={currentStep} 
      />
      
      <Card>
        <CardContent className="p-8">
          <CurrentStepComponent
            data={data}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {isLastStep ? (
          <Button
            onClick={submitOnboarding}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Complete Onboarding'}
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}