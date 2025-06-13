import { NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/openai';

type AIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'claude-2';

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-3.5-turbo' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    const response = await getAIResponse(messages, model as AIModel);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 