import { Sentry } from './sentry';
import { toast } from '@/components/ui/use-toast';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const handleError = (error: unknown, context?: string): ApiError => {
  const errorObj: ApiError = {
    message: 'An unexpected error occurred',
  };

  if (error instanceof Error) {
    errorObj.message = error.message;
    Sentry.captureException(error, { tags: { context } });
  } else if (typeof error === 'string') {
    errorObj.message = error;
  }

  toast({
    title: 'Error',
    description: errorObj.message,
    variant: 'destructive',
  });

  return errorObj;
};

export const retryAsync = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryAsync(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
