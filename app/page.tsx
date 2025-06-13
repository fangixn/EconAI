'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  Send,
  Bot,
  User,
  Settings,
  Key,
  Save
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  model?: string;
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  content?: string;
  file?: File;
}

interface ApiConfig {
  openai?: string;
  anthropic?: string;
  google?: string;
}

interface ApiSettings {
  enabled: boolean;
  configs: ApiConfig;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    enabled: false,
    configs: {}
  });
  const [tempApiConfigs, setTempApiConfigs] = useState<ApiConfig>({});

  const aiModels = [
    { id: 'chatgpt', name: 'ChatGPT', color: 'bg-green-500' },
    { id: 'deepseek', name: 'DeepSeek', color: 'bg-blue-500' },
    { id: 'gemini', name: 'Gemini', color: 'bg-purple-500' }
  ];

  // Load saved API configurations on mount
  useEffect(() => {
    const savedConfigs = localStorage.getItem('econ-ai-api-configs');
    if (savedConfigs) {
      try {
        const configs = JSON.parse(savedConfigs);
        setApiSettings({
          enabled: Object.keys(configs).length > 0,
          configs
        });
      } catch (error) {
        console.error('Failed to load API configs:', error);
      }
    }
  }, []);

  // Save API configurations
  const saveApiConfigs = () => {
    const cleanConfigs = Object.fromEntries(
      Object.entries(tempApiConfigs).filter(([_, value]) => value && value.trim())
    );
    
    localStorage.setItem('econ-ai-api-configs', JSON.stringify(cleanConfigs));
    setApiSettings({
      enabled: Object.keys(cleanConfigs).length > 0,
      configs: cleanConfigs
    });
    setIsSettingsOpen(false);
  };

  // Real AI API call function
  const callRealAI = async (message: string, model: string): Promise<string> => {
    const { configs } = apiSettings;
    
    // Prepare context from uploaded files
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.content);
    let contextPrompt = message;
    
    if (completedFiles.length > 0) {
      const fileContexts = completedFiles.map(file => 
        `--- Content from ${file.name} ---\n${file.content}\n--- End of ${file.name} ---\n`
      ).join('\n');
      
      contextPrompt = `Please analyze the following uploaded documents and answer the user's question based on the content:

${fileContexts}

User Question: ${message}

Please provide a detailed analysis based on the uploaded documents. If the documents don't contain relevant information to answer the question, please indicate that and provide general guidance.`;
    }
    
    try {
      if (model === 'chatgpt' && configs.openai) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${configs.openai}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an economics expert. Analyze uploaded documents and provide detailed, accurate responses about economic theories, concepts, and analysis based on the provided content.'
              },
              {
                role: 'user',
                content: contextPrompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response received';
      }
      
      if (model === 'gemini' && configs.google) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${configs.google}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `As an economics expert, please analyze the provided documents and respond to the question:\n\n${contextPrompt}`
              }]
            }]
          }),
        });

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      }

      // Fallback for other models or missing API keys
      throw new Error('API key not configured for selected model');
      
    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  };

  // Simulate AI response function
  const simulateAIResponse = (userMessage: string, model: string): string => {
    const responses = {
      chatgpt: [
        "This is a fascinating economics question. According to modern economic theory...",
        "From a macroeconomic perspective, this issue involves multiple aspects...",
        "Let's start by analyzing the fundamental principles of microeconomics..."
      ],
      deepseek: [
        "Based on deep learning economic model analysis, I believe...",
        "Through big data analysis and machine learning algorithms, we can see...",
        "From an AI perspective, understanding this economic phenomenon..."
      ],
      gemini: [
        "This economic concept can be understood from multiple dimensions...",
        "Combining historical data and current market trends, my analysis is...",
        "From the perspective of global economic integration..."
      ]
    };
    
    const modelResponses = responses[model as keyof typeof responses];
    const randomResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)];
    
    // Check if there are uploaded files with content
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.content);
    
    if (completedFiles.length > 0) {
      return `${randomResponse} 

Based on the ${completedFiles.length} document(s) you've uploaded (${completedFiles.map(f => f.name).join(', ')}), I can see that your question about "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}" relates to the economic concepts and data presented in these materials.

[DEMO MODE] In the full version with API keys configured, I would provide a detailed analysis of your uploaded documents. For now, this is a simulated response. Please configure your API keys in the settings to enable real document analysis.

The uploaded files contain valuable economic information that would be analyzed in detail with real AI integration.`;
    }
    
    return `${randomResponse} Your question about "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}" is an excellent inquiry. In economics, this involves supply and demand relationships, market efficiency, consumer behavior, and many other aspects. Let me explain in detail...`;
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    
    try {
      let responseContent: string;
      
      // Use real AI if API is configured
      if (apiSettings.enabled) {
        responseContent = await callRealAI(currentMessage, selectedModel);
      } else {
        // Fallback to simulation
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        responseContent = simulateAIResponse(currentMessage, selectedModel);
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'ai',
        model: selectedModel,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration in settings.`,
        sender: 'ai',
        model: selectedModel,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle example question click
  const handleExampleClick = (exampleText: string) => {
    setMessage(exampleText);
  };

  // Handle file upload with progress
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        file: file
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
      
      // Simulate upload progress
      simulateUploadProgress(uploadedFile.id);
    });
  };

  // Simulate upload progress
  const simulateUploadProgress = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, progress: Math.min(progress, 100) }
            : file
        )
      );
      
      if (progress >= 100) {
        clearInterval(interval);
        // Mark as completed and read file content
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, status: 'completed', progress: 100 }
                : file
            )
          );
          // Read file content after completion
          processFileContent(fileId);
        }, 300);
      }
    }, 200 + Math.random() * 300); // Random interval between 200-500ms
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Basic EPUB text extraction (simplified approach)
  const extractEpubText = async (file: File): Promise<string> => {
    try {
      // EPUB files are ZIP archives, but we'll attempt a basic text extraction
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let text = '';
      
      // Convert to string and look for readable text patterns
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(uint8Array);
      
      // Basic text extraction - look for content between tags
      const textMatches = content.match(/>([^<]+)</g);
      if (textMatches) {
        text = textMatches
          .map(match => match.slice(1, -1).trim())
          .filter(text => text.length > 10 && !/^[\d\s\W]*$/.test(text))
          .join(' ')
          .slice(0, 5000); // Limit to first 5000 characters
      }
      
      if (text.length > 100) {
        return `[EPUB EBOOK: ${file.name}]\nExtracted content preview:\n\n${text}`;
      } else {
        return `[EPUB EBOOK: ${file.name}]\nNote: Could not extract readable text. Please convert to .txt or .md format for better results.`;
      }
    } catch (error) {
      return `[EPUB EBOOK: ${file.name}]\nNote: Error reading EPUB file. Please convert to .txt or .md format.`;
    }
  };

  // Basic MOBI text extraction attempt
  const extractMobiText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // MOBI files have a specific structure, try basic text extraction
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const content = decoder.decode(uint8Array);
      
      // Look for readable text patterns in MOBI format
      const textMatches = content.match(/[A-Za-z][A-Za-z\s.,!?;:'"()-]{20,}/g);
      if (textMatches && textMatches.length > 0) {
        const text = textMatches
          .slice(0, 50) // Take first 50 matches
          .join(' ')
          .slice(0, 5000); // Limit to first 5000 characters
        
        if (text.length > 100) {
          return `[MOBI EBOOK: ${file.name}]\nExtracted content preview:\n\n${text}`;
        }
      }
      
      return `[MOBI EBOOK: ${file.name}]\nNote: Could not extract readable text. Please convert to .txt or .md format using Calibre for better results.`;
    } catch (error) {
      return `[MOBI EBOOK: ${file.name}]\nNote: Error reading MOBI file. Please convert to .txt or .md format.`;
    }
  };

  // Read file content based on file type
  const readFileContent = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();
    
    // Handle EPUB and MOBI files with special extraction
    if (fileName.endsWith('.epub') || file.type === 'application/epub+zip') {
      return await extractEpubText(file);
    } else if (fileName.endsWith('.mobi') || file.type === 'application/x-mobipocket-ebook') {
      return await extractMobiText(file);
    }
    
    // Handle other formats with FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
          resolve(result);
        } else if (fileName.endsWith('.md') || fileName.endsWith('.markdown') || file.type === 'text/markdown') {
          // Markdown files - read as text and add format note
          resolve(`[MARKDOWN FILE: ${file.name}]\n\n${result}`);
        } else if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
          // For now, we'll show a message that PDF parsing is not yet implemented
          resolve(`[PDF FILE: ${file.name}]\nNote: PDF content extraction is not yet implemented. Please copy and paste the text content manually or convert to .txt format.`);
        } else if (file.type.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
          // For now, we'll show a message that DOCX parsing is not yet implemented
          resolve(`[WORD DOCUMENT: ${file.name}]\nNote: Word document content extraction is not yet implemented. Please copy and paste the text content manually or convert to .txt format.`);
        } else {
          // Try to read as text anyway for other formats
          try {
            resolve(`[UNKNOWN FORMAT: ${file.name}]\nAttempting to read as text:\n\n${result}`);
          } catch {
            resolve(`[UNSUPPORTED FORMAT: ${file.name}]\nThis file format is not fully supported. Please convert to TXT, MD, or other supported formats.`);
          }
        }
      };
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };
      
      reader.readAsText(file);
    });
  };

  // Process uploaded file content
  const processFileContent = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.file) return;

    try {
      const content = await readFileContent(file.file);
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, content: content }
            : f
        )
      );
    } catch (error) {
      console.error('Failed to read file content:', error);
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' }
            : f
        )
      );
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EconAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#chat" className="text-gray-600 hover:text-gray-900 transition-colors">Try Now</a>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#chat" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Try Now</a>
              <Button 
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Sparkles className="h-4 w-4 mr-1" />
              Professional Economics AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-Powered
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Economics{" "}
              </span>
              Knowledge Base
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your economics documents and engage in sophisticated conversations with advanced AI models. 
              Get expert insights on economic theories, market analysis, and policy discussions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                onClick={() => {
                  document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3"
                onClick={() => {
                  setIsUploading(true);
                  document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FileText className="mr-2 h-5 w-5" />
                Upload Documents
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Economics AI Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized AI models trained to understand and analyze economic concepts, 
              theories, and real-world applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to unlock the power of AI-driven economics knowledge
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-y-1/2" style={{ left: '58%', width: '84%' }} />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface Section */}
      <section id="chat" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Our AI Economics Expert
            </h2>
            <p className="text-xl text-gray-600">
              Ask questions about economic theories, policies, or market analysis
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {aiModels.map((model) => (
                    <Button
                      key={model.id}
                      variant={selectedModel === model.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedModel(model.id)}
                      className={selectedModel === model.id ? `${model.color} text-white hover:opacity-90` : ''}
                    >
                      {model.name}
                    </Button>
                  ))}
                </div>
                
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-2"
                      onClick={() => {
                        setTempApiConfigs(apiSettings.configs);
                        setIsSettingsOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>API Settings</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Key className="h-5 w-5" />
                        <span>AI API Configuration</span>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 mb-2">Getting Started</h4>
                        <p className="text-sm text-blue-800">
                          Configure your AI API keys to enable real AI conversations. Your keys are stored locally and never sent to our servers.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="openai-key" className="flex items-center space-x-2 mb-2">
                            <span>OpenAI API Key (for ChatGPT)</span>
                            <a 
                              href="https://platform.openai.com/api-keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Get Key
                            </a>
                          </Label>
                          <Input
                            id="openai-key"
                            type="password"
                            placeholder="sk-..."
                            value={tempApiConfigs.openai || ''}
                            onChange={(e) => setTempApiConfigs(prev => ({
                              ...prev,
                              openai: e.target.value
                            }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="google-key" className="flex items-center space-x-2 mb-2">
                            <span>Google AI API Key (for Gemini)</span>
                            <a 
                              href="https://aistudio.google.com/app/apikey" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Get Key
                            </a>
                          </Label>
                          <Input
                            id="google-key"
                            type="password"
                            placeholder="AI..."
                            value={tempApiConfigs.google || ''}
                            onChange={(e) => setTempApiConfigs(prev => ({
                              ...prev,
                              google: e.target.value
                            }))}
                          />
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                          <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• API keys are stored locally in your browser</li>
                            <li>• You will be charged by the AI service providers for usage</li>
                            <li>• Always keep your API keys secure and never share them</li>
                            <li>• Without API keys, the system will use simulated responses</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsSettingsOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={saveApiConfigs}
                          className="flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Configuration</span>
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Chat messages display area */}
                {chatMessages.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {msg.sender === 'ai' && (
                              <Bot className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
                            )}
                            {msg.sender === 'user' && (
                              <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-sm">{msg.content}</p>
                              {msg.model && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {aiModels.find(m => m.id === msg.model)?.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-4 w-4 text-blue-600" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Example questions:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleExampleClick("What are Kahneman's core insights?")}
                    >
                      What are Kahneman's core insights?
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleExampleClick("Explain behavioral economics")}
                    >
                      Explain behavioral economics
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleExampleClick("Market efficiency theory")}
                    >
                      Market efficiency theory
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Ask about economic theories, market analysis, policy implications, or any economics topic..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setIsUploading(!isUploading)}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Document</span>
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!message.trim() || isLoading}
                      onClick={handleSendMessage}
                    >
                      {isLoading ? 'Sending...' : 'Ask AI'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* API Status Indicator */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className={`w-2 h-2 rounded-full ${apiSettings.enabled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span>
                        {apiSettings.enabled ? 'Real AI Enabled' : 'Demo Mode (Configure API keys for real AI)'}
                      </span>
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div>
                    <Card 
                      className={`border-2 border-dashed transition-colors ${
                        isDragOver 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <CardContent className="p-8 text-center">
                        <Upload className={`h-12 w-12 mx-auto mb-4 ${
                          isDragOver ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <p className={`mb-2 ${
                          isDragOver ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {isDragOver ? 'Release to upload files' : 'Drop your economics documents here'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Supports TXT & MD (full content) • PDF, DOCX, EPUB, MOBI (basic support - convert to TXT/MD for best results)
                        </p>
                        <Button variant="outline" onClick={handleFileSelect}>
                          Browse Files
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.docx,.doc,.txt,.md,.markdown,.epub,.mobi"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </CardContent>
                    </Card>
                    
                    {/* Display uploaded files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                        <div className="space-y-3">
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="p-3 bg-white border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    {file.status === 'completed' && file.content && (
                                      <p className="text-xs text-green-600">✓ Content ready for AI analysis</p>
                                    )}
                                    {file.status === 'completed' && !file.content && (
                                      <p className="text-xs text-yellow-600">⚠ Content extraction failed</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {file.status === 'completed' && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {file.status === 'uploading' && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-600">
                                    <span>Uploading...</span>
                                    <span>{Math.round(file.progress)}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-2 bg-blue-600"
                                      style={{ width: `${Math.round(file.progress)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              {file.status === 'completed' && file.content && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-700">Content Preview:</span>
                                    <span className="text-gray-500">{file.content.length} characters</span>
                                  </div>
                                  <div className="text-gray-600 max-h-20 overflow-y-auto">
                                    {file.content.length > 200 
                                      ? `${file.content.substring(0, 200)}...` 
                                      : file.content
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Economics Resources Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Economics Knowledge Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Curated collection of free, high-quality economics resources to enhance your research and understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Government & International Organizations */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <span>Government & International Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <a
                    href="https://www.federalreserve.gov/publications/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">Federal Reserve Reports</h4>
                      <p className="text-sm text-gray-600">Economic research and monetary policy insights</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                  
                  <a
                    href="https://openknowledge.worldbank.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">World Bank Open Knowledge</h4>
                      <p className="text-sm text-gray-600">Global development and economic data</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                  
                  <a
                    href="https://www.imf.org/en/Publications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">IMF Publications</h4>
                      <p className="text-sm text-gray-600">International monetary and financial analysis</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                  
                  <a
                    href="https://www.oecd.org/economic-outlook/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">OECD Economic Outlook</h4>
                      <p className="text-sm text-gray-600">Economic forecasts and policy analysis</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Academic Resources */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <span>Academic & Open Access Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <a
                    href="https://www.ssrn.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600">SSRN Economics</h4>
                      <p className="text-sm text-gray-600">Social Science Research Network papers</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                  </a>
                  
                  <a
                    href="https://arxiv.org/list/econ/recent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600">arXiv Economics</h4>
                      <p className="text-sm text-gray-600">Open-access preprints in economics</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                  </a>
                  
                  <a
                    href="https://academic.oup.com/qje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600">The Quarterly Journal of Economics</h4>
                      <p className="text-sm text-gray-600">Premier economics journal published by Oxford University Press</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                  </a>
                  
                  <a
                    href="https://www.aeaweb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600">American Economic Association</h4>
                      <p className="text-sm text-gray-600">Leading economics journals and research resources</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices Section */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <span>Best Practices for Economics Research</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Effective Questions to Ask
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r">
                      <p className="text-sm text-gray-700">"What are the key findings in the latest Fed monetary policy report?"</p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r">
                      <p className="text-sm text-gray-700">"How does Adam Smith explain the role of specialization in The Wealth of Nations?"</p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r">
                      <p className="text-sm text-gray-700">"What is the World Bank's 2024 global growth forecast?"</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <X className="h-5 w-5 text-red-600 mr-2" />
                    Questions to Avoid
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
                      <p className="text-sm text-gray-700">"What does Chapter 3 of Mankiw's textbook say?" (Copyright protected)</p>
                    </div>
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
                      <p className="text-sm text-gray-700">"Help me do my homework" (Focus on understanding concepts)</p>
                    </div>
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
                      <p className="text-sm text-gray-700">Vague questions without specific context or documents</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Research Tips</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">Select Relevant Documents</h5>
                    <p className="text-sm text-gray-600">Choose 3-5 related documents per conversation for best AI responses</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">Ask Specific Questions</h5>
                    <p className="text-sm text-gray-600">Frame clear, specific questions and request comparisons between sources</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">Verify Information</h5>
                    <p className="text-sm text-gray-600">Always verify AI responses with original sources for important decisions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EconAI</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Professional AI-powered economics knowledge base. 
                Advancing economic understanding through artificial intelligence.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Models</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>fangxin</li>
                <li>fangin1230@gmail.com</li>
                <li>© 2025 EconAI</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 EconAI by fangxin. All rights reserved. Building the future of economics education through AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}