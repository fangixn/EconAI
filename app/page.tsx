'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, MessageCircle, Brain, TrendingUp, DollarSign, BarChart3, PieChart, ExternalLink, BookOpen, Building, Globe, ArrowRight } from 'lucide-react';
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
      title: 'Government and International Organization Reports',
      icon: Building,
      resources: [
        { name: 'Federal Reserve Economic Reports', url: 'https://www.federalreserve.gov/publications/', desc: 'US monetary policy and economic analysis' },
        { name: 'World Bank Open Knowledge Repository', url: 'https://openknowledge.worldbank.org/', desc: 'Global development economics research' },
        { name: 'IMF Publications', url: 'https://www.imf.org/en/Publications', desc: 'International Monetary Fund research' },
        { name: 'People\'s Bank of China Working Papers', url: 'http://www.pbc.gov.cn/', desc: 'Chinese monetary policy research' },
        { name: 'OECD Economic Outlook', url: 'https://www.oecd.org/economic-outlook/', desc: 'OECD economic forecasts' }
      ]
    },
    {
      title: 'Top Academic Journal Resources',
      icon: BookOpen,
      resources: [
        { name: 'AEA Journals', url: 'https://www.aeaweb.org/journals', desc: 'American Economic Association authoritative journal collection' },
        { name: 'QJE Journal', url: 'https://academic.oup.com/qje', desc: 'Oxford University Quarterly Journal of Economics' },
        { name: 'SSRN Economics', url: 'https://www.ssrn.com/', desc: 'Social Science Research Network' },
        { name: 'arXiv Economics', url: 'https://arxiv.org/list/econ/recent', desc: 'Economics preprint papers' }
      ]
    }
  ];

  const handleStartChat = () => {
    if (!question.trim()) {
      // If no question, go directly to chat page
      router.push(`/chat?model=${selectedModel}`);
      return;
    }
    
    const apiKey = apiSettings[selectedModel];
    if (!apiKey) {
      alert('Please configure API key first');
      setSettingsOpen(true);
      return;
    }

    // Save settings to localStorage
    localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
    
    // Navigate to chat page with initial question
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EconAI Experts</h1>
                <p className="text-sm text-gray-600">Five AI Economics Experts at Your Service</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/chat?model=${selectedModel}`)}
                className="flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Chat
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    API Settings
                  </Button>
                </DialogTrigger>
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
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Economics Areas */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Economics Specialization Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {economicsAreas.map((area, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <area.icon className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{area.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Model Selection */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Choose Your AI Economics Expert</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(API_CONFIGS).map(([key, config]) => (
              <Button
                key={key}
                variant={selectedModel === key ? "default" : "outline"}
                onClick={() => setSelectedModel(key)}
                className="min-w-[120px]"
              >
                {config.name}
                {apiSettings[key] && <Badge variant="secondary" className="ml-2 text-xs">Configured</Badge>}
              </Button>
            ))}
          </div>
        </section>

        {/* Quick Start Chat */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Quick Start Chat
              </CardTitle>
              <CardDescription>
                Current Expert: {API_CONFIGS[selectedModel].name} • After submitting a question, you&apos;ll be redirected to a dedicated chat page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Economics Question (Optional)</label>
                <Textarea
                  placeholder="e.g., Explain the mechanisms of inflation's impact on the economy..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleStartChat} 
                className="w-full"
              >
                {question.trim() ? 'Start Analysis Chat' : 'Enter Chat Page'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Example Questions */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Popular Economics Questions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Causes and impacts of current global inflation trends',
              'Digital currency impact on traditional financial systems',
              'Economic principles of carbon trading markets',
              'Artificial intelligence effects on labor markets',
              'Economic analysis of supply chain disruptions',
              'Investment opportunities and risks in emerging markets'
            ].map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 text-left justify-start whitespace-normal"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </section>

        {/* Recommended Resources */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Recommended Economics Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <category.icon className="h-5 w-5 mr-2 text-blue-600" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="flex items-start justify-between group">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{resource.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{resource.desc}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Usage Tips</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Ask specific questions:</strong> &quot;According to Federal Reserve reports, what are the main objectives of current monetary policy?&quot;</p>
              <p>• <strong>Request theoretical explanations:</strong> &quot;How does Adam Smith explain the role of division of labor in The Wealth of Nations?&quot;</p>
              <p>• <strong>Seek real-time analysis:</strong> &quot;What is the World Bank&apos;s forecast for global economic growth in 2024?&quot;</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 bg-white border-t">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>EconAI Experts - Five AI Economics Experts for Professional Economic Analysis</p>
          <p className="text-xs mt-2">Combined with recommended resources for deeper economic insights</p>
        </div>
      </footer>
    </div>
  );
} 