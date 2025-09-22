import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Bug, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps extends FallbackProps {
  readonly level?: 'page' | 'component' | 'critical';
}

function ErrorFallback({ 
  error, 
  resetErrorBoundary, 
  level = 'component' 
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isCritical = level === 'critical';

  const getErrorLevelIcon = () => {
    switch (level) {
      case 'critical':
        return <Bug className="h-5 w-5" />;
      case 'page':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getErrorLevelTitle = () => {
    switch (level) {
      case 'critical':
        return 'Erro Crítico';
      case 'page':
        return 'Erro na Página';
      default:
        return 'Algo deu errado';
    }
  };

  const getErrorLevelMessage = () => {
    switch (level) {
      case 'critical':
        return 'Ocorreu um erro crítico que afeta o funcionamento da aplicação.';
      case 'page':
        return 'Ocorreu um erro ao carregar esta página.';
      default:
        return 'Ocorreu um erro inesperado neste componente.';
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={`flex items-center justify-center p-8 ${isCritical ? 'min-h-screen' : 'min-h-[400px]'}`}>
      <div className="max-w-md w-full">
        <Alert className={`border-destructive ${isCritical ? 'bg-destructive/20' : 'bg-destructive/10'}`}>
          {getErrorLevelIcon()}
          <AlertTitle>{getErrorLevelTitle()}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              {getErrorLevelMessage()}
            </p>
            
            {isDevelopment && (
              <details className="mt-4 p-4 bg-card rounded text-sm text-muted-foreground">
                <summary className="cursor-pointer font-medium mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong>Mensagem:</strong>
                    <pre className="mt-1 text-xs bg-muted p-2 rounded">
                      {error.message}
                    </pre>
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 text-xs bg-muted p-2 rounded whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={resetErrorBoundary} 
            className="flex-1"
            variant="outline"
            aria-label="Tentar novamente"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          
          {isCritical && (
            <Button 
              onClick={handleReload} 
              className="flex-1"
              variant="default"
              aria-label="Recarregar página"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ComponentType<FallbackProps>;
  readonly onError?: (error: Error, errorInfo: { componentStack: string }) => void;
  readonly onReset?: () => void;
  readonly resetKeys?: readonly unknown[];
  readonly resetOnPropsChange?: boolean;
  readonly level?: 'page' | 'component' | 'critical';
}

export function ErrorBoundary({
  children,
  fallback,
  onError,
  onReset,
  resetKeys,
  resetOnPropsChange = false,
  level = 'component',
}: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    // Log error for debugging
    console.error(`[${level.toUpperCase()}] ErrorBoundary caught an error:`, {
      error,
      errorInfo,
      level,
    });

    // Report error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportToService(error, errorInfo, level);
      console.error('Error Report:', { error, errorInfo, level });
    }

    // Call custom error handler
    onError?.(error, errorInfo);
  };

  const handleReset = () => {
    // Call custom reset handler
    onReset?.();
    
    // Log reset for debugging
    console.log(`[${level.toUpperCase()}] ErrorBoundary reset`);
  };

  // Use custom fallback or default
  const FallbackComponent = fallback || ((props: FallbackProps) => 
    <ErrorFallback {...props} level={level} />
  );

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={handleReset}
      resetKeys={resetKeys}
      resetOnPropsChange={resetOnPropsChange}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for accessing error boundary context
export function useErrorHandler() {
  const { resetBoundary } = ReactErrorBoundary.useErrorBoundary();
  return resetBoundary;
}