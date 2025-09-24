import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo?: Record<string, unknown>;
  isRetrying: boolean;
}

export const useErrorRecovery = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    isRetrying: false,
  });

  const queryClient = useQueryClient();

  const handleError = useCallback((error: Error, errorInfo?: Record<string, unknown>) => {
    console.error('Error caught by error recovery:', error, errorInfo);
    
    setErrorState({
      hasError: true,
      error,
      errorInfo,
      isRetrying: false,
    });

    // Show appropriate error message
    const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
    const isAuthError = error.message.includes('401') || error.message.includes('403');
    
    if (isNetworkError) {
      toast.error('Erro de conexão', {
        description: 'Verifique sua internet e tente novamente.',
        action: {
          label: 'Tentar Novamente',
          onClick: () => retry(),
        },
        duration: 10000,
      });
    } else if (isAuthError) {
      toast.error('Erro de autenticação', {
        description: 'Faça login novamente para continuar.',
        duration: 8000,
      });
    } else {
      toast.error('Algo deu errado', {
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        action: {
          label: 'Tentar Novamente',
          onClick: () => retry(),
        },
        duration: 8000,
      });
    }
  }, []); // handleError doesn't depend on retry to avoid circular dependency

  const retry = useCallback(async () => {
    setErrorState(prev => ({ ...prev, isRetrying: true }));

    try {
      // Clear all errors and refetch active queries
      await queryClient.resetQueries({
        type: 'active',
      });
      
      // Clear error state
      setErrorState({
        hasError: false,
        error: null,
        isRetrying: false,
      });

      toast.success('Problema resolvido!', {
        description: 'Dados atualizados com sucesso.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Retry failed:', error);
      
      setErrorState(prev => ({ 
        ...prev, 
        isRetrying: false,
        error: error instanceof Error ? error : new Error('Retry failed'),
      }));

      toast.error('Não foi possível resolver o problema', {
        description: 'Tente recarregar a página.',
        action: {
          label: 'Recarregar',
          onClick: () => window.location.reload(),
        },
        duration: 10000,
      });
    }
  }, [queryClient]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      isRetrying: false,
    });
  }, []);

  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    ...errorState,
    handleError,
    retry,
    clearError,
    reloadPage,
  };
};