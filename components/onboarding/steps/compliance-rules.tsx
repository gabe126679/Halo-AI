'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '../onboarding-wizard';

interface ComplianceRulesProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

const geoOptions = [
  'United States',
  'Canada', 
  'United Kingdom',
  'European Union',
  'Australia',
  'No restrictions',
];

const escalationOptions = [
  'Transfer to human agent',
  'Take a detailed message',
  'Schedule callback',
  'Send email summary',
  'Create support ticket',
];

export function ComplianceRules({ data, updateData }: ComplianceRulesProps) {
  const handleTCPAChange = (checked: boolean) => {
    updateData('complianceRules', { tcpaConsent: checked });
  };

  const handleGeoChange = (geo: string, checked: boolean) => {
    const newGeo = checked 
      ? [...data.complianceRules.geoRestrictions, geo]
      : data.complianceRules.geoRestrictions.filter(g => g !== geo);
    
    updateData('complianceRules', { geoRestrictions: newGeo });
  };

  const handleEscalationChange = (escalation: string, checked: boolean) => {
    const newEscalation = checked 
      ? [...data.complianceRules.escalationRules, escalation]
      : data.complianceRules.escalationRules.filter(e => e !== escalation);
    
    updateData('complianceRules', { escalationRules: newEscalation });
  };

  const handleBusinessHoursChange = (field: 'start' | 'end', value: string) => {
    updateData('complianceRules', { 
      businessHours: { 
        ...data.complianceRules.businessHours, 
        [field]: value 
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Compliance & Rules</h2>
        <p className="text-muted-foreground">
          Set up compliance requirements and operational rules for your AI agent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legal Compliance</CardTitle>
              <CardDescription>
                Ensure your AI agent follows applicable regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={data.complianceRules.tcpaConsent}
                  onCheckedChange={handleTCPAChange}
                />
                <div>
                  <Label className="font-semibold">TCPA Compliance</Label>
                  <p className="text-sm text-muted-foreground">
                    Verify consent before making outbound calls or sending texts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Geographic Restrictions</CardTitle>
              <CardDescription>
                Select regions where your agent can operate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geoOptions.map((geo) => (
                  <div key={geo} className="flex items-center space-x-3">
                    <Checkbox
                      checked={data.complianceRules.geoRestrictions.includes(geo)}
                      onCheckedChange={(checked) => handleGeoChange(geo, checked as boolean)}
                    />
                    <Label className="font-normal">{geo}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Hours</CardTitle>
              <CardDescription>
                Set when your AI agent should be active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={data.complianceRules.businessHours.start}
                    onChange={(e) => handleBusinessHoursChange('start', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={data.complianceRules.businessHours.end}
                    onChange={(e) => handleBusinessHoursChange('end', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Escalation Rules</CardTitle>
              <CardDescription>
                What should happen when the AI can't help?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escalationOptions.map((escalation) => (
                  <div key={escalation} className="flex items-center space-x-3">
                    <Checkbox
                      checked={data.complianceRules.escalationRules.includes(escalation)}
                      onCheckedChange={(checked) => handleEscalationChange(escalation, checked as boolean)}
                    />
                    <Label className="font-normal">{escalation}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}