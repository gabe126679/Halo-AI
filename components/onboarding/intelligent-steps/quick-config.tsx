'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  MessageSquare, 
  Globe, 
  Settings, 
  Volume2,
  Calendar,
  CreditCard,
  Shield,
  Zap
} from 'lucide-react';
import { IntelligentOnboardingData } from '../intelligent-onboarding';

interface QuickConfigProps {
  data: IntelligentOnboardingData;
  updateData: (section: keyof IntelligentOnboardingData, updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CHANNELS = [
  { 
    id: 'voice' as const, 
    icon: Phone, 
    label: 'Voice Calls', 
    description: 'Answer phone calls with natural conversation',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    id: 'sms' as const, 
    icon: MessageSquare, 
    label: 'SMS/Text', 
    description: 'Respond to text messages instantly',
    color: 'bg-green-100 text-green-800'
  },
  { 
    id: 'webchat' as const, 
    icon: Globe, 
    label: 'Website Chat', 
    description: 'Live chat widget on your website',
    color: 'bg-purple-100 text-purple-800'
  }
];

const VOICE_PERSONALITIES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal, knowledgeable, trustworthy tone',
    icon: '👔',
    voiceId: 'pNInz6obpgDQGcFmaJgB' // Adam - professional male
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, conversational tone',
    icon: '😊',
    voiceId: 'EXAVITQu4vr4xnSDxMaL' // Bella - friendly female
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Upbeat, enthusiastic, engaging tone',
    icon: '⚡',
    voiceId: 'ErXwobaYiN019PkySvjV' // Antoni - energetic male
  },
  {
    id: 'calm',
    name: 'Calm & Reassuring',
    description: 'Gentle, patient, soothing tone',
    icon: '🕯️',
    voiceId: 'AZnzlk1XvdvUeBnXmlld' // Domi - calm female
  }
];

const RESPONSE_STYLES = [
  {
    id: 'concise',
    name: 'Concise',
    description: 'Short, direct answers that get to the point',
    example: '"Our office hours are 9 AM to 5 PM, Monday through Friday."'
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Comprehensive responses with extra context',
    example: '"We\'re open Monday through Friday from 9 AM to 5 PM. During these hours, you can reach us directly at [phone] or visit our office. We also offer after-hours emergency services."'
  },
  {
    id: 'consultative',
    name: 'Consultative',
    description: 'Helpful, asks follow-up questions to understand needs',
    example: '"Our office hours are 9 AM to 5 PM, Monday through Friday. Are you looking to schedule during regular hours, or do you need to discuss after-hours options?"'
  }
];

const INDUSTRY_PRESETS = {
  real_estate: {
    suggestedChannels: ['voice', 'sms', 'webchat'],
    suggestedPersonality: 'professional',
    suggestedStyle: 'consultative',
    bookingRules: {
      allowAfterHours: true,
      requireDeposit: false,
      autoConfirm: false
    }
  },
  dental: {
    suggestedChannels: ['voice', 'sms'],
    suggestedPersonality: 'friendly',
    suggestedStyle: 'detailed',
    bookingRules: {
      allowAfterHours: false,
      requireDeposit: true,
      autoConfirm: true
    }
  },
  veterinary: {
    suggestedChannels: ['voice', 'sms'],
    suggestedPersonality: 'calm',
    suggestedStyle: 'detailed',
    bookingRules: {
      allowAfterHours: true,
      requireDeposit: false,
      autoConfirm: true
    }
  },
  salon: {
    suggestedChannels: ['voice', 'sms', 'webchat'],
    suggestedPersonality: 'friendly',
    suggestedStyle: 'consultative',
    bookingRules: {
      allowAfterHours: false,
      requireDeposit: true,
      autoConfirm: false
    }
  }
};

