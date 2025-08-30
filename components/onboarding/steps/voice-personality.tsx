'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '../onboarding-wizard';

interface VoicePersonalityProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
];

export function VoicePersonality({ data, updateData }: VoicePersonalityProps) {
  const handleChange = (field: string, value: any) => {
    updateData('voicePersonality', { [field]: value });
  };

  const handleToneChange = (toneType: 'friendly' | 'concise' | 'professional', value: number[]) => {
    updateData('voicePersonality', { 
      tone: { 
        ...data.voicePersonality.tone, 
        [toneType]: value[0] 
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Voice & Personality</h2>
        <p className="text-muted-foreground">
          Customize how your AI agent sounds and behaves during conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Identity</CardTitle>
              <CardDescription>
                Give your agent a name and personality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  value={data.voicePersonality.agentName}
                  onChange={(e) => handleChange('agentName', e.target.value)}
                  placeholder="Alex"
                />
              </div>

              <div>
                <Label>Language & Locale</Label>
                <Select 
                  value={data.voicePersonality.language}
                  onValueChange={(value) => handleChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Speech Settings</CardTitle>
              <CardDescription>
                Adjust how your agent speaks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Speech Rate</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={[data.voicePersonality.speechRate]}
                    onValueChange={(value) => handleChange('speechRate', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Speech Pitch</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={[data.voicePersonality.speechPitch]}
                    onValueChange={(value) => handleChange('speechPitch', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Normal</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personality Traits</CardTitle>
              <CardDescription>
                Adjust your agent's communication style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Friendly ({data.voicePersonality.tone.friendly}%)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={[data.voicePersonality.tone.friendly]}
                    onValueChange={(value) => handleToneChange('friendly', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Reserved</span>
                    <span>Warm & Friendly</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Concise ({data.voicePersonality.tone.concise}%)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={[data.voicePersonality.tone.concise]}
                    onValueChange={(value) => handleToneChange('concise', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Detailed</span>
                    <span>Brief & Direct</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Professional ({data.voicePersonality.tone.professional}%)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={[data.voicePersonality.tone.professional]}
                    onValueChange={(value) => handleToneChange('professional', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Casual</span>
                    <span>Formal & Professional</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Script Templates</CardTitle>
              <CardDescription>
                Customize greeting and closing messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="greeting">Greeting Template</Label>
                <Textarea
                  id="greeting"
                  value={data.voicePersonality.greeting}
                  onChange={(e) => handleChange('greeting', e.target.value)}
                  placeholder="Hi! Thanks for calling [Company Name]. How can I help you today?"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="closing">Closing Template</Label>
                <Textarea
                  id="closing"
                  value={data.voicePersonality.closing}
                  onChange={(e) => handleChange('closing', e.target.value)}
                  placeholder="Thank you for your interest. Have a great day!"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}