'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Upload, 
  MessageSquare, 
  BookOpen, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  FileText,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Building2,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import ResourceRecommendations from '@/components/ResourceRecommendations';
import UsageTips from '@/components/UsageTips';
import HelpCenter from '@/components/HelpCenter';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('resources');
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  const aiModels = [
    { id: 'chatgpt', name: 'ChatGPT', color: 'bg-green-500' },
    { id: 'deepseek', name: 'DeepSeek', color: 'bg-blue-500' },
    { id: 'gemini', name: 'Gemini', color: 'bg-purple-500' }
  ];

  const features = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: "Document Upload",
      description: "Upload your economics papers, textbooks, and research materials to build your personalized knowledge base."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-green-600" />,
      title: "AI Conversations",
      description: "Engage in deep discussions about economic theories, concepts, and applications with advanced AI models."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Multiple AI Models",
      description: "Compare insights from ChatGPT, DeepSeek, and Gemini to get comprehensive perspectives on economic topics."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Documents",
      description: "Add your economics materials to create a comprehensive knowledge base tailored to your needs."
    },
    {
      number: "02",
      title: "Ask Questions",
      description: "Type your economics questions or topics you want to explore in the chat interface."
    },
    {
      number: "03",
      title: "Get Expert Insights",
      description: "Receive professional-grade responses from multiple AI models specialized in economic analysis."
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage('');
    
    // 模拟AI响应
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '这是一个模拟的AI响应。在实际应用中，这里会连接到真实的AI服务。' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* 输入区域 */}
      <div className="border-t p-4 bg-white">
        <div className="max-w-4xl mx-auto">
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
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Button onClick={handleSendMessage}>
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