export function QuickConfig({ data, updateData, onNext, onPrev }: QuickConfigProps) {
  const [hasAppliedPresets, setHasAppliedPresets] = useState(false);
  const agentConfig = data.agentConfig;
  const industry = data.businessProfile.industry;

  const applyIndustryPresets = () => {
    const presets = INDUSTRY_PRESETS[industry as keyof typeof INDUSTRY_PRESETS];
    if (!presets) return;

    updateData('agentConfig', {
      channels: presets.suggestedChannels,
      voiceSettings: {
        ...agentConfig.voiceSettings,
        personality: presets.suggestedPersonality,
        responseStyle: presets.suggestedStyle,
        voiceId: VOICE_PERSONALITIES.find(v => v.id === presets.suggestedPersonality)?.voiceId || agentConfig.voiceSettings.voiceId
      },
      bookingRules: presets.bookingRules
    });

    setHasAppliedPresets(true);
  };

  const handleChannelToggle = (channelId: typeof CHANNELS[0]['id'], enabled: boolean) => {
    const currentChannels = agentConfig.channels;
    const newChannels = enabled 
      ? [...currentChannels, channelId]
      : currentChannels.filter(c => c !== channelId);
    
    updateData('agentConfig', { channels: newChannels });
  };

  const handleVoiceSettingChange = (setting: string, value: any) => {
    updateData('agentConfig', {
      voiceSettings: {
        ...agentConfig.voiceSettings,
        [setting]: value
      }
    });

    // Update voiceId when personality changes
    if (setting === 'personality') {
      const personality = VOICE_PERSONALITIES.find(v => v.id === value);
      if (personality) {
        updateData('agentConfig', {
          voiceSettings: {
            ...agentConfig.voiceSettings,
            personality: value,
            voiceId: personality.voiceId
          }
        });
      }
    }
  };

  const handleBookingRuleChange = (rule: string, value: any) => {
    updateData('agentConfig', {
      bookingRules: {
        ...agentConfig.bookingRules,
        [rule]: value
      }
    });
  };

  const selectedPersonality = VOICE_PERSONALITIES.find(v => v.id === agentConfig.voiceSettings.personality);
  const selectedStyle = RESPONSE_STYLES.find(s => s.id === agentConfig.voiceSettings.responseStyle);

  const canProceed = agentConfig.channels.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Quick Agent Setup</h3>
        <p className="text-muted-foreground">
          Configure how your AI agent will communicate with customers
        </p>
      </div>

      {/* Industry Presets */}
      {!hasAppliedPresets && INDUSTRY_PRESETS[industry as keyof typeof INDUSTRY_PRESETS] && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Zap className="w-5 h-5" />
              Smart Defaults for {industry.replace('_', ' ')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              Apply optimized settings based on thousands of successful {industry.replace('_', ' ')} implementations.
            </p>
            <Button onClick={applyIndustryPresets} variant="outline" className="border-blue-300">
              Apply {industry.replace('_', ' ')} Presets
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Channels & Voice */}
        <div className="space-y-6">
          {/* Communication Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Communication Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const isEnabled = agentConfig.channels.includes(channel.id);
                
                return (
                  <div 
                    key={channel.id}
                    className={`
                      p-4 border rounded-lg transition-all cursor-pointer
                      ${isEnabled ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    `}
                    onClick={() => handleChannelToggle(channel.id, !isEnabled)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${channel.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{channel.label}</span>
                            {isEnabled && <Badge variant="secondary" className="text-xs">Enabled</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleChannelToggle(channel.id, checked)}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Voice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Voice & Personality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personality Selection */}
              <div>
                <Label className="text-sm font-medium">Voice Personality</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {VOICE_PERSONALITIES.map((personality) => (
                    <div
                      key={personality.id}
                      onClick={() => handleVoiceSettingChange('personality', personality.id)}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm
                        ${agentConfig.voiceSettings.personality === personality.id
                          ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{personality.icon}</div>
                        <div className="font-medium text-sm">{personality.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {personality.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Style */}
              <div>
                <Label className="text-sm font-medium">Response Style</Label>
                <Select 
                  value={agentConfig.voiceSettings.responseStyle} 
                  onValueChange={(value) => handleVoiceSettingChange('responseStyle', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSE_STYLES.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        <div>
                          <div className="font-medium">{style.name}</div>
                          <div className="text-xs text-muted-foreground">{style.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedStyle && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">Example Response:</div>
                    <div className="text-sm italic">{selectedStyle.example}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking & Policies */}
        <div className="space-y-6">
          {/* Booking Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking & Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Allow After-Hours Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Let customers book appointments outside business hours
                    </p>
                  </div>
                  <Switch
                    checked={agentConfig.bookingRules.allowAfterHours}
                    onCheckedChange={(checked) => handleBookingRuleChange('allowAfterHours', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Require Deposit</Label>
                    <p className="text-sm text-muted-foreground">
                      Ask for payment to secure appointments
                    </p>
                  </div>
                  <Switch
                    checked={agentConfig.bookingRules.requireDeposit}
                    onCheckedChange={(checked) => handleBookingRuleChange('requireDeposit', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-Confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm appointments without manual review
                    </p>
                  </div>
                  <Switch
                    checked={agentConfig.bookingRules.autoConfirm}
                    onCheckedChange={(checked) => handleBookingRuleChange('autoConfirm', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">TCPA Compliant Messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">HIPAA-Safe Data Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Automated Escalation Rules</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  Your AI agent automatically follows industry best practices and will escalate 
                  complex requests to human team members when appropriate.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {selectedPersonality && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-800 text-sm">Configuration Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Channels:</span>
                  <span className="font-medium">
                    {agentConfig.channels.map(c => 
                      CHANNELS.find(ch => ch.id === c)?.label
                    ).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Voice:</span>
                  <span className="font-medium">
                    {selectedPersonality.name} ({selectedPersonality.icon})
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Style:</span>
                  <span className="font-medium">{selectedStyle?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>After Hours:</span>
                  <span className="font-medium">
                    {agentConfig.bookingRules.allowAfterHours ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onPrev}>
          ← Back to Knowledge
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="min-w-40"
        >
          {!canProceed 
            ? 'Select at least one channel' 
            : 'Start Simulation →'
          }
        </Button>
      </div>
    </div>
  );
}