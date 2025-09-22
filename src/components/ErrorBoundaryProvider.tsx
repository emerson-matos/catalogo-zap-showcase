import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useErrorHandler } from './ErrorBoundary';

interface ErrorBoundaryContextType {
  readonly reportError: (error: Error, context?: string) => void;
  readonly clearError: () => void;
  readonly resetBoundary: () => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | null>(null);

interface ErrorBoundaryProviderProps {
  readonly children: React.ReactNode;
  readonly onError?: (error: Error, errorInfo: { componentStack: string }) => void;
  readonly onReset?: () => void;
  readonly level?: 'page' | 'component' | 'critical';
}

export function ErrorBoundaryProvider({ 
  children, 
  onError, 
  onReset,
  level = 'page'
}: ErrorBoundaryProviderProps) {
  const resetBoundary = useErrorHandler();

  const reportError = useCallback((error: Error, context?: string) => {
    // This would integrate with your error reporting service
    console.error(`[${context || 'Unknown'}] Error reported:`, error);
    
    // In production, you might want to send this to Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // reportToService(error, { context });
    }
  }, []);

  const clearError = useCallback(() => {
    // Clear any global error state if needed
    console.log('Error cleared');
  }, []);

  const contextValue = useMemo(() => ({
    reportError,
    clearError,
    resetBoundary,
  }), [reportError, clearError, resetBoundary]);

  return (
    <ErrorBoundaryContext.Provider value={contextValue}>
      <ErrorBoundary 
        level={level}
        onError={onError} 
        onReset={onReset}
      >
        {children}
      </ErrorBoundary>
    </ErrorBoundaryContext.Provider>
  );
}

export function useErrorReporting() {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorReporting must be used within an ErrorBoundaryProvider');
  }
  return context;
}

// Utility function for reporting async errors
export function reportAsyncError(error: Error, context?: string) {
  console.error(`[${context || 'Async'}] Error:`, error);
  
  // In production, send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    // reportToService(error, { context, type: 'async' });
  }
}