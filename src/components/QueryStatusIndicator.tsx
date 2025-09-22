import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface QueryStatusIndicatorProps {
  showInProduction?: boolean;
  className?: string;
}

export const QueryStatusIndicator: React.FC<QueryStatusIndicatorProps> = ({
  showInProduction = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { isOnline, wasOffline } = useOnlineStatus();

  // Don't show in production unless explicitly requested
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  const queryCache = queryClient.getQueryCache();
  const mutationCache = queryClient.getMutationCache();
  
  const queries = queryCache.getAll();
  const mutations = mutationCache.getAll();
  
  const queryStats = {
    total: queries.length,
    loading: queries.filter(q => q.state.status === 'pending').length,
    success: queries.filter(q => q.state.status === 'success').length,
    error: queries.filter(q => q.state.status === 'error').length,
    stale: queries.filter(q => q.isStale()).length,
    fetching: queries.filter(q => q.state.isFetching).length,
  };

  const mutationStats = {
    total: mutations.length,
    pending: mutations.filter(m => m.state.status === 'pending').length,
    success: mutations.filter(m => m.state.status === 'success').length,
    error: mutations.filter(m => m.state.status === 'error').length,
  };

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (queryStats.error > 0 || mutationStats.error > 0) return 'destructive';
    if (queryStats.loading > 0 || queryStats.fetching > 0 || mutationStats.pending > 0) {
      return 'default';
    }
    return 'success';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (queryStats.error > 0 || mutationStats.error > 0) {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (queryStats.loading > 0 || queryStats.fetching > 0 || mutationStats.pending > 0) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (queryStats.error > 0 || mutationStats.error > 0) return 'Erros';
    if (queryStats.loading > 0 || queryStats.fetching > 0 || mutationStats.pending > 0) {
      return 'Carregando';
    }
    return 'OK';
  };

  const handleClearCache = () => {
    queryClient.clear();
  };

  const handleRefreshAll = () => {
    queryClient.refetchQueries({ type: 'active' });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shadow-lg bg-background/95 backdrop-blur"
          >
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <Card className="w-80 shadow-xl bg-background/95 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4" />
                Status das Consultas
                {wasOffline && (
                  <Badge variant="outline" className="ml-auto">
                    <Wifi className="w-3 h-3 mr-1" />
                    Reconectado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Network Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Conexão:</span>
                <Badge variant={isOnline ? 'success' : 'destructive'}>
                  {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              {/* Query Stats */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Consultas ({queryStats.total})</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Carregando:</span>
                    <Badge variant={queryStats.loading > 0 ? 'default' : 'secondary'}>
                      {queryStats.loading}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sucesso:</span>
                    <Badge variant="success">{queryStats.success}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Erros:</span>
                    <Badge variant={queryStats.error > 0 ? 'destructive' : 'secondary'}>
                      {queryStats.error}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Desatualizadas:</span>
                    <Badge variant={queryStats.stale > 0 ? 'outline' : 'secondary'}>
                      {queryStats.stale}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Mutation Stats */}
              {mutationStats.total > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Mutações ({mutationStats.total})</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Pendentes:</span>
                      <Badge variant={mutationStats.pending > 0 ? 'default' : 'secondary'}>
                        {mutationStats.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Erros:</span>
                      <Badge variant={mutationStats.error > 0 ? 'destructive' : 'secondary'}>
                        {mutationStats.error}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshAll}
                  className="flex-1"
                  disabled={!isOnline}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Atualizar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  className="flex-1"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Limpar Cache
                </Button>
              </div>
              
              {/* Recent Errors */}
              {(queryStats.error > 0 || mutationStats.error > 0) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-destructive">Erros Recentes:</h4>
                  <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                    {queries
                      .filter(q => q.state.error)
                      .slice(0, 3)
                      .map((query, index) => (
                        <div key={index} className="p-2 bg-destructive/10 rounded text-destructive">
                          <div className="font-mono text-xs truncate">
                            {JSON.stringify(query.queryKey)}
                          </div>
                          <div className="truncate">
                            {query.state.error?.message || 'Erro desconhecido'}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};