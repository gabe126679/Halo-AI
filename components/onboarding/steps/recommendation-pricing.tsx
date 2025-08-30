'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Calendar, CreditCard } from 'lucide-react';
import { OnboardingData } from '../onboarding-wizard';

interface RecommendationPricingProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

const tiers = {
  Starter: {
    name: 'Starter',
    price: '$297',
    setup: '$499',
    description: 'Perfect for small teams getting started',
    features: [
      '1 phone number',
      '1 CRM integration', 
      'Basic analytics',
      'Email support',
      'Standard voice quality',
    ],
    score: 0,
  },
  Growth: {
    name: 'Growth',
    price: '$697',
    setup: '$999',
    description: 'For growing businesses with multiple channels',
    features: [
      'Multi-agent support',
      '2 CRM integrations',
      'Advanced analytics', 
      'Call routing',
      'Priority support',
      'Premium voice quality',
    ],
    score: 0,
  },
  Pro: {
    name: 'Pro',
    price: '$1,497',
    setup: '$1,999',
    description: 'Enterprise-grade solution with custom workflows',
    features: [
      'Custom workflows',
      'Unlimited integrations',
      'Compliance packs',
      'Dedicated support',
      'SLA guarantee',
      'Custom voice training',
    ],
    score: 0,
  },
};

export function RecommendationPricing({ data, updateData }: RecommendationPricingProps) {
  const [recommendation, setRecommendation] = useState('Growth');

  useEffect(() => {
    const recommended = calculateRecommendation(data);
    setRecommendation(recommended);
    updateData('recommendedTier', recommended);
  }, [data, updateData]);

  const calculateRecommendation = (data: OnboardingData) => {
    let scores = { Starter: 0, Growth: 0, Pro: 0 };
    
    // Score based on goals and channels
    const goalCount = data.goalsChannels.goals.length;
    if (goalCount <= 2) scores.Starter += 2;
    if (goalCount > 2 && goalCount <= 4) scores.Growth += 3;
    if (goalCount > 4) scores.Pro += 3;
    
    // Score based on integrations
    const crmCount = data.integrations.crms.length;
    if (crmCount <= 1) scores.Starter += 2;
    if (crmCount > 1 && crmCount <= 3) scores.Growth += 3;
    if (crmCount > 3) scores.Pro += 3;
    
    // Score based on compliance needs
    if (data.complianceRules.tcpaConsent) scores.Pro += 2;
    if (data.complianceRules.geoRestrictions.length > 0) scores.Growth += 1;
    if (data.complianceRules.escalationRules.length > 2) scores.Growth += 2;
    
    // Score based on team size
    const teamSize = data.businessBasics.teamSize;
    if (teamSize === '1-10') scores.Starter += 2;
    if (teamSize === '11-50' || teamSize === '51-200') scores.Growth += 3;
    if (teamSize === '201-500' || teamSize === '500+') scores.Pro += 3;
    
    // Score based on uploaded content complexity
    if (data.scriptsFAQs.parsedQA.length > 10) scores.Growth += 2;
    if (data.scriptsFAQs.parsedQA.length > 25) scores.Pro += 2;
    
    // Find highest scoring tier
    const maxScore = Math.max(scores.Starter, scores.Growth, scores.Pro);
    
    if (scores.Pro === maxScore) return 'Pro';
    if (scores.Growth === maxScore) return 'Growth';
    return 'Starter';
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Recommended Plan</h2>
        <p className="text-muted-foreground">
          Based on your requirements, we've selected the best plan for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(tiers).map(([key, tier]) => {
          const isRecommended = key === recommendation;
          
          return (
            <Card 
              key={key} 
              className={`relative h-full ${isRecommended ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}
            >
              {isRecommended && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Recommended
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="text-sm text-muted-foreground">{tier.setup} setup</div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {isRecommended && (
                  <div className="mt-6 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-semibold mb-1">
                      Why this plan?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Perfect match for {data.goalsChannels.goals.length} goals, 
                      {data.integrations.crms.length} integrations, and your team size.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          Ready to get started with the {recommendation} plan?
        </p>
        
        <div className="flex justify-center gap-4">
          <Button size="lg" className="px-8">
            <Calendar className="mr-2 h-4 w-4" />
            Book a Demo Call
          </Button>
          
          <Button size="lg" variant="outline" className="px-8">
            <CreditCard className="mr-2 h-4 w-4" />
            Start Trial
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          30-day money-back guarantee • No setup required for trial
        </p>
      </div>
    </div>
  );
}