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
  Loader2
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
      setApiSettings(JSON.parse(savedSettings));
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
      setSettingsOpen(true);
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
    const newSettings = {
      ...apiSettings,
      [modelKey]: value
    };
    setApiSettings(newSettings);
    localStorage.setItem('apiSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>API Key Configuration</DialogTitle>
                  <DialogDescription>
                    Configure API keys for each AI model
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {Object.entries(API_CONFIGS).map(([key, config]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium">{config.name}</label>
                      <Input
                        type="password"
                        placeholder={`Enter ${config.name} API key`}
                        value={apiSettings[key] || ''}
                        onChange={(e) => handleApiSettingChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Model Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">AI Experts</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(API_CONFIGS).map(([key, config]) => (
                <Button
                  key={key}
                  variant={selectedModel === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModel(key)}
                  className="text-xs"
                >
                  {config.name}
                  {apiSettings[key] && <Badge variant="secondary" className="ml-1 text-[10px] px-1">✓</Badge>}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <History className="h-4 w-4 mr-2" />
                Chat History
              </h3>
              <Button variant="ghost" size="sm" onClick={createNewSession}>
                <Brain className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
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
                {API_CONFIGS[selectedModel].name}
              </h1>
              <p className="text-sm text-gray-600">Economics Expert Chat</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-gray-50">
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Start New Chat</h3>
                <p className="text-gray-500">Ask your questions to AI Economics Experts</p>
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
              className="flex-1 resize-none"
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