'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, MessageCircle, Brain, TrendingUp, DollarSign, BarChart3, PieChart, ExternalLink, BookOpen, Building, Globe, ArrowRight, Sparkles, Upload, CheckCircle, XCircle, FileText, MessageSquare, Shield } from 'lucide-react';
import { API_CONFIGS } from '@/lib/apiConfig';
import { useApiSettings } from '@/hooks/useApiSettings';
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator';
import AdSense, { AdSenseScript } from '@/components/AdSense';
import { AD_CONFIG } from '@/lib/adConfig';

interface ApiSettings {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [question, setQuestion] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Use custom hook to manage API settings
  const { 
    apiSettings, 
    isLoaded: apiSettingsLoaded, 
    saveApiSettings, 
    hasApiKey, 
    getApiKey, 
    getConfiguredModelsCount 
  } = useApiSettings();

  const economicsAreas = [
    { icon: TrendingUp, title: 'Macroeconomics', desc: 'National economic policy, inflation, GDP analysis' },
    { icon: DollarSign, title: 'Monetary Economics', desc: 'Central bank policy, exchange rates, financial markets' },
    { icon: BarChart3, title: 'Microeconomics', desc: 'Supply and demand, market structure, consumer behavior' },
    { icon: PieChart, title: 'Econometrics', desc: 'Data analysis, economic modeling, statistical inference' },
  ];

  const resourceCategories = [
    {
      title: 'Government & International Reports',
      icon: Building,
      iconColor: 'text-blue-600',
      resources: [
        { name: 'Federal Reserve Reports', url: 'https://www.federalreserve.gov/publications/', desc: 'Economic research and monetary policy insights' },
        { name: 'World Bank Open Knowledge', url: 'https://openknowledge.worldbank.org/', desc: 'Global development and economic data' },
        { name: 'IMF Publications', url: 'https://www.imf.org/en/Publications', desc: 'International monetary and financial analysis' },
        { name: 'OECD Economic Outlook', url: 'https://www.oecd.org/economic-outlook/', desc: 'Economic forecasts and policy analysis' }
      ]
    },
    {
      title: 'Academic & Open Access Resources',
      icon: BookOpen,
      iconColor: 'text-green-600', 
      resources: [
        { name: 'SSRN Economics', url: 'https://www.ssrn.com/', desc: 'Social Science Research Network papers' },
        { name: 'arXiv Economics', url: 'https://arxiv.org/list/econ/recent', desc: 'Open-access preprints in economics' },
        { name: 'The Quarterly Journal of Economics', url: 'https://academic.oup.com/qje', desc: 'Premier economics journal published by Oxford University Press' },
        { name: 'American Economic Association', url: 'https://www.aeaweb.org/journals', desc: 'Leading economics journals and research resources' }
      ]
    }
  ];

  const handleStartChat = () => {
    if (!question.trim()) {
      router.push(`/chat?model=${selectedModel}`);
      return;
    }
    
    const apiKey = getApiKey(selectedModel);
    if (!apiKey) {
      alert('Please configure API key first');
      setSettingsOpen(true);
      return;
    }

    // API settings are automatically saved through hook, no manual saving needed
    
    const params = new URLSearchParams({
      model: selectedModel,
      initialQuestion: question
    });
    router.push(`/chat?${params.toString()}`);
  };

