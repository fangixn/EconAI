import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function callDeepSeekAPI(messages: any[]) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error('DeepSeek API 请求失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callQwenAPI(messages: any[], model: string) {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ALIYUN_API_KEY}`,
    },
    body: JSON.stringify({
      model: model === 'qwen-turbo' ? 'qwen-turbo' : 'qwen-plus',
      input: {
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
      },
    }),
  });

  if (!response.ok) {
    throw new Error('通义千问 API 请求失败');
  }

  const data = await response.json();
  return data.output.text;
}

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    let response;
    switch (model) {
      case 'gpt-3.5-turbo':
      case 'gpt-4':
        const openaiResponse = await openai.chat.completions.create({
          model,
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        });
        response = openaiResponse.choices[0].message.content;
        break;

      case 'claude-2':
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-2',
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
        });
        response = claudeResponse.content[0].text;
        break;

      case 'deepseek-chat':
        response = await callDeepSeekAPI(messages);
        break;

      case 'qwen-turbo':
      case 'qwen-plus':
        response = await callQwenAPI(messages, model);
        break;

      default:
        throw new Error('不支持的模型类型');
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 