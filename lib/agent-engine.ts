interface AgentResponse {
  message: string;
  intent: string;
  confidence: number;
}

interface KnowledgeBase {
  question: string;
  answer: string;
}

interface AgentConfig {
  agentName: string;
  tone: {
    friendly: number;
    concise: number;
    professional: number;
  };
  greeting: string;
  closing: string;
}

class AgentEngine {
  async processInput(
    input: string, 
    knowledgeBase: KnowledgeBase[], 
    config: AgentConfig
  ): Promise<AgentResponse> {
    const normalizedInput = input.toLowerCase().trim();
    
    // Simple intent detection
    const intent = this.detectIntent(normalizedInput);
    
    // Find relevant knowledge
    const relevantKnowledge = this.findRelevantKnowledge(normalizedInput, knowledgeBase);
    
    // Generate response
    const message = this.generateResponse(normalizedInput, intent, relevantKnowledge, config);
    
    return {
      message,
      intent,
      confidence: relevantKnowledge ? 0.8 : 0.4,
    };
  }

  private detectIntent(input: string): string {
    // Simple keyword-based intent detection
    if (input.includes('schedule') || input.includes('appointment') || input.includes('showing') || input.includes('meeting')) {
      return 'appointment_request';
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('rate') || input.includes('fee')) {
      return 'pricing_inquiry';
    }
    
    if (input.includes('hour') || input.includes('time') || input.includes('open') || input.includes('available')) {
      return 'hours_inquiry';
    }
    
    if (input.includes('location') || input.includes('address') || input.includes('where')) {
      return 'location_inquiry';
    }
    
    if (input.includes('contact') || input.includes('phone') || input.includes('email')) {
      return 'contact_inquiry';
    }
    
    return 'general_inquiry';
  }

  private findRelevantKnowledge(input: string, knowledgeBase: KnowledgeBase[]): KnowledgeBase | null {
    // Simple text matching for demo purposes
    for (const knowledge of knowledgeBase) {
      const questionWords = knowledge.question.toLowerCase().split(' ');
      const inputWords = input.toLowerCase().split(' ');
      
      const commonWords = questionWords.filter(word => 
        inputWords.some(inputWord => 
          inputWord.includes(word) || word.includes(inputWord)
        )
      );
      
      if (commonWords.length >= 2) {
        return knowledge;
      }
    }
    
    return null;
  }

  private generateResponse(
    input: string, 
    intent: string, 
    knowledge: KnowledgeBase | null, 
    config: AgentConfig
  ): string {
    // If we have specific knowledge, use it
    if (knowledge) {
      return this.styleResponse(knowledge.answer, config);
    }
    
    // Generate response based on intent
    switch (intent) {
      case 'appointment_request':
        return this.styleResponse(
          "I'd be happy to help you schedule an appointment. Let me connect you with someone who can check availability and set that up for you.",
          config
        );
      
      case 'pricing_inquiry':
        return this.styleResponse(
          "I understand you're interested in our pricing. Let me get you connected with someone who can provide detailed information about our rates and services.",
          config
        );
      
      case 'hours_inquiry':
        return this.styleResponse(
          "We're typically available Monday through Friday, 9 AM to 6 PM, and Saturday 10 AM to 4 PM. For specific scheduling, I can connect you with our team.",
          config
        );
      
      case 'contact_inquiry':
        return this.styleResponse(
          "I can help you get in touch with the right person. Would you prefer a call back, or would you like me to schedule a meeting?",
          config
        );
      
      default:
        return this.styleResponse(
          "Thank you for your question. Let me connect you with someone who can provide you with the detailed information you need.",
          config
        );
    }
  }

  private styleResponse(baseResponse: string, config: AgentConfig): string {
    let styled = baseResponse;
    
    // Apply personality adjustments based on tone settings
    const { friendly, concise, professional } = config.tone;
    
    // Add friendly touches
    if (friendly > 70) {
      styled = styled.replace(/^/, "Absolutely! ");
      styled = styled.replace(/\.$/, " 😊");
    }
    
    // Make more concise
    if (concise > 70) {
      styled = styled.replace(/I'd be happy to help you /g, "I'll ");
      styled = styled.replace(/I understand you're interested in /g, "For ");
      styled = styled.replace(/Let me get you connected with someone who can /g, "I'll connect you to ");
    }
    
    // Make more professional
    if (professional > 70) {
      styled = styled.replace(/😊/g, "");
      styled = styled.replace(/Absolutely! /g, "Certainly. ");
    }
    
    return styled;
  }
}

// TODO: Replace with OpenAI Realtime API integration
// This mock implementation provides the interface for easy swapping later
export const agentEngine = new AgentEngine();