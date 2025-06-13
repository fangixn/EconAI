'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send,
  Upload,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Plus,
  Trash2,
  X
} from 'lucide-react';

type AIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'claude-2' | 'deepseek-chat' | 'qwen-turbo' | 'qwen-plus';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: string[];
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt-3.5-turbo');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aiModels = [
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5',
      description: 'OpenAI 的快速模型，适合一般对话',
      color: 'bg-green-600'
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'OpenAI 的最强模型，适合复杂分析',
      color: 'bg-purple-600'
    },
    {
      id: 'claude-2',
      name: 'Claude 2',
      description: 'Anthropic 的模型，擅长长文本分析',
      color: 'bg-blue-600'
    },
    {
      id: 'deepseek-chat',
      name: 'DeepSeek',
      description: '深度求索的对话模型，擅长中文',
      color: 'bg-orange-600'
    },
    {
      id: 'qwen-turbo',
      name: '通义千问 Turbo',
      description: '阿里云的基础模型，速度快',
      color: 'bg-red-600'
    },
    {
      id: 'qwen-plus',
      name: '通义千问 Plus',
      description: '阿里云的高级模型，能力更强',
      color: 'bg-indigo-600'
    }
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    // 添加用户消息
    const newMessages: Message[] = [...messages, { 
      role: 'user' as const, 
      content: message,
      files: uploadedFiles
    }];
    setMessages(newMessages);
    setMessage('');
    setUploadedFiles([]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: newMessages,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，发生了错误。请稍后重试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage('');
    setUploadedFiles([]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedFiles(prev => [...prev, data.fileName]);
    } catch (error) {
      console.error('Upload Error:', error);
      alert('文件上传失败，请重试');
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileName));
  };

  return (
    <div className="flex flex-col h-full">
      {/* 模型选择 */}
      <div className="border-b p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {aiModels.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel === model.id ? 'default' : 'outline'}
                onClick={() => setSelectedModel(model.id as AIModel)}
                className={selectedModel === model.id ? `${model.color} text-white hover:opacity-90` : ''}
              >
                {model.name}
              </Button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {aiModels.find(m => m.id === selectedModel)?.description}
          </div>
        </div>
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">欢迎使用 EconAI</h2>
              <p className="text-gray-600">开始一个新的对话，或上传文档来获取更专业的回答</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.files.map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="bg-white/10 rounded px-2 py-1 text-sm flex items-center"
                      >
                        <Paperclip className="h-3 w-3 mr-1" />
                        {file}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 输入区域 */}
      <div className="border-t p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {uploadedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded px-2 py-1 text-sm flex items-center"
                >
                  <Paperclip className="h-3 w-3 mr-1" />
                  {file}
                  <button
                    onClick={() => removeFile(file)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入您的问题..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isLoading}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                disabled={isLoading}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            按 Enter 发送消息，Shift + Enter 换行
          </div>
        </div>
      </div>
    </div>
  );
} 