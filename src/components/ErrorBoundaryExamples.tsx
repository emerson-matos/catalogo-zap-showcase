import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { withErrorBoundary } from './ErrorBoundary';
import { useThrowError } from '@/hooks/useAsyncError';

// Example: Component-level error boundary
export function ComponentErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary level="component">
      {children}
    </ErrorBoundary>
  );
}

// Example: Page-level error boundary
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      level="page"
      resetKeys={[window.location.pathname]} // Reset when route changes
    >
      {children}
    </ErrorBoundary>
  );
}

// Example: Critical error boundary for important components
export function CriticalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      level="critical"
      fallback={({ resetErrorBoundary }) => (
        <div className="min-h-screen flex items-center justify-center bg-destructive/5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Erro Crítico
            </h1>
            <p className="text-muted-foreground mb-4">
              A aplicação encontrou um erro crítico. Por favor, recarregue a página.
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Tentar Novamente
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Example: Using HOC for automatic error boundary wrapping
export const SafeComponent = withErrorBoundary(
  function MyComponent() {
    // This component is automatically wrapped with an error boundary
    return <div>This component is protected by an error boundary</div>;
  },
  { level: 'component' }
);

// Example: Error boundary with custom error reporting
export function CustomErrorBoundary({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    // Custom error reporting logic
    console.error('Custom error handler:', error, errorInfo);
    
    // Send to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as { gtag: (event: string, action: string, params: Record<string, unknown>) => void }).gtag;
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  };

  const handleReset = () => {
    // Custom reset logic
    console.log('Custom reset handler called');
  };

  return (
    <ErrorBoundary 
      onError={handleError}
      onReset={handleReset}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  );
}

// Example: Component that can throw errors programmatically
export function ErrorThrowingComponent() {
  const { throwError } = useThrowError();

  const handleThrowError = () => {
    throwError(new Error('This is a programmatically thrown error'));
  };

  return (
    <div>
      <button onClick={handleThrowError}>
        Throw Error (will be caught by error boundary)
      </button>
    </div>
  );
}

// Example: Component with async error handling
export function AsyncErrorComponent() {
  const { executeAsync } = useAsyncError({ context: 'AsyncComponent' });

  const handleAsyncOperation = async () => {
    await executeAsync(
      async () => {
        // Simulate async operation that might fail
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      },
      (data) => {
        console.log('Success:', data);
      },
      (error) => {
        console.error('Async error handled:', error);
      }
    );
  };

  return (
    <div>
      <button onClick={handleAsyncOperation}>
        Perform Async Operation
      </button>
    </div>
  );
}

// Example: Error boundary for async operations
export function AsyncErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      level="component"
      onError={(error, _errorInfo) => {
        // Handle async errors that bubble up
        if (error.message.includes('fetch') || error.message.includes('async')) {
          console.error('Async error caught by boundary:', error);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}