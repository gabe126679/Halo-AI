'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mic, MicOff, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function VoiceAgentPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState('');
  const [agentCharacteristics, setAgentCharacteristics] = useState(
    'You are a helpful and friendly AI assistant. Speak naturally and conversationally.'
  );
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInterimTranscript, setCurrentInterimTranscript] = useState('');
  const [microphoneStatus, setMicrophoneStatus] = useState<'checking' | 'available' | 'denied' | 'unsupported'>('checking');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('voiceAgentConversation');
    const savedCharacteristics = localStorage.getItem('voiceAgentCharacteristics');
    
    if (savedConversation) {
      setConversation(savedConversation);
    }
    if (savedCharacteristics) {
      setAgentCharacteristics(savedCharacteristics);
    }

    // Check for speech recognition support and microphone permissions
    checkMicrophoneAccess();
  }, []);

  const addDebugMessage = (message: string) => {
    console.log(`[Voice Debug] ${message}`);
  };

  const checkMicrophoneAccess = async () => {
    try {
      // Check if speech recognition is supported
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setMicrophoneStatus('unsupported');
        addDebugMessage('Speech recognition not supported in this browser');
        return;
      }

      // Check microphone permissions
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
          setMicrophoneStatus('available');
          addDebugMessage('Microphone access granted');
        } catch (err: any) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setMicrophoneStatus('denied');
            addDebugMessage('Microphone permission denied');
          } else {
            setMicrophoneStatus('denied');
            addDebugMessage(`Microphone error: ${err.message}`);
          }
        }
      } else {
        addDebugMessage('MediaDevices API not available');
        setMicrophoneStatus('unsupported');
      }
    } catch (error: any) {
      addDebugMessage(`Error checking microphone: ${error.message}`);
      setMicrophoneStatus('unsupported');
    }
  };

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (conversation) {
      localStorage.setItem('voiceAgentConversation', conversation);
    }
  }, [conversation]);

  // Save agent characteristics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voiceAgentCharacteristics', agentCharacteristics);
  }, [agentCharacteristics]);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        addDebugMessage('Speech recognition started');
      };

      recognitionRef.current.onaudiostart = () => {
        addDebugMessage('Audio capture started');
      };

      recognitionRef.current.onsoundstart = () => {
        addDebugMessage('Sound detected');
      };

      recognitionRef.current.onspeechstart = () => {
        addDebugMessage('Speech detected');
      };

      recognitionRef.current.onresult = (event: any) => {
        addDebugMessage(`Got result: ${event.results.length} results`);
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            addDebugMessage(`Final transcript (confidence: ${confidence}): ${transcript}`);
          } else {
            interimTranscript += transcript;
            addDebugMessage(`Interim transcript: ${transcript}`);
          }
        }
        
        // Update interim transcript for display
        if (interimTranscript) {
          setCurrentInterimTranscript(interimTranscript);
        }
        
        if (finalTranscript && finalTranscript.trim()) {
          const trimmedTranscript = finalTranscript.trim();
          setTranscript(prev => prev + trimmedTranscript);
          setCurrentInterimTranscript('');
          handleUserInput(trimmedTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        addDebugMessage(`Speech recognition error: ${event.error}`);
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          addDebugMessage('No speech detected. Check microphone is working and try speaking louder.');
        } else if (event.error === 'audio-capture') {
          addDebugMessage('No microphone found or microphone is not working.');
          setMicrophoneStatus('denied');
        } else if (event.error === 'not-allowed') {
          addDebugMessage('Microphone permission denied.');
          setMicrophoneStatus('denied');
        }
        
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        addDebugMessage('Speech recognition ended');
        if (isListening) {
          addDebugMessage('Restarting speech recognition...');
          recognitionRef.current.start();
        }
      };

      recognitionRef.current.onnomatch = () => {
        addDebugMessage('No speech match found');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const handleUserInput = async (userText: string) => {
    // Don't process empty messages
    if (!userText || userText.trim() === '') {
      addDebugMessage('Ignoring empty message');
      return;
    }
    
    setConversation(prev => prev + `\nUser: ${userText}`);
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/voice-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          systemPrompt: agentCharacteristics,
          conversationHistory: conversation,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const aiResponse = data.response;
      
      setConversation(prev => prev + `\nAI: ${aiResponse}`);
      
      // Speak the response
      speakText(aiResponse);
    } catch (error: any) {
      console.error('Error processing voice input:', error);
      const errorMessage = error.message || 'Sorry, I encountered an error processing your request.';
      setConversation(prev => prev + `\nAI: Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      addDebugMessage('Stopping speech recognition...');
      recognitionRef.current?.stop();
      setIsListening(false);
      setCurrentInterimTranscript('');
    } else {
      // Re-check microphone permission before starting
      if (microphoneStatus === 'denied' || microphoneStatus === 'unsupported') {
        await checkMicrophoneAccess();
        if (microphoneStatus === 'denied') {
          alert('Microphone permission is denied. Please enable it in your browser settings.');
          return;
        }
        if (microphoneStatus === 'unsupported') {
          alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
          return;
        }
      }
      
      addDebugMessage('Starting speech recognition...');
      setTranscript('');
      setCurrentInterimTranscript('');
      
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error: any) {
        addDebugMessage(`Failed to start: ${error.message}`);
        setIsListening(false);
      }
    }
  };

  const clearConversation = () => {
    setConversation('');
    localStorage.removeItem('voiceAgentConversation');
    setTranscript('');
    setCurrentInterimTranscript('');
  };

  const handleManualInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const input = e.currentTarget.value.trim();
      if (input) {
        handleUserInput(input);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold">Voice Agent Tester</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Side - Text Boxes */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Agent Characteristics</h2>
              <Textarea
                value={agentCharacteristics}
                onChange={(e) => setAgentCharacteristics(e.target.value)}
                placeholder="Define the personality and characteristics of your voice agent..."
                className="min-h-[150px] resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Customize how your AI agent behaves and responds
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Conversation</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearConversation}
                  disabled={!conversation}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto mb-4">
                {conversation ? (
                  <div className="space-y-2">
                    {conversation.split('\n').filter(line => line.trim()).map((line, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg ${
                          line.startsWith('User:')
                            ? 'bg-primary/10 ml-8'
                            : line.startsWith('AI:')
                            ? 'bg-secondary/10 mr-8'
                            : ''
                        }`}
                      >
                        <span className="font-semibold">
                          {line.startsWith('User:') ? 'You: ' : line.startsWith('AI:') ? 'AI: ' : ''}
                        </span>
                        <span className="text-sm">
                          {line.replace(/^(User:|AI:)/, '').trim()}
                        </span>
                      </div>
                    ))}
                    {currentInterimTranscript && isListening && (
                      <div className="p-2 rounded-lg bg-primary/5 ml-8 opacity-60">
                        <span className="font-semibold">You: </span>
                        <span className="text-sm italic">{currentInterimTranscript}...</span>
                      </div>
                    )}
                    <div ref={conversationEndRef} />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Conversation will appear here...</p>
                )}
              </div>
              <Textarea
                placeholder="Type a message and press Enter to send (or use voice)"
                className="min-h-[80px] resize-none"
                onKeyDown={handleManualInput}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </Card>
          </div>

          {/* Right Side - Voice Indicator */}
          <div className="flex items-center justify-center">
            <Card className="p-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div 
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSpeaking 
                      ? 'bg-primary/20 animate-pulse' 
                      : isListening 
                      ? 'bg-destructive/20' 
                      : 'bg-muted'
                  }`}
                >
                  <div 
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSpeaking 
                        ? 'bg-primary/40 animate-pulse' 
                        : isListening 
                        ? 'bg-destructive/40' 
                        : 'bg-muted-foreground/20'
                    }`}
                  >
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSpeaking 
                          ? 'bg-primary animate-pulse' 
                          : isListening 
                          ? 'bg-destructive' 
                          : 'bg-muted-foreground/40'
                      }`}
                    >
                      {isListening ? (
                        <Mic className="h-8 w-8 text-white" />
                      ) : (
                        <MicOff className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                )}
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  {isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
                </p>
                {currentInterimTranscript && isListening && (
                  <p className="text-xs text-muted-foreground max-w-xs italic">
                    "{currentInterimTranscript}..."
                  </p>
                )}
              </div>

              <Button
                onClick={toggleListening}
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className="w-full"
                disabled={isProcessing || microphoneStatus === 'checking'}
              >
                {isListening ? 'Stop Listening' : 'Start Voice Chat'}
              </Button>

              {/* Microphone Status Indicator */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Microphone Status: {' '}
                  <span className={`font-semibold ${
                    microphoneStatus === 'available' ? 'text-green-600' : 
                    microphoneStatus === 'denied' ? 'text-red-600' : 
                    microphoneStatus === 'unsupported' ? 'text-orange-600' : 
                    'text-gray-600'
                  }`}>
                    {microphoneStatus === 'checking' ? 'Checking...' :
                     microphoneStatus === 'available' ? 'Ready' :
                     microphoneStatus === 'denied' ? 'Permission Denied' :
                     'Not Supported'}
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}