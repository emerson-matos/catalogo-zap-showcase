import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from './LoadingSpinner';
import type { LoadingState } from '@/types/api';

interface LoadingStateProps extends LoadingState {
  readonly children: React.ReactNode;
  readonly loadingComponent?: React.ReactNode;
  readonly errorComponent?: React.ReactNode;
  readonly skeletonCount?: number;
}

export const LoadingStateComponent = React.memo(({
  isLoading,
  isError,
  error,
  children,
  loadingComponent,
  errorComponent,
  skeletonCount = 3,
}: LoadingStateProps) => {
  if (isError) {
    return (
      <>
        {errorComponent || (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Erro ao carregar
              </h3>
              <p className="text-muted-foreground mb-4">
                {error?.message || 'Ocorreu um erro inesperado'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-primary hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {loadingComponent || (
          <div className="space-y-4">
            <LoadingSpinner text="Carregando..." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: skeletonCount }, (_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
});

LoadingStateComponent.displayName = 'LoadingStateComponent';