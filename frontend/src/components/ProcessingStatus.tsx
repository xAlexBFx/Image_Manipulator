import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  errorMessage?: string;
}

export function ProcessingStatus({ status, progress, message, errorMessage }: ProcessingStatusProps) {
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
        return 'Processing your image... (Time might increase with larger images/kernels size)';
      case 'completed':
        return 'Processing completed!';
      case 'error':
        return errorMessage || 'Processing failed';
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
    </Card>
  );
}
