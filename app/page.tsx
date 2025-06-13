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

interface ApiSettings {
  [key: string]: string;
}

export default function Home() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>('openai');
  const [question, setQuestion] = useState<string>('');
  const [apiSettings, setApiSettings] = useState<ApiSettings>({});
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    
    const apiKey = apiSettings[selectedModel];
    if (!apiKey) {
      alert('Please configure API key first');
      setSettingsOpen(true);
      return;
    }

    localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
    
    const params = new URLSearchParams({
      model: selectedModel,
      initialQuestion: question
    });
    router.push(`/chat?${params.toString()}`);
  };

  const handleApiSettingChange = (modelKey: string, value: string) => {
    setApiSettings(prev => ({
      ...prev,
      [modelKey]: value
    }));
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  return (
    <div className="min-h-screen econai-hero-bg">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
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
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                Features
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                How It Works
              </Button>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                Try Now
              </Button>
              <Button className="econai-button-primary px-6">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center py-20">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              Professional Economics AI
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Your AI-Powered<br />
            <span className="econai-gradient-text">Economics</span> Knowledge Base
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Upload your economics documents and engage in sophisticated conversations<br />
            with advanced AI models. Get expert insights on economic theories, market<br />
            analysis, and policy discussions.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleStartChat}
              className="econai-button-primary px-8 py-4 text-lg h-auto"
            >
              Start Exploring
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-4 text-lg h-auto border-2 hover:bg-slate-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Documents
            </Button>
          </div>
        </section>

        {/* AI Model Selection */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Choose Your AI Economics Expert</h2>
            <p className="text-slate-600">Select from our advanced AI models for economic analysis</p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl shadow-lg border">
              {Object.entries(API_CONFIGS).map(([key, config]) => (
                <Button
                  key={key}
                  variant={selectedModel === key ? "default" : "ghost"}
                  onClick={() => setSelectedModel(key)}
                  className={`min-w-[140px] h-12 ${
                    selectedModel === key 
                      ? 'econai-button-primary' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {config.name}
                  {apiSettings[key] && <Badge variant="secondary" className="ml-2 text-xs">✓</Badge>}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Economics Areas */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Economics Specialization Areas</h2>
            <p className="text-slate-600">Comprehensive coverage across all major economics disciplines</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {economicsAreas.map((area, index) => (
              <Card key={index} className="econai-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <area.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">{area.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Start Chat */}
        <section className="mb-20">
          <Card className="econai-card border-0 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl text-slate-800">
                <MessageCircle className="h-6 w-6 mr-3 text-blue-600" />
                Quick Start Chat
              </CardTitle>
              <CardDescription className="text-lg">
                Current Expert: {API_CONFIGS[selectedModel].name} • Ready to analyze your economics questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-base font-medium mb-3 block text-slate-700">Your Economics Question (Optional)</label>
                <Textarea
                  placeholder="e.g., Explain the mechanisms of inflation's impact on the economy..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="text-base"
                />
              </div>
              <Button 
                onClick={handleStartChat} 
                className="w-full econai-button-primary py-4 text-lg"
              >
                {question.trim() ? 'Start Analysis Chat' : 'Enter Chat Page'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Best Practices for Economics Research */}
        <section className="mb-20">
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
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Select Relevant Documents</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Choose 3-5 related documents per conversation for best AI responses
                  </p>
                </div>
                
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
        <section className="mb-20">
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
        </section>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>API Key Configuration</DialogTitle>
              <DialogDescription>
                Configure API keys for each AI model to enable full functionality
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
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-800">EconAI</span>
          </div>
          <p className="text-slate-600 mb-2">Five AI Economics Experts for Professional Economic Analysis</p>
          <p className="text-sm text-slate-500">Combined with recommended resources for deeper economic insights</p>
        </div>
      </footer>
    </div>
  );
} 