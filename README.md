# EconAI Experts

A professional economics analysis platform powered by five leading AI models: ChatGPT, Claude, Gemini, DeepSeek, and Qwen.

## Features

### 🧠 Five AI Economics Experts
- **ChatGPT**: Comprehensive economics expert with strong theoretical analysis
- **Claude**: Full-spectrum economist balancing theory and empirical research  
- **Gemini**: Financial markets expert specializing in economic modeling
- **DeepSeek**: Economics professor focused on policy analysis
- **Qwen**: Applied economics researcher with practical insights

### 📊 Specialized Economics Areas
- **Macroeconomics**: National economic policy, inflation, GDP analysis
- **Monetary Economics**: Central bank policy, exchange rates, financial markets
- **Microeconomics**: Supply and demand, market structure, consumer behavior
- **Econometrics**: Data analysis, economic modeling, statistical inference

### 🌐 Curated Resources
- **Government & International Organizations**: Federal Reserve, World Bank, IMF, OECD reports
- **Top Academic Journals**: AEA Journals, QJE, SSRN, arXiv Economics

### 💬 Advanced Chat Features
- Real-time AI conversations with economics experts
- Chat history management and persistence
- Model switching during conversations
- Professional economic analysis and insights

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EconAI
```

2. Install dependencies:
```bash
npm install
```

3. Configure API Keys:
   - Open the application
   - Click "API Settings" in the header
   - Enter your API keys for the AI models you want to use

4. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to access the platform.

## API Keys Setup

You'll need API keys for the AI models you want to use:

- **OpenAI (ChatGPT)**: Get from [OpenAI Platform](https://platform.openai.com)
- **Anthropic (Claude)**: Get from [Anthropic Console](https://console.anthropic.com)
- **Google (Gemini)**: Get from [Google AI Studio](https://aistudio.google.com)
- **DeepSeek**: Get from [DeepSeek Platform](https://platform.deepseek.com)
- **Alibaba Cloud (Qwen)**: Get from [DashScope](https://dashscope.aliyuncs.com)

## Deployment

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import your fork
4. Deploy (Vercel will automatically detect Next.js)

### Environment Variables
No environment variables needed for basic deployment. API keys are configured in the browser and stored locally.

## Usage Tips

### Ask Specific Questions
"According to Federal Reserve reports, what are the main objectives of current monetary policy?"

### Request Theoretical Explanations  
"How does Adam Smith explain the role of division of labor in The Wealth of Nations?"

### Seek Real-time Analysis
"What is the World Bank's forecast for global economic growth in 2024?"

## Technology Stack

- **Framework**: Next.js 13+ with App Router
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page
│   ├── chat/
│   │   └── page.tsx      # Chat interface
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── apiConfig.ts      # AI model configurations
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

**EconAI Experts** - Professional Economics Analysis Platform 