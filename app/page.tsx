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
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
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
              <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">Get Started</Button>
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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
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
              <div className="flex flex-wrap gap-2 justify-center">
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
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Example questions:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      What are Kahneman's core insights?
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      Explain behavioral economics
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      Market efficiency theory
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Ask about economic theories, market analysis, policy implications, or any economics topic..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                      disabled={!message.trim()}
                    >
                      Ask AI
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isUploading && (
                  <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                    <CardContent className="p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drop your economics documents here</p>
                      <p className="text-sm text-gray-500">Supports PDF, DOCX, TXT files</p>
                      <Button variant="outline" className="mt-4">
                        Browse Files
                      </Button>
                    </CardContent>
                  </Card>
                )}
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