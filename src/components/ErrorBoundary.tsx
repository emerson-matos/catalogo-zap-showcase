import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Bug, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void;
  readonly onReset?: () => void;
  readonly resetKeys?: readonly unknown[];
  readonly resetOnPropsChange?: boolean;
  readonly level?: 'page' | 'component' | 'critical';
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
  readonly errorInfo: ErrorInfo | null;
  readonly errorId: string;
  readonly retryCount: number;
}

interface ErrorReport {
  readonly error: Error;
  readonly errorInfo: ErrorInfo;
  readonly errorId: string;
  readonly timestamp: string;
  readonly userAgent: string;
  readonly url: string;
  readonly retryCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    const { errorId, retryCount } = this.state;

    // Log error for debugging
    console.error(`[${level.toUpperCase()}] ErrorBoundary caught an error:`, {
      error,
      errorInfo,
      errorId,
      retryCount,
    });
    
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service
    this.reportError({
      error,
      errorInfo,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount,
    });

    // Call custom error handler if provided
    onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys !== resetKeys) {
      this.resetErrorBoundary();
    }

    // Reset error boundary when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private reportError = (errorReport: ErrorReport) => {
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, or custom service
      // reportErrorToService(errorReport);
      
      // For now, just log to console in production
      console.error('Error Report:', errorReport);
    }
  };

  private resetErrorBoundary = () => {
    const { onReset } = this.props;
    
    // Call custom reset handler
    onReset?.();
    
    // Reset state
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    });
  };

  private handleRetry = () => {
    // Increment retry count
    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1,
    }));

    // Reset after a short delay to allow state to update
    this.resetTimeoutId = setTimeout(() => {
      this.resetErrorBoundary();
    }, 100);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorLevelIcon = () => {
    const { level = 'component' } = this.props;
    
    switch (level) {
      case 'critical':
        return <Bug className="h-5 w-5" />;
      case 'page':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  private getErrorLevelTitle = () => {
    const { level = 'component' } = this.props;
    
    switch (level) {
      case 'critical':
        return 'Erro Crítico';
      case 'page':
        return 'Erro na Página';
      default:
        return 'Algo deu errado';
    }
  };

  private getErrorLevelMessage = () => {
    const { level = 'component' } = this.props;
    
    switch (level) {
      case 'critical':
        return 'Ocorreu um erro crítico que afeta o funcionamento da aplicação.';
      case 'page':
        return 'Ocorreu um erro ao carregar esta página.';
      default:
        return 'Ocorreu um erro inesperado neste componente.';
    }
  };

  render() {
    const { children, fallback, level = 'component' } = this.props;
    const { hasError, error, errorInfo, retryCount } = this.state;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      const isCritical = level === 'critical';

      return (
        <div className={`flex items-center justify-center p-8 ${isCritical ? 'min-h-screen' : 'min-h-[400px]'}`}>
          <div className="max-w-md w-full">
            <Alert className={`border-destructive ${isCritical ? 'bg-destructive/20' : 'bg-destructive/10'}`}>
              {this.getErrorLevelIcon()}
              <AlertTitle className="flex items-center gap-2">
                {this.getErrorLevelTitle()}
                {retryCount > 0 && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    Tentativa {retryCount + 1}
                  </span>
                )}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  {this.getErrorLevelMessage()}
                </p>
                
                {isDevelopment && error && (
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
                      {errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 text-xs bg-muted p-2 rounded whitespace-pre-wrap">
                            {errorInfo.componentStack}
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
                onClick={this.handleRetry} 
                className="flex-1"
                variant="outline"
                aria-label="Tentar novamente"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              
              {isCritical && (
                <Button 
                  onClick={this.handleReload} 
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

    return children;
  }
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

// Hook for accessing error boundary context (if needed)
export function useErrorBoundary() {
  // This is a placeholder for future React versions that might add this hook
  // Currently, error boundaries must be class components
  throw new Error('useErrorBoundary hook is not available in React 19. Use class-based ErrorBoundary instead.');
}