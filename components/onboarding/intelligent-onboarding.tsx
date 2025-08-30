'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Upload, Brain, Play, Award } from 'lucide-react';
import { toast } from 'sonner';

// Step Components
import { BusinessDiscovery } from './intelligent-steps/business-discovery';
import { KnowledgeIngestion } from './intelligent-steps/knowledge-ingestion';
import { QuickConfig } from './intelligent-steps/quick-config';
import { IntelligentSimulation } from './intelligent-steps/intelligent-simulation';
import { ResultsAndCTA } from './intelligent-steps/results-and-cta';

export interface IntelligentOnboardingData {
  // Business Discovery
  businessProfile: {
    name: string;
    website: string;
    phone: string;
    industry: 'real_estate' | 'dental' | 'veterinary' | 'salon' | 'auto_shop' | 'hvac' | 'legal' | 'medical' | 'other';
    customIndustry?: string;
    locations: string[];
    teamSize: string;
    primaryGoals: string[];
    operatingHours: {
      weekdays: { start: string; end: string };
      weekends: { start: string; end: string };
    };
  };

  // Knowledge Ingestion
  knowledgeBase: {
    uploadedFiles: Array<{
      id: string;
      name: string;
      type: 'faq' | 'script' | 'pricing' | 'policies' | 'forms';
      status: 'processing' | 'completed' | 'error';
      extractedData?: any;
    }>;
    websiteData?: {
      url: string;
      extractedContent: any;
      status: 'processing' | 'completed' | 'error';
    };
    manualInput: {
      faqs: Array<{ question: string; answer: string }>;
      services: string[];
      policies: string[];
    };
    processingResults: {
      totalFaqs: number;
      detectedIntents: string[];
      knowledgeScore: number;
    };
  };

  // Quick Configuration
  agentConfig: {
    channels: ('voice' | 'sms' | 'webchat')[];
    bookingRules: {
      allowAfterHours: boolean;
      requireDeposit: boolean;
      autoConfirm: boolean;
    };
    voiceSettings: {
      voiceId: string;
      personality: 'professional' | 'friendly' | 'energetic' | 'calm';
      responseStyle: 'concise' | 'detailed' | 'consultative';
    };
  };

  // Simulation Results
  simulation: {
    scenario: string;
    transcript: Array<{
      speaker: 'user' | 'agent';
      message: string;
      timestamp: number;
      confidence?: number;
      knowledgeUsed?: string[];
      functionsTriggered?: string[];
    }>;
    metrics: {
      responseTime: number;
      intentAccuracy: number;
      bookingSuccess: boolean;
      satisfactionScore: number;
      knowledgeUtilization: number;
    };
    audioUrl?: string;
  };

  // Consents
  consents: {
    dataProcessing: boolean;
    websiteCrawling: boolean;
    recordSimulation: boolean;
  };
}

const STEPS = [
  {
    id: 'discovery',
    title: 'Business Discovery',
    subtitle: 'Tell us about your business',
    icon: CheckCircle,
    estimatedTime: '2 min'
  },
  {
    id: 'knowledge',
    title: 'Knowledge Upload',
    subtitle: 'Share your FAQs, scripts & policies',
    icon: Upload,
    estimatedTime: '2 min'
  },
  {
    id: 'config',
    title: 'Quick Setup',
    subtitle: 'Configure channels & voice',
    icon: Brain,
    estimatedTime: '1 min'
  },
  {
    id: 'simulation',
    title: 'Live Simulation',
    subtitle: 'Watch your AI agent in action',
    icon: Play,
    estimatedTime: '3 min'
  },
  {
    id: 'results',
    title: 'Results & Next Steps',
    subtitle: 'See the proof & book your call',
    icon: Award,
    estimatedTime: '2 min'
  }
];

const defaultData: IntelligentOnboardingData = {
  businessProfile: {
    name: '',
    website: '',
    phone: '',
    industry: 'real_estate',
    locations: [],
    teamSize: '1-5',
    primaryGoals: [],
    operatingHours: {
      weekdays: { start: '09:00', end: '17:00' },
      weekends: { start: '10:00', end: '14:00' }
    }
  },
  knowledgeBase: {
    uploadedFiles: [],
    manualInput: {
      faqs: [],
      services: [],
      policies: []
    },
    processingResults: {
      totalFaqs: 0,
      detectedIntents: [],
      knowledgeScore: 0
    }
  },
  agentConfig: {
    channels: ['voice', 'sms'],
    bookingRules: {
      allowAfterHours: false,
      requireDeposit: false,
      autoConfirm: true
    },
    voiceSettings: {
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice from ElevenLabs
      personality: 'professional',
      responseStyle: 'consultative'
    }
  },
  simulation: {
    scenario: '',
    transcript: [],
    metrics: {
      responseTime: 0,
      intentAccuracy: 0,
      bookingSuccess: false,
      satisfactionScore: 0,
      knowledgeUtilization: 0
    }
  },
  consents: {
    dataProcessing: false,
    websiteCrawling: false,
    recordSimulation: false
  }
};

export function IntelligentOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<IntelligentOnboardingData>(defaultData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTime] = useState(Date.now());

  const updateData = useCallback((section: keyof IntelligentOnboardingData, updates: any) => {
    setData(prev => ({
      ...prev,
      [section]: typeof updates === 'function' ? updates(prev[section]) : { ...prev[section], ...updates }
    }));
  }, []);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const timeElapsed = Math.floor((Date.now() - startTime) / 60000);

  const renderStepComponent = () => {
    const stepId = STEPS[currentStep].id;
    const commonProps = { data, updateData, onNext: nextStep, onPrev: prevStep };

    switch (stepId) {
      case 'discovery':
        return <BusinessDiscovery {...commonProps} />;
      case 'knowledge':
        return <KnowledgeIngestion {...commonProps} />;
      case 'config':
        return <QuickConfig {...commonProps} />;
      case 'simulation':
        return <IntelligentSimulation {...commonProps} />;
      case 'results':
        return <ResultsAndCTA {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Halo AI Setup
              </h1>
              <p className="text-muted-foreground mt-1">
                Get your AI agent ready in minutes, not hours
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Time Elapsed</div>
              <div className="text-2xl font-bold text-blue-600">{timeElapsed}m</div>
              <div className="text-xs text-muted-foreground">Target: ≤7m</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-6 px-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isUpcoming = index > currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center space-y-2 flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isActive ? 'bg-blue-600 text-white shadow-lg scale-110' : ''}
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {step.estimatedTime}
                    </div>
                  </div>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs">
                      {step.subtitle}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-xl text-center">
              {STEPS[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {renderStepComponent()}
          </CardContent>
        </Card>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {data.knowledgeBase.processingResults.totalFaqs}
            </div>
            <div className="text-xs text-muted-foreground">FAQs Processed</div>
          </div>
          <div className="p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {data.knowledgeBase.processingResults.detectedIntents.length}
            </div>
            <div className="text-xs text-muted-foreground">Intents Detected</div>
          </div>
          <div className="p-4 bg-white/60 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(data.knowledgeBase.processingResults.knowledgeScore * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Readiness Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}