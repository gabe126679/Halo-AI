import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SimulationContext {
  businessProfile: {
    name: string;
    industry: string;
    phone: string;
    locations: string[];
    operatingHours: any;
    primaryGoals: string[];
  };
  knowledgeBase: {
    uploadedFiles: any[];
    manualInput: {
      faqs: Array<{ question: string; answer: string }>;
      services: string[];
      policies: string[];
    };
    processingResults: {
      totalFaqs: number;
      detectedIntents: string[];
    };
  };
  agentConfig: {
    channels: string[];
    voiceSettings: {
      personality: string;
      responseStyle: string;
    };
    bookingRules: {
      allowAfterHours: boolean;
      requireDeposit: boolean;
      autoConfirm: boolean;
    };
  };
  conversationHistory: any[];
  scenario: any;
}

function buildSystemPrompt(context: SimulationContext): string {
  const { businessProfile, knowledgeBase, agentConfig } = context;
  
  const personalityTraits = {
    professional: "formal, knowledgeable, and trustworthy. Use business-appropriate language and maintain a respectful tone.",
    friendly: "warm, approachable, and conversational. Use a welcoming tone and show genuine interest in helping.",
    energetic: "upbeat, enthusiastic, and engaging. Show excitement about helping and use positive language.",
    calm: "gentle, patient, and soothing. Take time to address concerns and provide reassurance."
  };

  const responseStyles = {
    concise: "Keep responses brief and direct. Get straight to the point without unnecessary details.",
    detailed: "Provide comprehensive responses with helpful context and additional information.",
    consultative: "Ask thoughtful follow-up questions to better understand customer needs before providing solutions."
  };

  // Build knowledge context
  let knowledgeContext = "";
  if (knowledgeBase.manualInput.faqs.length > 0) {
    knowledgeContext += "\n\nFREQUENTLY ASKED QUESTIONS:\n";
    knowledgeBase.manualInput.faqs.forEach(faq => {
      knowledgeContext += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
    });
  }

  if (knowledgeBase.manualInput.services.length > 0) {
    knowledgeContext += "\nSERVICES OFFERED:\n";
    knowledgeBase.manualInput.services.forEach(service => {
      knowledgeContext += `- ${service}\n`;
    });
  }

  // Build booking rules
  const bookingRules = [];
  if (agentConfig.bookingRules.allowAfterHours) {
    bookingRules.push("Accept appointments outside regular business hours");
  }
  if (agentConfig.bookingRules.requireDeposit) {
    bookingRules.push("Request deposit or payment information to secure appointments");
  }
  if (agentConfig.bookingRules.autoConfirm) {
    bookingRules.push("Automatically confirm appointments if calendar availability allows");
  }

  return `You are an AI assistant representing ${businessProfile.name}, a ${businessProfile.industry.replace('_', ' ')} business. 

BUSINESS INFORMATION:
- Business Name: ${businessProfile.name}
- Industry: ${businessProfile.industry.replace('_', ' ')}
- Phone: ${businessProfile.phone}
- Locations: ${businessProfile.locations.join(', ')}
- Operating Hours: ${JSON.stringify(businessProfile.operatingHours)}
- Primary Goals: ${businessProfile.primaryGoals.join(', ')}

PERSONALITY & COMMUNICATION STYLE:
You should be ${personalityTraits[agentConfig.voiceSettings.personality as keyof typeof personalityTraits]}

RESPONSE APPROACH:
${responseStyles[agentConfig.voiceSettings.responseStyle as keyof typeof responseStyles]}

BOOKING GUIDELINES:
${bookingRules.length > 0 ? bookingRules.map(rule => `- ${rule}`).join('\n') : '- Follow standard business booking practices'}

${knowledgeContext}

IMPORTANT INSTRUCTIONS:
1. You are NOT a script reader. Use the knowledge provided as context, but respond naturally and conversationally.
2. If you don't know something specific to the business, politely say so and offer to have a team member follow up.
3. Always try to move conversations toward booking appointments or capturing contact information.
4. Be helpful and solution-oriented, but stay within your knowledge boundaries.
5. Use the business name naturally in conversation.
6. If asked about prices not in your knowledge base, give general ranges and suggest scheduling a consultation.
7. For scheduling requests, be enthusiastic and accommodating while following the booking rules.

Remember: You represent a real business. Be professional, helpful, and focused on providing excellent customer service that reflects well on ${businessProfile.name}.`;
}

