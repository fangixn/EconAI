'use client';

import { useEffect, useState } from 'react';
import { AD_CONFIG, isAdSlotConfigured } from '@/lib/adConfig';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

interface AdSenseScriptProps {
  clientId: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// 用于条件性加载广告脚本的组件
export function AdSenseScript({ clientId }: AdSenseScriptProps) {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // 检查是否为生产环境
    const isDev = process.env.NODE_ENV === 'development' || 
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';
    
    setIsProduction(!isDev);

    // 只在生产环境加载广告脚本
    if (!isDev) {
      // 检查脚本是否已经加载
      if (document.querySelector(`script[src*="${clientId}"]`)) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('AdSense script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load AdSense script');
      };
      document.head.appendChild(script);

      return () => {
        // 清理脚本
        const existingScript = document.querySelector(`script[src*="${clientId}"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [clientId]);

  return null;
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto',
  style = { display: 'block' },
  className = '' 
}: AdSenseProps) {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // 检查是否为生产环境
    const isDev = process.env.NODE_ENV === 'development' || 
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';
    
    setIsProduction(!isDev);

    // 只在生产环境执行广告代码
    if (!isDev && isAdSlotConfigured(adSlot)) {
    try {
      if (typeof window !== 'undefined') {
          // 等待脚本加载完成
          const checkAdsbyGoogle = () => {
            if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
            } else {
              // 如果脚本还没加载，等待一段时间再试
              setTimeout(checkAdsbyGoogle, 1000);
            }
          };
          
          // 延迟执行，确保脚本已加载
          setTimeout(checkAdsbyGoogle, 100);
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
    }
  }, [adSlot]);

  // 在开发环境或广告位未配置时显示占位符
  if (!isProduction || !isAdSlotConfigured(adSlot)) {
    return (
      <div 
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}
        style={{ ...style, backgroundColor: '#f8f9fa' }}
      >
        <div className="text-gray-500">
          <div className="text-sm font-medium mb-2">📢 广告位占位符</div>
          <div className="text-xs text-gray-400">
            {!isProduction ? (
              <>
                广告只在生产环境显示<br/>
                当前环境: {process.env.NODE_ENV || 'development'}
              </>
            ) : (
              <>
                广告位ID未配置<br/>
                请在 lib/adConfig.ts 中配置广告位ID
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={AD_CONFIG.GOOGLE_AD_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
} 