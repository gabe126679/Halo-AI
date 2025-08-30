'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Globe, Phone, MapPin, Users, Target, Clock, Sparkles } from 'lucide-react';
import { IntelligentOnboardingData } from '../intelligent-onboarding';
import { toast } from 'sonner';

interface BusinessDiscoveryProps {
  data: IntelligentOnboardingData;
  updateData: (section: keyof IntelligentOnboardingData, updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const INDUSTRIES = [
  { value: 'real_estate', label: 'Real Estate', icon: '🏠', color: 'bg-blue-100 text-blue-800' },
  { value: 'dental', label: 'Dental Practice', icon: '🦷', color: 'bg-green-100 text-green-800' },
  { value: 'veterinary', label: 'Veterinary Clinic', icon: '🐕', color: 'bg-purple-100 text-purple-800' },
  { value: 'salon', label: 'Salon & Spa', icon: '💅', color: 'bg-pink-100 text-pink-800' },
  { value: 'auto_shop', label: 'Auto Shop', icon: '🚗', color: 'bg-orange-100 text-orange-800' },
  { value: 'hvac', label: 'HVAC Services', icon: '❄️', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'legal', label: 'Legal Services', icon: '⚖️', color: 'bg-gray-100 text-gray-800' },
  { value: 'medical', label: 'Medical Practice', icon: '🏥', color: 'bg-red-100 text-red-800' },
  { value: 'other', label: 'Other', icon: '🏢', color: 'bg-indigo-100 text-indigo-800' }
];

const PRIMARY_GOALS = [
  { value: 'faster_response', label: 'Faster Lead Response', description: 'Respond to inquiries in under 60 seconds' },
  { value: 'reduce_no_shows', label: 'Reduce No-Shows', description: 'Automated reminders and confirmations' },
  { value: 'after_hours', label: 'After-Hours Coverage', description: 'Capture leads when you\'re closed' },
  { value: 'appointment_booking', label: 'Auto Appointment Booking', description: 'Let customers book instantly' },
  { value: 'qualify_leads', label: 'Pre-Qualify Leads', description: 'Filter and prioritize inquiries' },
  { value: 'customer_support', label: 'Customer Support', description: 'Answer FAQs and handle requests' }
];

const TEAM_SIZES = [
  { value: '1-5', label: '1-5 people', description: 'Small team or solo practice' },
  { value: '6-20', label: '6-20 people', description: 'Growing business' },
  { value: '21-50', label: '21-50 people', description: 'Established company' },
  { value: '50+', label: '50+ people', description: 'Large organization' }
];

export function BusinessDiscovery({ data, updateData, onNext }: BusinessDiscoveryProps) {
  const [isAutoEnrichEnabled, setIsAutoEnrichEnabled] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentResults, setEnrichmentResults] = useState<any>(null);

  const businessProfile = data.businessProfile;

  const handleInputChange = (field: string, value: any) => {
    updateData('businessProfile', { [field]: value });
  };

  const handleGoalsChange = (goalValue: string, checked: boolean) => {
    const currentGoals = businessProfile.primaryGoals || [];
    const newGoals = checked 
      ? [...currentGoals, goalValue]
      : currentGoals.filter(g => g !== goalValue);
    handleInputChange('primaryGoals', newGoals);
  };

  const selectedIndustry = INDUSTRIES.find(ind => ind.value === businessProfile.industry);

  const autoEnrichBusiness = async () => {
    if (!businessProfile.website) {
      toast.error('Please enter your website URL first');
      return;
    }

    setIsEnriching(true);
    
    try {
      const response = await fetch('/api/business-enrichment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          website: businessProfile.website,
          businessName: businessProfile.name 
        })
      });

      if (!response.ok) throw new Error('Failed to enrich business data');
      
      const results = await response.json();
      setEnrichmentResults(results);
      
      // Auto-populate fields if found
      if (results.businessName && !businessProfile.name) {
        handleInputChange('name', results.businessName);
      }
      if (results.phone && !businessProfile.phone) {
        handleInputChange('phone', results.phone);
      }
      if (results.locations && results.locations.length > 0) {
        handleInputChange('locations', results.locations);
      }
      if (results.hours) {
        handleInputChange('operatingHours', results.hours);
      }

