'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from '../onboarding-wizard';

interface IntegrationsProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

const crms = [
  'Salesforce',
  'HubSpot',
  'Follow Up Boss',
  'Zoho CRM',
  'Airtable',
  'Pipedrive',
  'Monday.com',
  'Other',
  'None currently',
];

const calendars = [
  'Google Calendar',
  'Outlook Calendar',
  'Calendly',
  'Acuity Scheduling',
  'Other',
  'None',
];

const emailProviders = [
  'Gmail',
  'Outlook',
  'Mailchimp',
  'Constant Contact',
  'SendGrid',
  'Other',
  'None',
];

export function Integrations({ data, updateData }: IntegrationsProps) {
  const handleCRMChange = (crm: string, checked: boolean) => {
    const newCRMs = checked 
      ? [...data.integrations.crms, crm]
      : data.integrations.crms.filter(c => c !== crm);
    
    updateData('integrations', { crms: newCRMs });
  };

  const handleCalendarChange = (calendar: string) => {
    updateData('integrations', { calendar });
  };

  const handleEmailChange = (email: string) => {
    updateData('integrations', { email });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Connect your existing tools so your AI agent can seamlessly update your workflows.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">CRM Systems *</Label>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {crms.map((crm) => (
              <div key={crm} className="flex items-center space-x-3">
                <Checkbox
                  checked={data.integrations.crms.includes(crm)}
                  onCheckedChange={(checked) => handleCRMChange(crm, checked as boolean)}
                />
                <Label className="font-normal">{crm}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Calendar System</Label>
            <Select 
              value={data.integrations.calendar}
              onValueChange={handleCalendarChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select calendar system" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map(calendar => (
                  <SelectItem key={calendar} value={calendar}>
                    {calendar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Email Provider</Label>
            <Select 
              value={data.integrations.email}
              onValueChange={handleEmailChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select email provider" />
              </SelectTrigger>
              <SelectContent>
                {emailProviders.map(email => (
                  <SelectItem key={email} value={email}>
                    {email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}