  // Home page doesn't need temporary API settings, save directly
  const handleApiSettingChange = (modelKey: string, value: string) => {
    const newSettings = {
      ...apiSettings,
      [modelKey]: value
    };
    saveApiSettings(newSettings);
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Navigation bar height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleGetStarted = () => {
    scrollToSection('get-started');
  };

  return (
    <div className="min-h-screen">
      {/* 只在主页加载广告脚本 */}
      <AdSenseScript clientId={AD_CONFIG.GOOGLE_AD_CLIENT} />
      
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">EconAI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('features')}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('how-it-works')}
              >
                AI Chat
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('try-now')}
              >
                Best Practices
              </Button>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200 font-medium"
                onClick={() => scrollToSection('resources')}
              >
                Resources
              </Button>
              <Button 
                className="econai-button-primary px-6"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section id="features" className="text-center py-12">
          <div className="mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Professional Economics AI
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Your AI-Powered<br />
            <span className="econai-gradient-text">Economics</span> Knowledge Base
          </h1>
          
          {/* Economics Specialization Areas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Economics Specialization Areas</h2>
            <p className="text-base text-slate-600 mb-6">Comprehensive coverage across all major economics disciplines</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {economicsAreas.map((area, index) => (
                <Card key={index} className="econai-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                  <CardHeader className="pb-2 pt-4">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
                      <area.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base text-slate-800">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1 pb-4">
                    <CardDescription className="text-sm text-slate-600 leading-relaxed">{area.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-3 mt-6">
            <Button 
              onClick={handleGetStarted}
              className="econai-button-primary px-6 py-3 text-base h-auto"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('how-it-works')}
              className="px-6 py-3 text-base h-auto border-2 hover:bg-slate-50"
            >
              Try AI Chat
            </Button>
          </div>
        </section>

        {/* 广告展示 */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <AdSense 
              adSlot={AD_CONFIG.AD_SLOTS.HOME_MIDDLE_BANNER} 
              adFormat={AD_CONFIG.AD_FORMATS.AUTO}
              style={{ display: 'block', textAlign: 'center' }}
              className="mb-4"
            />
          </div>
        </section>

        {/* AI Expert Selection & Quick Start Chat */}
        <section id="how-it-works" className="mb-16">
          <Card className="econai-card border-0 max-w-4xl mx-auto p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Choose Your AI Economics Expert & Start Chatting</h2>
              <p className="text-base text-slate-600">Select your preferred AI model and begin your economics analysis</p>
            </div>

            {/* AI Model Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3 space-x-3">
                <h3 className="text-base font-semibold text-slate-800">Available AI Experts</h3>
                <ApiStatusIndicator 
                  configuredCount={getConfiguredModelsCount()} 
                  totalCount={Object.keys(API_CONFIGS).length}
                />
              </div>
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 bg-slate-50 p-2.5 rounded-2xl border">
                  {Object.entries(API_CONFIGS).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedModel === key ? "default" : "ghost"}
                      onClick={() => setSelectedModel(key)}
                      className={`min-w-[120px] h-10 text-sm transition-all duration-200 ${
                        selectedModel === key 
                          ? 'econai-button-primary shadow-lg' 
                          : 'hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {config.name}
                      {hasApiKey(key) && <Badge variant="secondary" className="ml-1.5 text-xs bg-green-100 text-green-700">✓</Badge>}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Expert Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="text-lg font-semibold text-slate-800">
                  Current Expert: {API_CONFIGS[selectedModel].name}
                </h4>
              </div>
              <p className="text-sm text-slate-600 text-center">
                {hasApiKey(selectedModel) 
                  ? "✅ API configured and ready for advanced analysis" 
                  : "⚠️ API key required for full functionality"}
              </p>
              {!hasApiKey(selectedModel) && (
                <div className="text-center mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSettingsOpen(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 text-sm h-8"
                  >
                    <Settings className="h-3 w-3 mr-1.5" />
                    Configure API Key
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Start Chat */}
            <div id="get-started" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700">
                  Your Economics Question (Optional)
                </label>
                <Textarea
                  placeholder="e.g., Explain the mechanisms of inflation's impact on the economy..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <Button 
                  onClick={handleStartChat} 
                  className="econai-button-primary py-3 text-base h-auto"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {question.trim() ? 'Start Analysis Chat' : 'Enter Chat Page'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSettingsOpen(true)}
                  className="py-3 text-base h-auto border-2 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage API Settings
                </Button>
              </div>

              {question.trim() && (
                <div className="bg-slate-50 rounded-lg p-3 border">
                  <p className="text-xs text-slate-600 mb-1">
                    <strong>Preview:</strong> You will ask {API_CONFIGS[selectedModel].name}:
                  </p>
                  <p className="text-sm text-slate-700 italic">"{question}"</p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Best Practices for Economics Research */}
        <section id="try-now" className="mb-20">
          <Card className="econai-card border-0 max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Best Practices for Economics Research</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Effective Questions */}
              <div>
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Effective Questions to Ask</h3>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      "What are the key findings in the latest Fed monetary policy report?"
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      "How does Adam Smith explain the role of specialization in The Wealth of Nations?"
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      "What is the World Bank's 2024 global growth forecast?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions to Avoid */}
              <div>
                <div className="flex items-center mb-4">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Questions to Avoid</h3>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      "What does Chapter 3 of Mankiw's textbook say?" (Copyright protected)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      "Help me do my homework" (Focus on understanding concepts)
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <p className="text-slate-700 italic">
                      Vague questions without specific context or documents
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Tips */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Research Tips</h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Ask Specific Questions</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Frame clear, specific questions and request comparisons between sources
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Verify Information</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Always verify AI responses with original sources for important decisions
                  </p>
                </div>
              </div>
            </div>

          </Card>
        </section>

        {/* Economics Knowledge Resources */}
        <section id="resources" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Economics Knowledge Resources</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Curated collection of free, high-quality economics resources to enhance your 
              research and understanding
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="econai-card border-0 p-8">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      category.iconColor === 'text-blue-600' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{category.title}</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <div 
                      key={resourceIndex} 
                      className="group cursor-pointer"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all duration-200">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                            {resource.name}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {resource.desc}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 ml-4 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          
          {/* More Resources Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => window.open('https://www.economicsweb.org/', '_blank')}
              className="econai-button-primary px-8 py-3 text-base h-auto group"
            >
              More
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </section>

        {/* 底部广告展示 */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <AdSense 
              adSlot={AD_CONFIG.AD_SLOTS.HOME_BOTTOM_BANNER} 
              adFormat={AD_CONFIG.AD_FORMATS.AUTO}
              style={{ display: 'block', textAlign: 'center' }}
              className="mb-4"
            />
          </div>
        </section>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
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
                      <label htmlFor={`api-key-${key}`} className="font-medium text-slate-800">
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
                      id={`api-key-${key}`}
                      type="password"
                      placeholder={`Enter ${config.name} API key`}
                      value={getApiKey(key)}
                      onChange={(e) => handleApiSettingChange(key, e.target.value)}
                      className="bg-white"
                    />
                    {hasApiKey(key) && (
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
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setSettingsOpen(false)} className="econai-button-primary">
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">EconAI</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Advanced AI-powered economics research platform combining multiple AI models with curated academic resources.
              </p>
              <div className="flex items-center text-sm text-slate-400">
                <Globe className="h-4 w-4 mr-2" />
                <span>Global Economics Research</span>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">AI Chat</a></li>
                <li><a href="#get-started" className="hover:text-blue-400 transition-colors">Get Started</a></li>
                <li><a href="/chat" className="hover:text-blue-400 transition-colors">Chat Interface</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#resources" className="hover:text-blue-400 transition-colors">Academic Resources</a></li>
                <li><a href="#try-now" className="hover:text-blue-400 transition-colors">Best Practices</a></li>
                <li><a href="https://www.federalreserve.gov/publications/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Federal Reserve</a></li>
                <li><a href="https://www.worldbank.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">World Bank</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-slate-200">Contact</h4>
              <div className="space-y-1 text-sm text-slate-300">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-slate-400" />
                  <a href="mailto:fangin1230@gmail.com" className="hover:text-blue-400 transition-colors">
                    fangin1230@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-slate-400">
                  © 2025 EconAI. All rights reserved. Created by <span className="text-slate-300 font-medium">fangxin</span>.
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Secure & Confidential</span>
                </div>
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  <span>AI-Powered Research</span>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Disclaimer:</strong> EconAI provides AI-assisted economic analysis and research tools. The information generated should be verified with original sources before making important decisions. This platform is designed for educational and research purposes. Users are responsible for ensuring compliance with their institution's academic integrity policies and relevant copyright laws.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 