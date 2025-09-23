import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Eye,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageMigrationService } from '@/lib/migration';

interface MigrationPreview {
  id: string;
  name: string;
  imageUrl: string;
}

interface MigrationResult {
  success: number;
  failed: number;
  errors: Array<{
    productId: string;
    productName: string;
    error: string;
  }>;
}

export function ImageMigrationPanel() {
  const [preview, setPreview] = useState<MigrationPreview[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [progress, setProgress] = useState(0);

  const loadPreview = async () => {
    setIsLoadingPreview(true);
    try {
      const previewData = await ImageMigrationService.previewMigration();
      setPreview(previewData);
      toast.success(`Found ${previewData.length} products to migrate`);
    } catch (error) {
      toast.error('Failed to load migration preview');
      console.error('Preview error:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const runMigration = async () => {
    setIsMigrating(true);
    setProgress(0);
    setMigrationResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await ImageMigrationService.migrateAllProducts();
      
      clearInterval(progressInterval);
      setProgress(100);
      setMigrationResult(result);
      
      if (result.failed === 0) {
        toast.success(`Successfully migrated ${result.success} products!`);
      } else {
        toast.warning(`Migration completed with ${result.failed} errors`);
      }
    } catch (error) {
      toast.error('Migration failed');
      console.error('Migration error:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const resetMigration = () => {
    setPreview([]);
    setMigrationResult(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Image Migration Tool
          </CardTitle>
          <CardDescription>
            Migrate product images from Google Photos to Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This tool will migrate all product images from Google Photos URLs to Supabase Storage. 
              Make sure you have backed up your data before proceeding.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button 
              onClick={loadPreview} 
              disabled={isLoadingPreview || isMigrating}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isLoadingPreview ? 'Loading...' : 'Preview Migration'}
            </Button>

            {preview.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={isMigrating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Start Migration
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Migration</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to migrate {preview.length} product images? 
                      This action cannot be undone and will replace all Google Photos URLs with Supabase Storage URLs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={runMigration}>
                      Start Migration
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button 
              onClick={resetMigration} 
              disabled={isMigrating}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {isMigrating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Migration Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Migration Preview
            </CardTitle>
            <CardDescription>
              {preview.length} products will be migrated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {preview.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Google Photos</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {migrationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Migration Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Success: {migrationResult.success}</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>Failed: {migrationResult.failed}</span>
              </div>
            </div>

            {migrationResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {migrationResult.errors.map((error, index) => (
                    <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                      <strong>{error.productName}</strong> ({error.productId}): {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}