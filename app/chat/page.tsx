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
import { useApiSettings } from '@/hooks/useApiSettings';
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator';

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
  const [tempApiSettings, setTempApiSettings] = useState<ApiSettings>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  
  // Use custom hook to manage API settings
  const { 
    apiSettings, 
    isLoaded: apiSettingsLoaded, 
    saveApiSettings, 
    hasApiKey, 
    getApiKey, 
    getConfiguredModelsCount 
  } = useApiSettings();

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

    // API settings will be automatically loaded through useApiSettings hook

    // Load chat history from localStorage with error handling
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert date strings back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessionsWithDates);
        
        // Load the most recent session if no initial question
        const initialQuestion = searchParams.get('initialQuestion');
        if (initialQuestion) {
          setCurrentMessage(initialQuestion);
          createNewSession();
        } else if (sessionsWithDates.length > 0) {
          // Load the most recent session
          const mostRecentSession = sessionsWithDates[0];
          setCurrentSessionId(mostRecentSession.id);
          setMessages(mostRecentSession.messages);
        } else {
          // No existing sessions, create new one
          createNewSession();
        }
      } else {
        // No saved sessions, create new one
        createNewSession();
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      // If data is corrupted, clear it and start fresh
      localStorage.removeItem('chatSessions');
      createNewSession();
    }
  }, [searchParams]);

      // Sync to temporary settings when API settings loading is complete
  useEffect(() => {
    if (apiSettingsLoaded) {
      setTempApiSettings(apiSettings);
    }
  }, [apiSettingsLoaded, apiSettings]);

  // Auto-save chat sessions whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      saveSessions(chatSessions);
    }
  }, [chatSessions]);

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

  // Save sessions to localStorage with error handling
  const saveSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
      // Attempt to clear space and try again
      try {
        // Remove old sessions (keep only the latest 50)
        const trimmedSessions = sessions.slice(0, 50);
        localStorage.setItem('chatSessions', JSON.stringify(trimmedSessions));
      } catch (retryError) {
        console.error('Failed to save even trimmed sessions:', retryError);
      }
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const apiKey = getApiKey(selectedModel);
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

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsLoading(true);

    // Update session with user message immediately
    setChatSessions(prevSessions => {
      return prevSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: newMessages,
            title: newMessages.length === 1 ? userMessage.content.slice(0, 30) + '...' : session.title,
            updatedAt: new Date()
          };
        }
        return session;
      });
    });

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
          // Auto-save will be handled by useEffect
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
      
      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        
        // Update current session with error message
        setChatSessions(prevSessions => {
          const updatedSessions = prevSessions.map(session => {
            if (session.id === currentSessionId) {
              return {
                ...session,
                messages: newMessages,
                updatedAt: new Date()
              };
            }
            return session;
          });
          return updatedSessions;
        });
        
        return newMessages;
      });
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
    // Auto-save will be handled by useEffect
    
    if (sessionId === currentSessionId) {
      if (updatedSessions.length > 0) {
        switchSession(updatedSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleApiSettingChange = (modelKey: string, value: string) => {
    // Only update temporary settings, don't save immediately
    setTempApiSettings(prev => ({
      ...prev,
      [modelKey]: value
    }));
  };

  const handleSaveSettings = () => {
    // Save settings and close dialog
    const success = saveApiSettings(tempApiSettings);
    if (success) {
      setSettingsOpen(false);
    } else {
      alert('Failed to save API settings. Please try again.');
    }
  };

  const handleCancelSettings = () => {
    // Restore to original settings, undo unsaved changes
    setTempApiSettings(apiSettings);
    setSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    // Copy current settings to temporary settings when opening settings
    setTempApiSettings(apiSettings);
    setSettingsOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
              {/* Left Sidebar - Increased width for full display and added responsive design */}
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
                
                {/* Scrollable area */}
                <div className="flex-1 api-scroll-area space-y-6 mt-6 pr-2">
                  {Object.entries(API_CONFIGS).map(([key, config]) => {
                    // Define API application links for each model
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
                            Get API Key →
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
                            API Key Configured
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                                  {/* Fixed button area at bottom */}
                <div className="flex-shrink-0 flex justify-end space-x-3 mt-6 pt-6 border-t econai-dialog-footer">
                  <Button variant="outline" onClick={handleCancelSettings}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings} className="econai-button-primary">
                                          Save Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Model Selection - Changed to single column layout for full display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">EconAI</h3>
              <ApiStatusIndicator 
                configuredCount={getConfiguredModelsCount()} 
                totalCount={Object.keys(API_CONFIGS).length}
                className="scale-90"
              />
            </div>
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
                  {hasApiKey(key) && (
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
        <div className="econai-chat-input-container p-6">
          <div className="relative">
            <Textarea
              placeholder="Ask your economics questions here..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              className="w-full resize-none econai-chat-input pr-16 text-base"
            />
            {/* Inline Send Button */}
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="econai-inline-send absolute bottom-2 right-2 h-8 w-12 econai-button-primary"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Bottom Info Bar */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Press Enter to send
              </span>
              <span>Shift + Enter for new line</span>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              {currentMessage.length > 0 && (
                <span className="econai-char-counter text-blue-600 font-medium">
                  {currentMessage.length} characters
                </span>
              )}
              {getConfiguredModelsCount() > 0 && (
                <span className="text-green-600 font-medium">
                  ✓ {getConfiguredModelsCount()} AI models configured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 