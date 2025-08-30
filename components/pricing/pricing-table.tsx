'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

export function PricingTable() {
  const [isMonthly, setIsMonthly] = useState(true);

  const monthlyTiers = [
    {
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
        '1,000 minutes/month included',
      ],
      popular: false,
      cta: 'Start Free Trial',
    },
    {
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
        '3,000 minutes/month included',
        'SMS follow-up',
      ],
      popular: true,
      cta: 'Start Free Trial',
    },
    {
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
        '10,000 minutes/month included',
        'White-label options',
        'Advanced security',
      ],
      popular: false,
      cta: 'Contact Sales',
    },
  ];

  const oneTimeTiers = [
    {
      name: 'Basic Setup',
      price: '$3,000',
      description: 'Simple voice agent with basic features',
      features: [
        'Single-purpose agent',
        'Basic CRM integration',
        'Standard voice quality',
        'Email support for 90 days',
        'Basic analytics dashboard',
      ],
      note: 'No monthly fees. You handle hosting and maintenance.',
    },
    {
      name: 'Advanced Setup',
      price: '$5,500',
      description: 'Multi-feature agent with advanced capabilities',
      features: [
        'Multi-purpose agent',
        'Multiple integrations',
        'Premium voice quality',
        'Priority support for 6 months',
        'Advanced analytics',
        'Custom workflows',
      ],
      note: 'Includes 6 months of updates. Perfect for established businesses.',
    },
    {
      name: 'Enterprise Setup',
      price: '$7,500+',
      description: 'Fully custom solution for complex requirements',
      features: [
        'Completely custom agent',
        'Unlimited integrations',
        'Custom voice training',
        '1 year dedicated support',
        'Compliance packs included',
        'White-label solution',
        'Advanced security features',
      ],
      note: 'Price varies based on complexity. Includes 1 year of updates.',
    },
  ];

  const currentTiers = isMonthly ? monthlyTiers : oneTimeTiers;

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <Label htmlFor="pricing-toggle" className={!isMonthly ? 'text-muted-foreground' : ''}>
            Monthly Service
          </Label>
          <Switch
            id="pricing-toggle"
            checked={!isMonthly}
            onCheckedChange={(checked) => setIsMonthly(!checked)}
          />
          <Label htmlFor="pricing-toggle" className={isMonthly ? 'text-muted-foreground' : ''}>
            One-time Setup
          </Label>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentTiers.map((tier, index) => (
            <Card 
              key={tier.name} 
              className={`relative h-full ${
                'popular' in tier && tier.popular ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              {'popular' in tier && tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {isMonthly && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                {isMonthly && 'setup' in tier && (
                  <div className="text-sm text-muted-foreground">{tier.setup} setup fee</div>
                )}
                <CardDescription>{tier.description}</CardDescription>
                {'note' in tier && (
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                    {tier.note}
                  </div>
                )}
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
                
                <Button 
                  className="w-full" 
                  variant={('popular' in tier && tier.popular) ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/onboarding">
                    {'cta' in tier ? tier.cta : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Pricing FAQ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Usage Costs
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Additional usage beyond included minutes</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Phone calls:</span>
                  <span>$0.03-0.05/minute</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS messages:</span>
                  <span>$0.01/message</span>
                </div>
                <div className="flex justify-between">
                  <span>AI processing:</span>
                  <span>Included</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ul className="space-y-1">
                  <li>• 24/7 monitoring & uptime</li>
                  <li>• Regular model updates</li>
                  <li>• Security & compliance</li>
                  <li>• Basic customization</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Process</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ol className="space-y-1">
                  <li>1. Configuration & testing (2-3 days)</li>
                  <li>2. Integration setup (1-2 days)</li>
                  <li>3. Training & fine-tuning (1-2 days)</li>
                  <li>4. Go-live & monitoring (1 day)</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support & SLA</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="space-y-1">
                  <div><strong>Starter:</strong> Email support (24h response)</div>
                  <div><strong>Growth:</strong> Priority support (4h response)</div>
                  <div><strong>Pro:</strong> Dedicated support (1h response)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 py-8">
          <h3 className="text-xl font-semibold">Still have questions?</h3>
          <p className="text-muted-foreground">
            Let's discuss your specific needs and find the right solution.
          </p>
          <Button asChild size="lg">
            <Link href="#contact">
              Schedule a Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}