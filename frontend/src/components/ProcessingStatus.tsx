
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
}

export function ProcessingStatus({ status, progress, message }: ProcessingStatusProps) {
  if (status === 'idle') return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Processing your image...';
      case 'completed':
        return 'Processing completed!';
      case 'error':
        return 'Processing failed';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/50';
      case 'completed':
        return 'border-green-500/50 bg-green-50/50 dark:bg-green-950/50';
      case 'error':
        return 'border-red-500/50 bg-red-50/50 dark:bg-red-950/50';
      default:
        return '';
    }
  };

  return (
    <Card className={`p-6 border-2 transition-all duration-500 animate-fade-in ${getStatusColor()}`}>
      <div className="flex items-center space-x-4 mb-4">
        {getStatusIcon()}
        <div>
          <h3 className="font-semibold">{getStatusText()}</h3>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
      
      {status === 'processing' && (
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2"
          />
          <p className="text-sm text-muted-foreground text-center">
            {progress}% complete
          </p>
        </div>
      )}
    </Card>
  );
}
