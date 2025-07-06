import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EconAI Experts - AI Economics Analysis Platform',
  description: 'Professional economics analysis platform powered by five AI experts including ChatGPT, Claude, Gemini, DeepSeek, and Qwen. Get expert insights on macroeconomics, microeconomics, monetary policy, and econometrics.',
  keywords: 'economics, AI, macroeconomics, microeconomics, monetary policy, econometrics, research, analysis, ChatGPT, Claude, Gemini, DeepSeek, Qwen',
  authors: [{ name: 'fangxin', url: 'mailto:fangin1230@gmail.com' }],
  creator: 'fangxin',
  metadataBase: new URL('https://econai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EconAI Experts - AI Economics Analysis Platform',
    description: 'Get expert economics insights from 5 leading AI models - ChatGPT, Claude, Gemini, DeepSeek, and Qwen',
    url: 'https://econai.vercel.app',
    siteName: 'EconAI Experts',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'EconAI Experts Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EconAI Experts - AI Economics Analysis Platform',
    description: 'Professional economics analysis with 5 AI experts',
    images: ['/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EconAI" />
        
        {/* Viewport for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WTG8PRNPZQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WTG8PRNPZQ');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
