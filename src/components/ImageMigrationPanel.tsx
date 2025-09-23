import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database,
  Download,
  Loader2
} from 'lucide-react';
import { ImageMigrationService, type MigrationResult } from '@/lib/imageMigration';
import { toast } from 'sonner';

interface MigrationStats {
  totalProducts: number;
  googlePhotosProducts: number;
  alreadyMigrated: number;
  needsMigration: number;
}

export function ImageMigrationPanel() {
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);
  const [hasStorageAccess, setHasStorageAccess] = useState<boolean | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const migrationStats = await ImageMigrationService.getMigrationStats();
      setStats(migrationStats);
    } catch (error) {
      console.error('Failed to load migration stats:', error);
      toast.error('Erro ao carregar estatísticas de migração');
    } finally {
      setIsLoading(false);
    }
  };

  const validateStorage = async () => {
    try {
      const hasAccess = await ImageMigrationService.validateStorageAccess();
      setHasStorageAccess(hasAccess);
      if (!hasAccess) {
        toast.error('Não foi possível acessar o bucket do Supabase Storage');
      }
    } catch (error) {
      setHasStorageAccess(false);
      toast.error('Erro ao validar acesso ao storage');
    }
  };

  const runMigration = async () => {
    if (!stats || stats.needsMigration === 0) {
      toast.info('Nenhum produto precisa de migração');
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationResults([]);

    try {
      const results: MigrationResult[] = [];
      const products = await ImageMigrationService.migrateAllProducts();
      
      // Simulate progress updates
      for (let i = 0; i < products.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI
        setMigrationProgress((i + 1) / products.length * 100);
        results.push(products[i]);
        setMigrationResults([...results]);
      }

      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      toast.success(`Migração concluída: ${successful.length} sucessos, ${failed.length} falhas`);
      
      // Reload stats after migration
      await loadStats();
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Erro durante a migração');
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    loadStats();
    validateStorage();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando estatísticas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Migração de Imagens para Supabase Storage
          </CardTitle>
          <CardDescription>
            Migre imagens do Google Photos para o Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Storage Access Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status do Storage:</span>
            {hasStorageAccess === null ? (
              <Badge variant="secondary">Verificando...</Badge>
            ) : hasStorageAccess ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Acessível
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Inacessível
              </Badge>
            )}
          </div>

          {/* Migration Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <div className="text-sm text-muted-foreground">Total de Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.googlePhotosProducts}</div>
                <div className="text-sm text-muted-foreground">Google Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.alreadyMigrated}</div>
                <div className="text-sm text-muted-foreground">Já Migrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.needsMigration}</div>
                <div className="text-sm text-muted-foreground">Precisam Migrar</div>
              </div>
            </div>
          )}

          {/* Migration Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={loadStats} 
              variant="outline" 
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Atualizar Estatísticas
            </Button>
            
            <Button 
              onClick={runMigration} 
              disabled={!hasStorageAccess || !stats || stats.needsMigration === 0 || isMigrating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Migrando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Iniciar Migração
                </>
              )}
            </Button>
          </div>

          {/* Migration Progress */}
          {isMigrating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Migração</span>
                <span>{Math.round(migrationProgress)}%</span>
              </div>
              <Progress value={migrationProgress} className="w-full" />
            </div>
          )}

          {/* Migration Results */}
          {migrationResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Resultados da Migração:</h4>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {migrationResults.map((result, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded border text-sm"
                  >
                    <span className="truncate">{result.productName}</span>
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {stats && stats.needsMigration > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> A migração irá baixar {stats.needsMigration} imagens do Google Photos 
                e fazer upload para o Supabase Storage. Este processo pode demorar alguns minutos.
              </AlertDescription>
            </Alert>
          )}

          {stats && stats.needsMigration === 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Sucesso:</strong> Todos os produtos já estão usando o Supabase Storage. 
                Nenhuma migração é necessária.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}