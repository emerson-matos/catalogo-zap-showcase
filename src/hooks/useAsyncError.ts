import { useCallback, useRef } from 'react';
import { reportAsyncError } from '@/components/ErrorBoundaryProvider';

interface UseAsyncErrorOptions {
  readonly onError?: (error: Error) => void;
  readonly context?: string;
}

interface UseAsyncErrorReturn {
  readonly handleAsyncError: (error: Error) => void;
  readonly executeAsync: <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ) => Promise<T | undefined>;
}

/**
 * Hook for handling async errors in React 19
 * Since error boundaries don't catch async errors, this hook provides
 * a way to handle them consistently across the application
 */
export function useAsyncError(options: UseAsyncErrorOptions = {}): UseAsyncErrorReturn {
  const { onError, context = 'AsyncOperation' } = options;
  const errorCountRef = useRef(0);

  const handleAsyncError = useCallback((error: Error) => {
    errorCountRef.current += 1;
    
    // Report to error service
    reportAsyncError(error, context);
    
    // Call custom error handler
    onError?.(error);
    
    // Log for debugging
    console.error(`[${context}] Async error #${errorCountRef.current}:`, error);
  }, [onError, context]);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    customOnError?: (error: Error) => void
  ): Promise<T | undefined> => {
    try {
      const result = await asyncFn();
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Use custom error handler if provided, otherwise use the hook's handler
      if (customOnError) {
        customOnError(errorObj);
      } else {
        handleAsyncError(errorObj);
      }
      
      return undefined;
    }
  }, [handleAsyncError]);

  return {
    handleAsyncError,
    executeAsync,
  };
}

/**
 * Hook for handling async operations with loading and error states
 * Integrates with React 19's concurrent features
 */
export function useAsyncOperation<T>() {
  const { executeAsync } = useAsyncError();
  
  const executeWithState = useCallback(async (
    asyncFn: () => Promise<T>,
    setLoading: (loading: boolean) => void,
    setError: (error: Error | null) => void,
    setData: (data: T | null) => void
  ): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
      setLoading(false);
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      setLoading(false);
      return undefined;
    }
  }, []);

  return { executeWithState };
}