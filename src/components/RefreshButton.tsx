import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useInvalidateProducts } from '@/hooks/useProductsQuery';
import { toast } from 'sonner';

interface RefreshButtonProps {
  isFetching?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  isFetching = false,
  variant = 'outline',
  size = 'sm',
  showText = false,
}) => {
  const { refetchProducts } = useInvalidateProducts();

  const handleRefresh = async () => {
    try {
      await refetchProducts();
      toast.success('Produtos atualizados com sucesso!');
    } catch {
      toast.error('Erro ao atualizar produtos');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isFetching}
      className="gap-2"
    >
      <RefreshCw 
        className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} 
      />
      {showText && (isFetching ? 'Atualizando...' : 'Atualizar')}
    </Button>
  );
};