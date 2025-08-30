'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, MessageSquare, Phone, PhoneOff, Volume2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { agentEngine } from '@/lib/agent-engine';

interface VoiceAgentSimulatorProps {
  agentConfig: any;
  knowledgeBase: { question: string; answer: string }[];
  onComplete?: (transcript: any[], outcome: string) => void;
}

const scenarios = [
  {
    name: 'Property Inquiry',
    prompt: "Hi, I'm interested in scheduling a showing for the house on Oak Street.",
  },
  {
    name: 'General Question',
    prompt: "What are your office hours?",
  },
  {
    name: 'Pricing Inquiry', 
    prompt: "Can you tell me about your commission rates?",
  },
  {
    name: 'Financing Questions',
    prompt: "I have some questions about getting pre-approved for a mortgage.",
  },
];

export function VoiceAgentSimulator({ agentConfig, knowledgeBase, onComplete }: VoiceAgentSimulatorProps) {
  const [isListening, setIsListening] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [transcript, setTranscript] = useState<any[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setCurrentInput(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition error. Please try text input.');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startCall = () => {
    setIsCallActive(true);
    setTranscript([]);
    
    // Agent greeting
    const greeting = agentConfig.greeting.replace('[Company Name]', 'Your Company');
    addToTranscript('agent', greeting);
    speak(greeting);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsListening(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Generate outcome summary
    const outcome = generateOutcome(transcript);
    
    if (onComplete) {
      onComplete(transcript, outcome);
    }
  };

  const addToTranscript = (speaker: 'agent' | 'user', message: string, intent?: string) => {
    setTranscript(prev => [...prev, { 
      speaker, 
      message, 
      intent,
      timestamp: new Date().toISOString() 
    }]);
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = agentConfig.speechRate / 50;
    utterance.pitch = agentConfig.speechPitch / 50;
    
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported. Please use text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (currentInput.trim()) {
        handleUserInput(currentInput);
      }
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setCurrentInput('');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleUserInput(currentInput);
    }
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    addToTranscript('user', input);
    setCurrentInput('');

    try {
      const response = await agentEngine.processInput(input, knowledgeBase, agentConfig);
      addToTranscript('agent', response.message, response.intent);
      speak(response.message);
    } catch (error) {
      const fallbackMessage = "I apologize, but I'm having trouble processing that. Could you please rephrase your question?";
      addToTranscript('agent', fallbackMessage);
      speak(fallbackMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadScenario = (scenarioName: string) => {
    const scenario = scenarios.find(s => s.name === scenarioName);
    if (scenario) {
      setCurrentInput(scenario.prompt);
      setSelectedScenario(scenarioName);
    }
  };

  const exportTranscript = () => {
    const data = JSON.stringify(transcript, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-agent-simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateOutcome = (transcript: any[]) => {
    const userMessages = transcript.filter(t => t.speaker === 'user');
    const agentMessages = transcript.filter(t => t.speaker === 'agent');
    
    if (userMessages.length === 0) {
      return 'No user interaction recorded.';
    }

    const intents = agentMessages.map(m => m.intent).filter(Boolean);
    const hasAppointment = intents.includes('appointment_request');
    const hasInfo = intents.includes('information_provided');
    
    if (hasAppointment) {
      return 'Successfully qualified lead and scheduled appointment.';
    } else if (hasInfo) {
      return 'Provided requested information and captured lead interest.';
    } else {
      return 'Engaged with prospect and provided general assistance.';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={isCallActive ? endCall : startCall}
            variant={isCallActive ? 'destructive' : 'default'}
            size="lg"
          >
            {isCallActive ? (
              <>
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" />
                Start Call
              </>
            )}
          </Button>
          
          {isCallActive && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Call Active</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Select value={inputMode} onValueChange={(value: 'voice' | 'text') => setInputMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="voice">Voice Input</SelectItem>
            </SelectContent>
          </Select>
          
          {transcript.length > 0 && (
            <Button onClick={exportTranscript} variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Conversation</CardTitle>
                  <CardDescription>
                    {isCallActive ? 'Live simulation' : 'Start a call to begin'}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {isProcessing && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transcript.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg p-3 ${
                        entry.speaker === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm">{entry.message}</div>
                      {entry.intent && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {entry.intent.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isCallActive && (
            <Card>
              <CardContent className="p-4">
                {inputMode === 'voice' ? (
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? 'destructive' : 'default'}
                      size="lg"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Start Speaking
                        </>
                      )}
                    </Button>
                    {isListening && (
                      <div className="flex-1 p-2 bg-muted rounded">
                        <span className="text-sm text-muted-foreground">
                          {currentInput || 'Listening...'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleTextSubmit} className="flex space-x-2">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isProcessing}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!currentInput.trim() || isProcessing}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-semibold">Name:</span>
                <span className="ml-2 text-sm">{agentConfig.agentName}</span>
              </div>
              <div>
                <span className="text-sm font-semibold">Language:</span>
                <span className="ml-2 text-sm">{agentConfig.language}</span>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-semibold">Personality:</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Friendly</span>
                    <span>{agentConfig.tone.friendly}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Professional</span>
                    <span>{agentConfig.tone.professional}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Concise</span>
                    <span>{agentConfig.tone.concise}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scenarios</CardTitle>
              <CardDescription>
                Quick test scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.name}
                    variant="outline"
                    size="sm"
                    onClick={() => loadScenario(scenario.name)}
                    disabled={!isCallActive}
                    className="w-full justify-start text-left h-auto py-2"
                  >
                    <div>
                      <div className="font-semibold text-xs">{scenario.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {scenario.prompt}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}