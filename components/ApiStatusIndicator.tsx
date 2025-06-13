import { Badge } from '@/components/ui/badge';
import { CheckCircle, Settings } from 'lucide-react';

interface ApiStatusIndicatorProps {
  configuredCount: number;
  totalCount: number;
  className?: string;
}

export function ApiStatusIndicator({ 
  configuredCount, 
  totalCount, 
  className = "" 
}: ApiStatusIndicatorProps) {
  const isAllConfigured = configuredCount === totalCount;
  const hasAnyConfigured = configuredCount > 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {hasAnyConfigured ? (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          {configuredCount}/{totalCount} APIs Configured
        </Badge>
      ) : (
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          <Settings className="h-3 w-3 mr-1" />
          API Setup Required
        </Badge>
      )}
      
      {isAllConfigured && (
        <span className="text-xs text-green-600 font-medium">
          ✨ All Ready
        </span>
      )}
    </div>
  );
} 