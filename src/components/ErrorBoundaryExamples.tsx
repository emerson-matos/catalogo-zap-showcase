import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { withErrorBoundary } from './ErrorBoundary';

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
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-destructive/5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Erro Crítico
            </h1>
            <p className="text-muted-foreground mb-4">
              A aplicação encontrou um erro crítico. Por favor, recarregue a página.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      }
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
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
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