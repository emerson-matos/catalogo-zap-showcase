import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { useProductMigration } from '@/hooks/useProductMigration';

export function ProductMigrationPanel() {
  const {
    isMigrating,
    progress,
    results,
    stats,
    loadStats,
    migrateAllProducts,
    resetMigration,
  } = useProductMigration();

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadStats().catch(console.error);
  }, [loadStats]);

  const handleStartMigration = async () => {
    try {
      await migrateAllProducts();
      toast.success('Migração concluída!');
      setShowResults(true);
    } catch (err) {
      toast.error(`Erro na migração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const handleRefreshStats = async () => {
    try {
      await loadStats();
      toast.success('Estatísticas atualizadas');
    } catch (err) {
      toast.error('Erro ao carregar estatísticas');
    }
  };

  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Migração de Imagens de Produtos
          </CardTitle>
          <CardDescription>
            Migre imagens existentes do Google Photos para o Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.migrated}</div>
                <div className="text-sm text-muted-foreground">Migrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.needsMigration}</div>
                <div className="text-sm text-muted-foreground">Precisam Migrar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.googlePhotos}</div>
                <div className="text-sm text-muted-foreground">Google Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.other}</div>
                <div className="text-sm text-muted-foreground">Outros</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleStartMigration}
              disabled={isMigrating || !stats?.needsMigration}
              className="flex-1"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Iniciar Migração
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleRefreshStats}
              disabled={isMigrating}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Migração</span>
                <span>{progress.completed}/{progress.total}</span>
              </div>
              <Progress value={(progress.completed / progress.total) * 100} />
              {progress.current && (
                <p className="text-sm text-muted-foreground">
                  Processando: {progress.current}
                </p>
              )}
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">
                  ✓ {progress.successful} sucessos
                </span>
                <span className="text-red-600">
                  ✗ {progress.failed} falhas
                </span>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resultados da Migração</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResults(!showResults)}
                  >
                    {showResults ? 'Ocultar' : 'Mostrar'} Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetMigration}
                  >
                    Limpar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>{successfulResults.length}</strong> produtos migrados com sucesso
                  </AlertDescription>
                </Alert>
                {failedResults.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>{failedResults.length}</strong> produtos falharam na migração
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Detailed Results */}
              {showResults && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <div key={result.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.productName}</p>
                        {result.error && (
                          <p className="text-sm text-red-600">{result.error}</p>
                        )}
                      </div>
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? 'Sucesso' : 'Falha'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Warning */}
          {stats?.needsMigration === 0 && !isMigrating && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Todos os produtos já foram migrados para o Supabase Storage!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
