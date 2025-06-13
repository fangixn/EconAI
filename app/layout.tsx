import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EconAI - 您的智能经济分析助手',
  description: '专业的 AI 经济分析助手，为您提供专业的经济分析和建议',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={cn(
        inter.className,
        'min-h-screen bg-gray-50'
      )}>
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  EconAI
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/chat" className="text-gray-600 hover:text-gray-900">
                  开始对话
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
