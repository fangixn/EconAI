import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EconAI Experts - AI Economics Analysis Platform',
  description: 'Professional economics analysis platform powered by five AI experts including ChatGPT, Claude, Gemini, DeepSeek, and Qwen. Get expert insights on macroeconomics, microeconomics, monetary policy, and econometrics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