function detectTriggeredFunctions(response: string, context: SimulationContext): string[] {
  const functions = [];
  const lowerResponse = response.toLowerCase();

  if (lowerResponse.includes('schedule') || lowerResponse.includes('appointment') || lowerResponse.includes('book')) {
    functions.push('booking');
  }
  if (lowerResponse.includes('price') || lowerResponse.includes('cost') || lowerResponse.includes('payment')) {
    functions.push('pricing');
  }
  if (lowerResponse.includes('call') || lowerResponse.includes('contact') || lowerResponse.includes('reach')) {
    functions.push('contact');
  }
  if (lowerResponse.includes('email') || lowerResponse.includes('send')) {
    functions.push('email');
  }

  return functions;
}

function detectKnowledgeUsed(response: string, context: SimulationContext): string[] {
  const knowledgeUsed = [];
  const lowerResponse = response.toLowerCase();

  // Check if FAQs were referenced
  context.knowledgeBase.manualInput.faqs.forEach(faq => {
    const faqWords = faq.answer.toLowerCase().split(' ').filter(word => word.length > 4);
    if (faqWords.some(word => lowerResponse.includes(word))) {
      knowledgeUsed.push(`FAQ: ${faq.question.substring(0, 30)}...`);
    }
  });

  // Check if services were mentioned
  context.knowledgeBase.manualInput.services.forEach(service => {
    if (lowerResponse.includes(service.toLowerCase())) {
      knowledgeUsed.push(`Service: ${service}`);
    }
  });

  // Check if business hours were mentioned
  if (lowerResponse.includes('hour') || lowerResponse.includes('open') || lowerResponse.includes('close')) {
    knowledgeUsed.push('Business Hours');
  }

  // Check if contact info was used
  if (lowerResponse.includes(context.businessProfile.phone) || 
      context.businessProfile.locations.some(loc => lowerResponse.includes(loc.toLowerCase()))) {
    knowledgeUsed.push('Contact Information');
  }

  return [...new Set(knowledgeUsed)];
}

export async function POST(request: NextRequest) {
  try {
    const { userMessage, context, mode = 'voice' }: {
      userMessage: string;
      context: SimulationContext;
      mode: 'voice' | 'text';
    } = await request.json();

    console.log('🤖 Intelligent simulation request:', { 
      userMessage: userMessage.substring(0, 50),
      businessName: context.businessProfile.name,
      mode 
    });

    if (!userMessage || !context) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build system prompt with business context
    const systemPrompt = buildSystemPrompt(context);

    // Build conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history (last 6 messages to keep context manageable)
    const recentHistory = context.conversationHistory.slice(-6);
    recentHistory.forEach(entry => {
      if (entry.speaker === 'user') {
        messages.push({
          role: 'user',
          content: entry.message
        });
      } else if (entry.speaker === 'agent') {
        messages.push({
          role: 'assistant',
          content: entry.message
        });
      }
    });

    // Add current user message if not already included
    if (!recentHistory.some(entry => entry.message === userMessage && entry.speaker === 'user')) {
      messages.push({
        role: 'user',
        content: userMessage
      });
    }

    console.log('📤 Sending to OpenAI:', { 
      messageCount: messages.length,
      systemPromptLength: systemPrompt.length 
    });

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Use GPT-4 for better reasoning
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 300, // Keep responses concise for voice
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content || 
      'I apologize, but I\'m having trouble processing your request. Could you please try again?';

    // Analyze the response for metrics
    const knowledgeUsed = detectKnowledgeUsed(response, context);
    const functionsTriggered = detectTriggeredFunctions(response, context);

    // Calculate confidence based on response quality and knowledge usage
    let confidence = 0.75; // Base confidence
    
    // Boost confidence if knowledge was used
    if (knowledgeUsed.length > 0) {
      confidence += 0.15;
    }
    
    // Boost confidence if functions were triggered (indicates actionable response)
    if (functionsTriggered.length > 0) {
      confidence += 0.1;
    }
    
    // Ensure confidence doesn't exceed 1.0
    confidence = Math.min(1.0, confidence);

    console.log('✅ Simulation response generated:', {
      responseLength: response.length,
      confidence,
      knowledgeUsed: knowledgeUsed.length,
      functionsTriggered: functionsTriggered.length
    });

    return NextResponse.json({
      response,
      confidence,
      knowledgeUsed,
      functionsTriggered,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error('❌ Intelligent simulation error:', {
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: `Simulation failed: ${error.message}`,
        response: "I'm experiencing technical difficulties. Let me connect you with a team member who can help you right away.",
        confidence: 0.5,
        knowledgeUsed: [],
        functionsTriggered: ['escalation']
      },
      { status: 500 }
    );
  }
}