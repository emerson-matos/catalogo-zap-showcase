import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // If we were offline, show a toast and refetch queries
      if (wasOffline) {
        toast.success('Conexão restaurada!', {
          description: 'Atualizando dados...',
          duration: 3000,
        });
        
        // Refetch all queries when coming back online
        queryClient.refetchQueries({
          type: 'active',
          stale: true,
        });
        
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      
      toast.error('Sem conexão com a internet', {
        description: 'Algumas funcionalidades podem estar limitadas.',
        duration: 5000,
      });
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, queryClient]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
  };
};