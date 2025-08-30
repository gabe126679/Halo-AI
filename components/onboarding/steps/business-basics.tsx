'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from '../onboarding-wizard';

interface BusinessBasicsProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

const industries = [
  'Real Estate',
  'Healthcare', 
  'Legal Services',
  'Financial Services',
  'Insurance',
  'Automotive',
  'Home Services',
  'Education',
  'Technology',
  'Other',
];

const teamSizes = [
  '1-10',
  '11-50', 
  '51-200',
  '201-500',
  '500+',
];

export function BusinessBasics({ data, updateData }: BusinessBasicsProps) {
  const handleChange = (field: string, value: string) => {
    updateData('businessBasics', { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Tell Us About Your Business</h2>
        <p className="text-muted-foreground">
          This helps us customize your AI agent for your specific needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name *</Label>
          <Input
            id="company-name"
            value={data.businessBasics.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Your Company Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.businessBasics.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Industry *</Label>
          <Select 
            value={data.businessBasics.industry}
            onValueChange={(value) => handleChange('industry', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Team Size</Label>
          <Select 
            value={data.businessBasics.teamSize}
            onValueChange={(value) => handleChange('teamSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teamSizes.map(size => (
                <SelectItem key={size} value={size}>
                  {size} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Contact Email *</Label>
          <Input
            id="contact-email"
            type="email"
            value={data.businessBasics.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Contact Phone</Label>
          <Input
            id="contact-phone"
            value={data.businessBasics.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
    </div>
  );
}