import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, systemPrompt, conversationHistory } = body;

    console.log('Received request:', { message, systemPrompt: systemPrompt?.substring(0, 50) });

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt || 'You are a helpful AI assistant.',
      },
    ];

    // Add conversation history if available
    if (conversationHistory) {
      const lines = conversationHistory.split('\n').filter((line: string) => line.trim());
      lines.forEach((line: string) => {
        if (line.startsWith('User:')) {
          messages.push({
            role: 'user',
            content: line.replace('User:', '').trim(),
          });
        } else if (line.startsWith('AI:')) {
          messages.push({
            role: 'assistant',
            content: line.replace('AI:', '').trim(),
          });
        }
      });
    }

    // Add the current message
    messages.push({
      role: 'user',
      content: message,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('Generated response:', response.substring(0, 100));
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('OpenAI API error details:', {
      error: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Check if it's an OpenAI API key error
    if (error.message?.includes('API key') || error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your API key configuration.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to process request: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}