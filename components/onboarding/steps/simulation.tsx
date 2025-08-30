'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceAgentSimulator } from '@/components/voice-agent-simulator';
import { OnboardingData } from '../onboarding-wizard';

interface SimulationProps {
  data: OnboardingData;
  updateData: (section: keyof OnboardingData, sectionData: any) => void;
}

export function Simulation({ data, updateData }: SimulationProps) {
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const handleSimulationComplete = (transcript: any[], outcome: string) => {
    updateData('simulation', {
      completed: true,
      transcript,
      outcome,
    });
    setIsSimulationActive(false);
  };

  const startSimulation = () => {
    setIsSimulationActive(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Test Your Voice Agent</h2>
        <p className="text-muted-foreground">
          Try out your configured AI agent with realistic scenarios before going live.
        </p>
      </div>

      {!isSimulationActive && !data.simulation.completed && (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Ready to Test?</CardTitle>
            <CardDescription>
              Your agent has been configured with your settings. Let's see how it performs!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={startSimulation} size="lg">
              Start Simulation
            </Button>
          </CardContent>
        </Card>
      )}

      {isSimulationActive && (
        <VoiceAgentSimulator
          agentConfig={data.voicePersonality}
          knowledgeBase={data.scriptsFAQs.parsedQA}
          onComplete={handleSimulationComplete}
        />
      )}

      {data.simulation.completed && !isSimulationActive && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Simulation Completed!</CardTitle>
            <CardDescription>
              Your agent performed well. Here's a summary of the interaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Outcome:</h4>
              <p className="text-muted-foreground">{data.simulation.outcome}</p>
            </div>
            
            {data.simulation.transcript.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Conversation Summary:</h4>
                <div className="bg-muted p-4 rounded-lg space-y-2 max-h-60 overflow-y-auto">
                  {data.simulation.transcript.map((entry, index) => (
                    <div key={index} className={`text-sm ${entry.speaker === 'agent' ? 'text-blue-600' : 'text-green-600'}`}>
                      <strong>{entry.speaker === 'agent' ? 'Agent' : 'You'}:</strong> {entry.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={startSimulation}>
                Try Another Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}