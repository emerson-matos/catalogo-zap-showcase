import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { SupabaseService } from "@/lib/supabaseService";
import { migrateProductImages, getMigrationReport, type MigrationOptions } from "@/utils/migrateImages";
import { toast } from "sonner";
import { Download, CheckCircle, XCircle, AlertTriangle, Play, Pause, RotateCcw } from "lucide-react";
import type { Product } from "@/lib/supabase";

interface MigrationState {
  status: 'idle' | 'analyzing' | 'migrating' | 'completed' | 'error' | 'paused';
  report?: {
    total: number;
    googlePhotos: number;
    validGooglePhotos: number;
    invalidUrls: number;
  };
  migrationResults?: {
    migrated: number;
    errors: number;
    skipped: number;
    results: Array<{ product: Product; success: boolean; error?: string }>;
  };
  progress: {
    current: number;
    total: number;
  };
  error?: string;
}

export function ImageMigration() {
  const [state, setState] = useState<MigrationState>({
    status: 'idle',
    progress: { current: 0, total: 0 },
  });

  const [dryRun, setDryRun] = useState(true);
  const [batchSize, setBatchSize] = useState(5);

  const analyzeImages = async () => {
    setState(prev => ({ ...prev, status: 'analyzing', error: undefined }));

    try {
      const products = await SupabaseService.getProducts();
      const report = await getMigrationReport(products);

      setState(prev => ({
        ...prev,
        status: 'idle',
        report,
      }));

      toast.success("Análise concluída!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
      toast.error(`Erro na análise: ${errorMessage}`);
    }
  };

  const startMigration = async () => {
    if (!state.report) {
      toast.error("Execute a análise primeiro");
      return;
    }

    setState(prev => ({
      ...prev,
      status: 'migrating',
      error: undefined,
      progress: { current: 0, total: state.report.googlePhotos },
    }));

    try {
      const products = await SupabaseService.getProducts();

      const options: MigrationOptions = {
        dryRun,
        batchSize,
        onProgress: (current, total, productName) => {
          setState(prev => ({
            ...prev,
            progress: { current, total },
          }));
        },
        onError: (error, productName) => {
          console.error(`Erro migrando ${productName}:`, error);
          toast.error(`Erro migrando ${productName}: ${error.message}`);
        },
      };

      const results = await migrateProductImages(products, options);

      setState(prev => ({
        ...prev,
        status: 'completed',
        migrationResults: results,
      }));

      toast.success("Migração concluída!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
      toast.error(`Erro na migração: ${errorMessage}`);
    }
  };

  const resetMigration = () => {
    setState({
      status: 'idle',
      progress: { current: 0, total: 0 },
    });
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'analyzing':
      case 'migrating':
        return <Download className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    const baseClasses = "flex items-center gap-2";

    switch (state.status) {
      case 'analyzing':
        return <Badge className={baseClasses} variant="secondary">Analisando</Badge>;
      case 'migrating':
        return <Badge className={baseClasses} variant="default">Migrando</Badge>;
      case 'completed':
        return <Badge className={baseClasses} variant="default">Concluído</Badge>;
      case 'error':
        return <Badge className={baseClasses} variant="destructive">Erro</Badge>;
      default:
        return <Badge className={baseClasses} variant="outline">Inativo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Migração de Imagens
          </CardTitle>
          <CardDescription>
            Migre imagens de produtos do Google Photos para o Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                disabled={state.status === 'migrating'}
              />
              <span className="text-sm">Teste (não faz alterações)</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm">Lote:</label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                min={1}
                max={10}
                disabled={state.status === 'migrating'}
                className="w-16 px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>

          {getStatusBadge()}

          {state.status === 'migrating' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso: {state.progress.current} / {state.progress.total}</span>
                <span>{Math.round((state.progress.current / state.progress.total) * 100)}%</span>
              </div>
              <Progress
                value={(state.progress.current / state.progress.total) * 100}
                className="w-full"
              />
            </div>
          )}

          {state.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.report && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{state.report.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{state.report.googlePhotos}</div>
                <div className="text-sm text-muted-foreground">Google Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{state.report.validGooglePhotos}</div>
                <div className="text-sm text-muted-foreground">URLs Válidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{state.report.invalidUrls}</div>
                <div className="text-sm text-muted-foreground">URLs Inválidas</div>
              </div>
            </div>
          )}

          {state.migrationResults && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{state.migrationResults.migrated}</div>
                <div className="text-sm text-muted-foreground">Migrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{state.migrationResults.errors}</div>
                <div className="text-sm text-muted-foreground">Erros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{state.migrationResults.skipped}</div>
                <div className="text-sm text-muted-foreground">Ignorados</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={analyzeImages}
              disabled={state.status === 'analyzing' || state.status === 'migrating'}
              variant="outline"
            >
              Analisar Imagens
            </Button>

            <Button
              onClick={startMigration}
              disabled={state.status === 'migrating' || !state.report}
              variant={dryRun ? "outline" : "default"}
            >
              {state.status === 'migrating' ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {dryRun ? 'Executar Teste' : 'Iniciar Migração'}
                </>
              )}
            </Button>

            <Button
              onClick={resetMigration}
              disabled={state.status === 'migrating'}
              variant="ghost"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </div>
        </CardContent>
      </Card>

      {state.migrationResults && state.migrationResults.results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Detalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.migrationResults.results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    result.success ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <span className="text-sm font-medium">{result.product.name}</span>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600">{result.error}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}