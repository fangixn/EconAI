export interface ApiConfig {
  name: string;
  apiUrl: string;
  timeout?: number;
  buildHeaders: (apiKey: string) => Record<string, string>;
  buildBody: (prompt: string) => any;
  parseResponse: (data: any) => string;
  getApiUrl?: (apiKey: string) => string;
}

export const API_CONFIGS: Record<string, ApiConfig> = {
  openai: {
    name: 'ChatGPT',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional economics expert with deep knowledge in macroeconomics, microeconomics, monetary economics, international economics, and econometrics. Provide detailed, accurate, and insightful analysis of economic theories, concepts, and current economic phenomena. Use your extensive knowledge to explain complex economic relationships and provide evidence-based insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  },

  deepseek: {
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/chat/completions',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a senior economics professor and researcher with expertise in economic theory, policy analysis, and quantitative methods. Provide comprehensive analysis of economic questions with theoretical foundations, empirical evidence, and practical implications. Draw from classical and modern economic schools of thought.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
    parseResponse: (data: any) => {
      return data.choices?.[0]?.message?.content || 'No response received';
    }
  },

  gemini: {
    name: 'Gemini',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    timeout: 30000,
    getApiUrl: (apiKey: string) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    buildHeaders: (apiKey: string) => ({
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      contents: [{
        parts: [{
          text: `As a distinguished economics expert specializing in economic modeling, financial markets, and policy analysis, please provide a thorough analysis of the following economic question. Use your knowledge of economic principles, current market dynamics, and historical precedents to offer insights:\n\n${prompt}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
      }
    }),
    parseResponse: (data: any) => {
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
    }
  },

  claude: {
    name: 'Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    }),
    buildBody: (prompt: string) => ({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert economist with deep knowledge across all areas of economic science including macroeconomics, microeconomics, international economics, development economics, and econometrics. Please provide a comprehensive and analytical response to this economic question, drawing from established economic theory and current research:\n\n${prompt}`
        }
      ]
    }),
    parseResponse: (data: any) => {
      return data.content?.[0]?.text || 'No response received';
    }
  },

  qwen: {
    name: 'Qwen',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    timeout: 30000,
    buildHeaders: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
    buildBody: (prompt: string) => ({
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'system',
            content: 'You are a leading economics researcher and analyst with expertise in both theoretical and applied economics. Your knowledge spans macroeconomic policy, microeconomic theory, financial economics, and quantitative analysis. Provide detailed, evidence-based responses to economic questions with clear explanations and practical insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      parameters: {
        max_tokens: 2000,
        temperature: 0.7,
      }
    }),
    parseResponse: (data: any) => {
      return data.output?.text || data.output?.choices?.[0]?.message?.content || 'No response received';
    }
  }
};

export const AVAILABLE_MODELS = [
  { id: 'openai', name: 'ChatGPT', description: 'OpenAI GPT-3.5', color: 'bg-green-500' },
  { id: 'deepseek', name: 'DeepSeek', description: 'DeepSeek AI Model', color: 'bg-blue-500' },
  { id: 'gemini', name: 'Gemini', description: 'Google Gemini', color: 'bg-purple-500' },
  { id: 'claude', name: 'Claude', description: 'Anthropic Claude', color: 'bg-orange-500' },
  { id: 'qwen', name: 'Qwen', description: 'Alibaba Cloud Qwen', color: 'bg-red-500' }
];

// API priority configuration (for intelligent analysis functionality)
export const ANALYSIS_API_PRIORITY = ['openai', 'claude', 'gemini', 'deepseek', 'qwen'];

// Performance settings
export const PERFORMANCE_SETTINGS = {
  DEFAULT_TIMEOUT: 30000,
  ANALYSIS_TIMEOUT: 45000,
  MAX_PARALLEL_REQUESTS: 3,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
}; 