'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play,
  Square,
  Mic,
  MicOff,
  MessageSquare,
  Phone,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  Volume2,
  Brain,
  Zap,
  FileText
} from 'lucide-react';
import { IntelligentOnboardingData } from '../intelligent-onboarding';
import { toast } from 'sonner';

interface IntelligentSimulationProps {
  data: IntelligentOnboardingData;
  updateData: (section: keyof IntelligentOnboardingData, updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SIMULATION_SCENARIOS = {
  real_estate: [
    {
      id: 'zillow_lead',
      title: 'Zillow Lead Follow-up',
      description: 'New lead asks about a property listing after hours',
      userMessage: 'Hi, I saw your listing for the house on Maple Street. Is it still available? Can I schedule a showing for this weekend?',
      difficulty: 'Medium',
      expectedOutcomes: ['Property availability check', 'Showing scheduled', 'Contact details captured']
    },
    {
      id: 'price_reduction',
      title: 'Price Reduction Inquiry',
      description: 'Potential buyer asks about negotiating price',
      userMessage: 'I\'m interested in the Colonial on Oak Drive, but the price seems high. Are you open to offers? What\'s the lowest you\'d accept?',
      difficulty: 'Hard',
      expectedOutcomes: ['Qualify buyer interest', 'Schedule agent callback', 'Set expectations']
    },
    {
      id: 'first_time_buyer',
      title: 'First-Time Homebuyer',
      description: 'New buyer needs guidance on the process',
      userMessage: 'I\'ve never bought a house before and I\'m feeling overwhelmed. Can you walk me through how this works?',
      difficulty: 'Easy',
      expectedOutcomes: ['Provide process overview', 'Schedule consultation', 'Lender referral offered']
    }
  ],
  dental: [
    {
      id: 'emergency_toothache',
      title: 'Emergency Toothache',
      description: 'Patient with severe tooth pain needs immediate help',
      userMessage: 'I have a terrible toothache that started last night. The pain is unbearable. Can someone see me today?',
      difficulty: 'Medium',
      expectedOutcomes: ['Assess urgency', 'Same-day appointment', 'Pain management advice']
    },
    {
      id: 'routine_cleaning',
      title: 'Routine Cleaning Booking',
      description: 'Returning patient wants to schedule cleaning',
      userMessage: 'Hi, it\'s time for my 6-month cleaning. I prefer mornings if possible. What do you have available next week?',
      difficulty: 'Easy',
      expectedOutcomes: ['Check availability', 'Book appointment', 'Confirm insurance']
    },
    {
      id: 'insurance_question',
      title: 'Insurance Coverage Question',
      description: 'New patient asks about insurance acceptance',
      userMessage: 'I just got new dental insurance through my job. Do you accept Blue Cross? What would a cleaning and X-rays cost me?',
      difficulty: 'Medium',
      expectedOutcomes: ['Verify insurance', 'Explain benefits', 'Schedule appointment']
    }
  ],
  veterinary: [
    {
      id: 'sick_pet',
      title: 'Sick Pet Concern',
      description: 'Pet owner worried about their dog\'s symptoms',
      userMessage: 'My dog has been vomiting since yesterday and won\'t eat. She seems lethargic. Should I be worried?',
      difficulty: 'Hard',
      expectedOutcomes: ['Assess symptoms', 'Schedule urgent visit', 'Provide guidance']
    },
    {
      id: 'vaccination',
      title: 'Puppy Vaccination Schedule',
      description: 'New pet owner asks about vaccination timeline',
      userMessage: 'I just got a 8-week-old puppy. What vaccines does she need and when should I bring her in?',
      difficulty: 'Medium',
      expectedOutcomes: ['Explain vaccine schedule', 'Book first visit', 'New puppy guidance']
    },
    {
      id: 'routine_checkup',
      title: 'Annual Checkup',
      description: 'Pet owner scheduling yearly wellness exam',
      userMessage: 'My cat is due for her annual checkup. She\'s 5 years old and seems healthy. What does the exam include?',
      difficulty: 'Easy',
      expectedOutcomes: ['Explain exam process', 'Schedule appointment', 'Discuss preventive care']
    }
  ],
  salon: [
    {
      id: 'bridal_booking',
      title: 'Bridal Party Booking',
      description: 'Bride needs services for wedding day',
      userMessage: 'I\'m getting married in 3 months and need hair and makeup for myself and 4 bridesmaids. What packages do you offer?',
      difficulty: 'Hard',
      expectedOutcomes: ['Discuss bridal packages', 'Schedule trial', 'Group booking coordination']
    },
    {
      id: 'color_appointment',
      title: 'Hair Color Consultation',
      description: 'Client wants major color change',
      userMessage: 'I have dark brown hair and want to go blonde. How long would that take and what would it cost?',
      difficulty: 'Medium',
      expectedOutcomes: ['Assess hair condition', 'Schedule consultation', 'Set expectations']
    },
    {
      id: 'last_minute_cut',
      title: 'Last-Minute Haircut',
      description: 'Client needs same-day appointment',
      userMessage: 'I have a job interview tomorrow morning. Any chance I can get a haircut today? I just need a trim.',
      difficulty: 'Easy',
      expectedOutcomes: ['Check availability', 'Book same-day slot', 'Confirm service']
    }
  ]
};

export function IntelligentSimulation({ data, updateData, onNext, onPrev }: IntelligentSimulationProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [simulationState, setSimulationState] = useState<'setup' | 'running' | 'completed'>('setup');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [interactionMode, setInteractionMode] = useState<'voice' | 'text'>('voice');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    responseTime: 0,
    confidence: 0,
    knowledgeUsed: [] as string[],
    functionsTriggered: [] as string[]
  });
  const [simulationStartTime, setSimulationStartTime] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const businessType = data.businessProfile.industry;
  const scenarios = SIMULATION_SCENARIOS[businessType as keyof typeof SIMULATION_SCENARIOS] || [];
  const currentScenario = scenarios.find(s => s.id === selectedScenario);
  const transcript = data.simulation.transcript;

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        handleUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    initializeSpeechRecognition();
  }, [initializeSpeechRecognition]);

  const startSimulation = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setSimulationState('running');
    setSimulationStartTime(Date.now());
    
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    // Initialize conversation with scenario
    const initialTranscript = [
      {
        speaker: 'user' as const,
        message: scenario.userMessage,
        timestamp: Date.now(),
        confidence: 1.0
      }
    ];

    updateData('simulation', {
      scenario: scenarioId,
      transcript: initialTranscript
    });

    // Process initial message with AI
    await processAIResponse(scenario.userMessage, initialTranscript);
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;

    const newTranscript = [
      ...transcript,
      {
        speaker: 'user' as const,
        message: message.trim(),
        timestamp: Date.now(),
        confidence: 1.0
      }
    ];

    updateData('simulation', { transcript: newTranscript });
    setCurrentInput('');

    await processAIResponse(message, newTranscript);
  };

  const processAIResponse = async (userMessage: string, currentTranscript: any[]) => {
    const responseStartTime = Date.now();
    
    try {
      // Build context for AI
      const context = {
        businessProfile: data.businessProfile,
        knowledgeBase: data.knowledgeBase,
        agentConfig: data.agentConfig,
        conversationHistory: currentTranscript,
        scenario: currentScenario
      };

      const response = await fetch('/api/intelligent-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          context,
          mode: interactionMode
        })
      });

      if (!response.ok) throw new Error('Simulation API failed');

      const result = await response.json();
      const responseTime = Date.now() - responseStartTime;

      // Update real-time metrics
      setRealTimeMetrics({
        responseTime,
        confidence: result.confidence || 0.85,
        knowledgeUsed: result.knowledgeUsed || [],
        functionsTriggered: result.functionsTriggered || []
      });

      // Add AI response to transcript
      const aiTranscriptEntry = {
        speaker: 'agent' as const,
        message: result.response,
        timestamp: Date.now(),
        confidence: result.confidence,
        knowledgeUsed: result.knowledgeUsed,
        functionsTriggered: result.functionsTriggered
      };

      const updatedTranscript = [...currentTranscript, aiTranscriptEntry];
      updateData('simulation', { transcript: updatedTranscript });

      // Speak the response using ElevenLabs
      if (interactionMode === 'voice' && data.agentConfig.channels.includes('voice')) {
        await speakResponse(result.response);
      }

    } catch (error) {
      console.error('AI response error:', error);
      toast.error('Failed to get AI response. Please try again.');
    }
  };

  const speakResponse = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: data.agentConfig.voiceSettings.voiceId
        })
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      toast.error('Voice synthesis failed');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast.error('Speech recognition not supported in this browser');
      }
    }
  };

  const completeSimulation = () => {
    const totalTime = Date.now() - simulationStartTime;
    const avgResponseTime = transcript
      .filter(t => t.speaker === 'agent')
      .reduce((sum, t) => sum + (realTimeMetrics.responseTime || 2000), 0) / 
      Math.max(1, transcript.filter(t => t.speaker === 'agent').length);

    const metrics = {
      responseTime: avgResponseTime,
      intentAccuracy: Math.min(95, 75 + (realTimeMetrics.knowledgeUsed.length * 5)),
      bookingSuccess: realTimeMetrics.functionsTriggered.includes('booking') || 
                     transcript.some(t => t.message.toLowerCase().includes('appointment') || 
                                          t.message.toLowerCase().includes('schedule')),
      satisfactionScore: Math.min(95, 80 + (realTimeMetrics.confidence * 15)),
      knowledgeUtilization: Math.min(100, realTimeMetrics.knowledgeUsed.length * 12)
    };

    updateData('simulation', { metrics });
    setSimulationState('completed');
  };

  const resetSimulation = () => {
    setSimulationState('setup');
    setSelectedScenario('');
    updateData('simulation', {
      scenario: '',
      transcript: [],
      metrics: {
        responseTime: 0,
        intentAccuracy: 0,
        bookingSuccess: false,
        satisfactionScore: 0,
        knowledgeUtilization: 0
      }
    });
    setRealTimeMetrics({
      responseTime: 0,
      confidence: 0,
      knowledgeUsed: [],
      functionsTriggered: []
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Live AI Agent Simulation</h3>
        <p className="text-muted-foreground">
          Watch your AI agent handle real customer scenarios using your business knowledge
        </p>
      </div>

      {simulationState === 'setup' && (
        <div className="space-y-6">
          {/* Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Interaction Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setInteractionMode('voice')}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${interactionMode === 'voice' 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium">Voice Simulation</div>
                      <div className="text-sm text-muted-foreground">Full voice conversation with ElevenLabs</div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setInteractionMode('text')}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${interactionMode === 'text' 
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium">Text Simulation</div>
                      <div className="text-sm text-muted-foreground">Chat-based conversation</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose a Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all"
                    onClick={() => startSimulation(scenario.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{scenario.title}</h4>
                      <Badge 
                        variant={scenario.difficulty === 'Easy' ? 'secondary' : 
                               scenario.difficulty === 'Medium' ? 'default' : 'destructive'}
                      >
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                    <div className="text-sm font-medium mb-2">Customer will say:</div>
                    <div className="text-sm italic bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                      "{scenario.userMessage}"
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {scenario.expectedOutcomes.map((outcome) => (
                        <Badge key={outcome} variant="outline" className="text-xs">
                          {outcome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {simulationState === 'running' && currentScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {currentScenario.title} Simulation
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetSimulation}>
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={completeSimulation}>
                      Complete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Conversation Display */}
                <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto mb-4">
                  {transcript.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <Clock className="w-8 h-8 mx-auto mb-2" />
                      <p>Simulation starting...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transcript.map((entry, index) => (
                        <div
                          key={index}
                          className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`
                            max-w-[80%] p-3 rounded-lg
                            ${entry.speaker === 'user' 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'bg-white border shadow-sm'
                            }
                          `}>
                            <div className="text-sm">
                              <div className="font-medium mb-1">
                                {entry.speaker === 'user' ? 'Customer' : 'AI Agent'}
                                {entry.confidence && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {Math.round(entry.confidence * 100)}% confident
                                  </Badge>
                                )}
                              </div>
                              <p>{entry.message}</p>
                              {entry.knowledgeUsed && entry.knowledgeUsed.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-muted-foreground mb-1">Knowledge Used:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.knowledgeUsed.map((knowledge) => (
                                      <Badge key={knowledge} variant="secondary" className="text-xs">
                                        {knowledge}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={conversationEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="space-y-3">
                  {interactionMode === 'voice' ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={toggleListening}
                        disabled={isSpeaking}
                        variant={isListening ? 'destructive' : 'default'}
                        className="flex-1"
                      >
                        {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                        {isListening ? 'Stop Listening' : 'Start Speaking'}
                      </Button>
                      {isSpeaking && (
                        <Button
                          onClick={() => {
                            audioRef.current?.pause();
                            setIsSpeaking(false);
                          }}
                          variant="outline"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop AI
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your response as the customer..."
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleUserMessage(currentInput);
                          }
                        }}
                        rows={3}
                      />
                      <Button 
                        onClick={() => handleUserMessage(currentInput)}
                        disabled={!currentInput.trim()}
                      >
                        Send
                      </Button>
                    </div>
                  )}

                  {(isListening || isSpeaking) && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        {isListening && (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                            <span>Listening for your voice...</span>
                          </>
                        )}
                        {isSpeaking && (
                          <>
                            <Volume2 className="w-4 h-4 text-blue-500" />
                            <span>AI Agent is speaking...</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Metrics Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Live Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span className="font-medium">{realTimeMetrics.responseTime}ms</span>
                  </div>
                  <Progress value={Math.min(100, (3000 - realTimeMetrics.responseTime) / 30)} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI Confidence</span>
                    <span className="font-medium">{Math.round(realTimeMetrics.confidence * 100)}%</span>
                  </div>
                  <Progress value={realTimeMetrics.confidence * 100} />
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Knowledge Sources Used</div>
                  {realTimeMetrics.knowledgeUsed.length > 0 ? (
                    <div className="space-y-1">
                      {realTimeMetrics.knowledgeUsed.map((source) => (
                        <Badge key={source} variant="secondary" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No knowledge accessed yet</p>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Functions Triggered</div>
                  {realTimeMetrics.functionsTriggered.length > 0 ? (
                    <div className="space-y-1">
                      {realTimeMetrics.functionsTriggered.map((func) => (
                        <Badge key={func} variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {func}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No actions taken yet</p>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Expected Outcomes</div>
                  <div className="space-y-1">
                    {currentScenario.expectedOutcomes.map((outcome) => {
                      const achieved = realTimeMetrics.functionsTriggered.some(func => 
                        outcome.toLowerCase().includes(func.toLowerCase())
                      ) || transcript.some(t => 
                        t.message.toLowerCase().includes(outcome.toLowerCase().split(' ')[0])
                      );

                      return (
                        <div key={outcome} className="flex items-center gap-2">
                          {achieved ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${achieved ? 'text-green-700' : 'text-muted-foreground'}`}>
                            {outcome}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {simulationState === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              Simulation Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data.simulation.metrics.responseTime}ms
                </div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data.simulation.metrics.intentAccuracy}%
                </div>
                <div className="text-xs text-muted-foreground">Intent Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {data.simulation.metrics.bookingSuccess ? '✓' : '○'}
                </div>
                <div className="text-xs text-muted-foreground">Booking Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {data.simulation.metrics.satisfactionScore}%
                </div>
                <div className="text-xs text-muted-foreground">Satisfaction Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {data.simulation.metrics.knowledgeUtilization}%
                </div>
                <div className="text-xs text-muted-foreground">Knowledge Used</div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={resetSimulation}>
                Try Another Scenario
              </Button>
              <Button onClick={onNext} size="lg">
                View Results & Book Call →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation (only in setup) */}
      {simulationState === 'setup' && (
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={onPrev}>
            ← Back to Configuration
          </Button>
          <div className="text-sm text-muted-foreground">
            Select a scenario above to begin simulation
          </div>
        </div>
      )}
    </div>
  );
}