      toast.success('Business information auto-populated!');
    } catch (error) {
      toast.error('Could not auto-enrich business data. Please fill manually.');
    } finally {
      setIsEnriching(false);
    }
  };

  const canProceed = businessProfile.name && 
                    businessProfile.industry && 
                    businessProfile.primaryGoals?.length > 0 &&
                    data.consents.dataProcessing;

  return (
    <div className="space-y-8">
      {/* Consent Banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent"
              checked={data.consents.dataProcessing}
              onCheckedChange={(checked) => 
                updateData('consents', { dataProcessing: checked })
              }
            />
            <div className="space-y-2">
              <Label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                I allow Halo AI to use my business information to create a personalized simulation
              </Label>
              <p className="text-xs text-muted-foreground">
                Your data is encrypted and only used to demonstrate AI capabilities. You can delete it anytime.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Basics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Maple & Main Realty"
                  value={businessProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="website">Website URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="website"
                    placeholder="https://yourbusiness.com"
                    value={businessProfile.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={autoEnrichBusiness}
                    disabled={!businessProfile.website || isEnriching}
                    className="shrink-0"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    {isEnriching ? 'Scanning...' : 'Auto-Fill'}
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="auto-enrich"
                    checked={data.consents.websiteCrawling}
                    onCheckedChange={(checked) => 
                      updateData('consents', { websiteCrawling: checked })
                    }
                  />
                  <Label htmlFor="auto-enrich" className="text-xs">
                    Allow auto-enrichment from website & Google Business Profile
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={businessProfile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="locations">Locations/Areas Served</Label>
                <Textarea
                  id="locations"
                  placeholder="e.g., Albany NY, Troy NY, Saratoga Springs NY"
                  value={businessProfile.locations.join(', ')}
                  onChange={(e) => handleInputChange('locations', e.target.value.split(', ').filter(Boolean))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Weekdays</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="9:00"
                      value={businessProfile.operatingHours.weekdays.start}
                      onChange={(e) => handleInputChange('operatingHours', {
                        ...businessProfile.operatingHours,
                        weekdays: { ...businessProfile.operatingHours.weekdays, start: e.target.value }
                      })}
                    />
                    <span className="flex items-center">to</span>
                    <Input
                      placeholder="17:00"
                      value={businessProfile.operatingHours.weekdays.end}
                      onChange={(e) => handleInputChange('operatingHours', {
                        ...businessProfile.operatingHours,
                        weekdays: { ...businessProfile.operatingHours.weekdays, end: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Weekends</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="10:00"
                      value={businessProfile.operatingHours.weekends.start}
                      onChange={(e) => handleInputChange('operatingHours', {
                        ...businessProfile.operatingHours,
                        weekends: { ...businessProfile.operatingHours.weekends, start: e.target.value }
                      })}
                    />
                    <span className="flex items-center">to</span>
                    <Input
                      placeholder="14:00"
                      value={businessProfile.operatingHours.weekends.end}
                      onChange={(e) => handleInputChange('operatingHours', {
                        ...businessProfile.operatingHours,
                        weekends: { ...businessProfile.operatingHours.weekends, end: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Industry & Goals */}
        <div className="space-y-6">
          {/* Industry Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Industry & Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What type of business is this?</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {INDUSTRIES.map((industry) => (
                    <div
                      key={industry.value}
                      onClick={() => handleInputChange('industry', industry.value)}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
                        ${businessProfile.industry === industry.value 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{industry.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{industry.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {businessProfile.industry === 'other' && (
                <div>
                  <Label htmlFor="customIndustry">Specify Your Industry</Label>
                  <Input
                    id="customIndustry"
                    placeholder="e.g., Pet Grooming, Photography Studio"
                    value={businessProfile.customIndustry || ''}
                    onChange={(e) => handleInputChange('customIndustry', e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label>Team Size</Label>
                <Select 
                  value={businessProfile.teamSize} 
                  onValueChange={(value) => handleInputChange('teamSize', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div>
                          <div className="font-medium">{size.label}</div>
                          <div className="text-xs text-muted-foreground">{size.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Primary Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Primary Goals
                <Badge variant="secondary">Select 1-3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PRIMARY_GOALS.map((goal) => (
                  <div key={goal.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={goal.value}
                      checked={businessProfile.primaryGoals?.includes(goal.value) || false}
                      onCheckedChange={(checked) => handleGoalsChange(goal.value, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={goal.value} className="font-medium cursor-pointer">
                        {goal.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enrichment Results */}
      {enrichmentResults && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800">Auto-Enrichment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-700">
              Found: {enrichmentResults.businessName && `Business name, `}
              {enrichmentResults.phone && `Phone number, `}
              {enrichmentResults.locations?.length > 0 && `${enrichmentResults.locations.length} locations, `}
              {enrichmentResults.hours && `Operating hours, `}
              {enrichmentResults.services?.length > 0 && `${enrichmentResults.services.length} services`}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <div></div>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="min-w-32"
        >
          Next: Upload Knowledge
          {!canProceed && businessProfile.name && (
            <div className="ml-2 text-xs">
              {!data.consents.dataProcessing ? '(Consent required)' : 
               businessProfile.primaryGoals?.length === 0 ? '(Select goals)' : ''}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}