'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Send, 
  Brain, 
  ArrowLeft, 
  History, 
  Trash2, 
  User, 
  Bot,
  Loader2,
  TrendingUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  Shield
} from 'lucide-react';
import { API_CONFIGS } from '@/lib/apiConfig';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiSettings {
  [key: string]: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({});
  const [tempApiSettings, setTempApiSettings] = useState<ApiSettings>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize
  useEffect(() => {
    // Get model selection from URL params
    const modelParam = searchParams.get('model');
    if (modelParam && API_CONFIGS[modelParam]) {
      setSelectedModel(modelParam);
    }

    // Load API settings from localStorage
    const savedSettings = localStorage.getItem('apiSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setApiSettings(settings);
      setTempApiSettings(settings);
    }

    // Load chat history from localStorage
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions));
    }

    // Check if there's an initial question
    const initialQuestion = searchParams.get('initialQuestion');
    if (initialQuestion) {
      setCurrentMessage(initialQuestion);
      // Create new session
      createNewSession();
    } else {
      // Create new session or load recent session
      createNewSession();
    }
  }, []);

  // Create new session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  // Save sessions to localStorage
  const saveSessions = (sessions: ChatSession[]) => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  };

  // Send message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const apiKey = apiSettings[selectedModel];
    if (!apiKey) {
      alert('Please configure API key first');
      handleOpenSettings();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const config = API_CONFIGS[selectedModel];
      const headers = config.buildHeaders(apiKey);
      const body = config.buildBody(currentMessage);
      const url = config.getApiUrl ? config.getApiUrl(apiKey) : config.apiUrl;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.timeout || 30000),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const parsedResponse = config.parseResponse(data);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: parsedResponse,
        timestamp: new Date(),
        model: selectedModel
      };

      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        
        // Update current session
        setChatSessions(prevSessions => {
          const updatedSessions = prevSessions.map(session => {
            if (session.id === currentSessionId) {
              const updatedSession = {
                ...session,
                messages: newMessages,
                title: newMessages.length === 2 ? userMessage.content.slice(0, 30) + '...' : session.title,
                updatedAt: new Date()
              };
              return updatedSession;
            }
            return session;
          });
          saveSessions(updatedSessions);
          return updatedSessions;
        });
        
        return newMessages;
      });
    } catch (error) {
      console.error('API call error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        model: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Switch session
  const switchSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  // Delete session
  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    saveSessions(updatedSessions);
    
    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        switchSession(updatedSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleApiSettingChange = (modelKey: string, value: string) => {
    // 只更新临时设置，不立即保存
    setTempApiSettings(prev => ({
      ...prev,
      [modelKey]: value
    }));
  };

  const handleSaveSettings = () => {
    // 保存设置并关闭对话框
    setApiSettings(tempApiSettings);
    localStorage.setItem('apiSettings', JSON.stringify(tempApiSettings));
    setSettingsOpen(false);
  };

  const handleCancelSettings = () => {
    // 恢复到原始设置，撤销未保存的更改
    setTempApiSettings(apiSettings);
    setSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    // 打开设置时，将当前设置复制到临时设置
    setTempApiSettings(apiSettings);
    setSettingsOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - 增加宽度以确保完整显示，并添加响应式设计 */}
      <div className="w-96 lg:w-96 md:w-80 sm:w-72 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleOpenSettings}>
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="econai-dialog econai-api-dialog max-w-2xl overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle>API Key Configuration</DialogTitle>
                  <DialogDescription>
                    Configure API keys for each AI model. Click the links below to get API keys.
                  </DialogDescription>
                </DialogHeader>
                
                {/* 滚动区域 */}
                <div className="flex-1 api-scroll-area space-y-6 mt-6 pr-2">
                  {Object.entries(API_CONFIGS).map(([key, config]) => {
                    // 为每个模型定义API申请链接
                    const getApiLink = (modelKey: string) => {
                      switch (modelKey) {
                        case 'openai':
                          return 'https://platform.openai.com/api-keys';
                        case 'deepseek':
                          return 'https://platform.deepseek.com/api_keys';
                        case 'gemini':
                          return 'https://aistudio.google.com/app/apikey';
                        case 'claude':
                          return 'https://console.anthropic.com/settings/keys';
                        case 'qwen':
                          return 'https://dashscope.console.aliyun.com/api-key';
                        default:
                          return '#';
                      }
                    };

                    return (
                      <div key={key} className="econai-api-model-card space-y-3 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label htmlFor={`chat-api-key-${key}`} className="font-medium text-slate-800">
                            {config.name}
                          </label>
                          <a
                            href={getApiLink(key)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="econai-api-link text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            获取API密钥 →
                          </a>
                        </div>
                        <Input
                          id={`chat-api-key-${key}`}
                          type="password"
                          placeholder={`Enter ${config.name} API key`}
                          value={tempApiSettings[key] || ''}
                          onChange={(e) => handleApiSettingChange(key, e.target.value)}
                          className="bg-white"
                        />
                        {tempApiSettings[key] && (
                          <div className="flex items-center text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            API密钥已配置
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 固定在底部的按钮区域 */}
                <div className="flex-shrink-0 flex justify-end space-x-3 mt-6 pt-6 border-t econai-dialog-footer">
                  <Button variant="outline" onClick={handleCancelSettings}>
                    取消
                  </Button>
                  <Button onClick={handleSaveSettings} className="econai-button-primary">
                    保存设置
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Model Selection - 改为单列布局以确保完整显示 */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">EconAI</h3>
            <div className="space-y-2">
              {Object.entries(API_CONFIGS).map(([key, config]) => (
                <Button
                  key={key}
                  variant={selectedModel === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModel(key)}
                  className={`w-full justify-between text-sm h-auto py-3 min-h-[44px] econai-ai-expert-button ${
                    selectedModel === key ? 'selected' : ''
                  }`}
                >
                  <span className="font-medium text-left truncate pr-2 flex-1">{config.name}</span>
                  {apiSettings[key] && (
                    <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700 flex-shrink-0">
                      ✓
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 flex items-center">
                <History className="h-4 w-4 mr-2" />
                History Chat
              </h3>
              <Button variant="ghost" size="sm" onClick={createNewSession}>
                <Brain className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 econai-sidebar-scroll">
            <div className="p-2 space-y-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer group transition-colors ${
                    session.id === currentSessionId 
                      ? 'bg-blue-50 border-blue-200 border' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => switchSession(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.messages.length} messages • {new Date(session.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                EconAI
              </h1>
              <p className="text-sm text-gray-600">Professional Economics Research Platform</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-gray-50">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="max-w-4xl mx-auto">
                {/* Welcome Header */}
                <div className="text-center py-6">
                  <Brain className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">EconAI Research Chat</h3>
                  <p className="text-slate-600">Start your economics analysis journey</p>
                </div>

                {/* Best Practices Section */}
                <div className="econai-compact-card econai-chat-welcome rounded-xl p-6 shadow-sm border border-slate-100 mb-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800">Research Guidelines</h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Effective Questions */}
                    <div>
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <h3 className="text-sm font-semibold text-slate-800">Good Questions</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="border-l-3 border-green-500 bg-green-50 p-2 rounded-r-lg">
                          <p className="text-slate-700 text-xs italic">
                            "Latest Fed monetary policy insights?"
                          </p>
                        </div>
                        <div className="border-l-3 border-green-500 bg-green-50 p-2 rounded-r-lg">
                          <p className="text-slate-700 text-xs italic">
                            "Adam Smith on specialization theory?"
                          </p>
                        </div>
                        <div className="border-l-3 border-green-500 bg-green-50 p-2 rounded-r-lg">
                          <p className="text-slate-700 text-xs italic">
                            "World Bank 2024 growth forecast?"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Questions to Avoid */}
                    <div>
                      <div className="flex items-center mb-2">
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                        <h3 className="text-sm font-semibold text-slate-800">Avoid These</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="border-l-3 border-red-500 bg-red-50 p-2 rounded-r-lg">
                          <p className="text-slate-700 text-xs italic">
                            Copyright protected content
                          </p>
                        </div>
                        <div className="border-l-3 border-red-500 bg-red-50 p-2 rounded-r-lg">
                          <p className="text-slate-700 text-xs italic">
                            Homework completion requests
                          </p>
                        </div>
                        <div className="border-l-3 border-red-500 bg-red-50 p-2 rounded-r-lg">
                          <p className="text-slate-700 text-xs italic">
                            Vague questions without context
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Research Tips */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 text-center">Quick Tips</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 mb-1">Be Specific</h4>
                        <p className="text-xs text-slate-600">
                          Clear, focused questions work best
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 mb-1">Verify Sources</h4>
                        <p className="text-xs text-slate-600">
                          Check responses with original data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.type === 'ai' && (
                        <span className="ml-2">• {message.model}</span>
                      )}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex space-x-4">
            <Textarea
              placeholder="Ask AI Economics Experts..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              className="flex-1 resize-none econai-chat-input"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
} 