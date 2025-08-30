'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OnboardingData } from '../onboarding-wizard';
import { 
  Building2, 
  Target, 
  Database, 
  FileText, 
  Shield, 
  Bot, 
  Play, 
  Award 
} from 'lucide-react';

interface ReviewSubmitProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

export function ReviewSubmit({ data }: ReviewSubmitProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review your configuration before submitting your onboarding request.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Building2 className="mr-2 h-5 w-5" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold">Company:</span>
              <span className="ml-2">{data.businessBasics.companyName}</span>
            </div>
            <div>
              <span className="font-semibold">Industry:</span>
              <span className="ml-2">{data.businessBasics.industry}</span>
            </div>
            <div>
              <span className="font-semibold">Team Size:</span>
              <span className="ml-2">{data.businessBasics.teamSize}</span>
            </div>
            <div>
              <span className="font-semibold">Contact:</span>
              <span className="ml-2">{data.businessBasics.contactEmail}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="mr-2 h-5 w-5" />
              Goals & Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold block mb-2">Goals:</span>
              <div className="flex flex-wrap gap-1">
                {data.goalsChannels.goals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold block mb-2">Priorities:</span>
              <div className="flex flex-wrap gap-1">
                {data.goalsChannels.priorities.map((priority, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Database className="mr-2 h-5 w-5" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold block mb-2">CRM Systems:</span>
              <div className="flex flex-wrap gap-1">
                {data.integrations.crms.map((crm, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {crm}
                  </Badge>
                ))}
              </div>
            </div>
            {data.integrations.calendar && (
              <div>
                <span className="font-semibold">Calendar:</span>
                <span className="ml-2">{data.integrations.calendar}</span>
              </div>
            )}
            {data.integrations.email && (
              <div>
                <span className="font-semibold">Email:</span>
                <span className="ml-2">{data.integrations.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 h-5 w-5" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold">Uploaded Files:</span>
              <span className="ml-2">{data.scriptsFAQs.uploadedFiles.length}</span>
            </div>
            <div>
              <span className="font-semibold">Q&A Pairs:</span>
              <span className="ml-2">{data.scriptsFAQs.parsedQA.length}</span>
            </div>
            {data.scriptsFAQs.pastedContent && (
              <div>
                <span className="font-semibold">Manual Content:</span>
                <Badge variant="outline" className="ml-2">Provided</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="mr-2 h-5 w-5" />
              Compliance & Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold">TCPA Compliance:</span>
              <Badge variant={data.complianceRules.tcpaConsent ? "default" : "secondary"} className="ml-2">
                {data.complianceRules.tcpaConsent ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div>
              <span className="font-semibold">Business Hours:</span>
              <span className="ml-2">
                {data.complianceRules.businessHours.start} - {data.complianceRules.businessHours.end}
              </span>
            </div>
            <div>
              <span className="font-semibold">Escalation Rules:</span>
              <span className="ml-2">{data.complianceRules.escalationRules.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bot className="mr-2 h-5 w-5" />
              Agent Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold">Agent Name:</span>
              <span className="ml-2">{data.voicePersonality.agentName}</span>
            </div>
            <div>
              <span className="font-semibold">Language:</span>
              <span className="ml-2">{data.voicePersonality.language}</span>
            </div>
            <div className="space-y-2">
              <span className="font-semibold">Personality Traits:</span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div>Friendly</div>
                  <Badge variant="outline">{data.voicePersonality.tone.friendly}%</Badge>
                </div>
                <div className="text-center">
                  <div>Professional</div>
                  <Badge variant="outline">{data.voicePersonality.tone.professional}%</Badge>
                </div>
                <div className="text-center">
                  <div>Concise</div>
                  <Badge variant="outline">{data.voicePersonality.tone.concise}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Play className="mr-2 h-5 w-5" />
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold">Status:</span>
              <Badge variant={data.simulation.completed ? "default" : "secondary"} className="ml-2">
                {data.simulation.completed ? "Completed" : "Not Started"}
              </Badge>
            </div>
            {data.simulation.completed && (
              <>
                <div>
                  <span className="font-semibold">Interactions:</span>
                  <span className="ml-2">{data.simulation.transcript.length}</span>
                </div>
                <div>
                  <span className="font-semibold">Outcome:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.simulation.outcome}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="mr-2 h-5 w-5" />
              Recommended Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold">Selected Tier:</span>
              <Badge variant="default" className="ml-2 text-sm">
                {data.recommendedTier}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              This plan was recommended based on your selected features and requirements.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>
            Here's what you can expect after submitting your onboarding request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>We'll review your configuration within 24 hours</li>
            <li>Our team will reach out to schedule a setup call</li>
            <li>We'll configure your integrations and test your agent</li>
            <li>You'll review and approve the final setup</li>
            <li>Go live with your AI voice agent (typically 5-7 days)</li>
          </ol>
          
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-semibold">
              Questions? We're here to help!
            </p>
            <p className="text-xs text-muted-foreground">
              Email us at support@anni.ai or call (555) 123-4567
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}