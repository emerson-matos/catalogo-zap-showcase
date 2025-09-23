import { useState, useCallback } from 'react';
import { ProductImageMigration, type MigrationResult, type MigrationProgress } from '@/lib/productMigration';

export const useProductMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    migrated: number;
    needsMigration: number;
    googlePhotos: number;
    other: number;
  } | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const migrationStats = await ProductImageMigration.getMigrationStats();
      setStats(migrationStats);
      return migrationStats;
    } catch (error) {
      console.error('Failed to load migration stats:', error);
      throw error;
    }
  }, []);

  const migrateAllProducts = useCallback(async () => {
    setIsMigrating(true);
    setResults([]);
    setProgress(null);

    try {
      const migrationResults = await ProductImageMigration.migrateAllProducts(
        (progressUpdate) => {
          setProgress(progressUpdate);
        },
        (result) => {
          setResults(prev => [...prev, result]);
        }
      );

      // Reload stats after migration
      await loadStats();
      
      return migrationResults;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    } finally {
      setIsMigrating(false);
    }
  }, [loadStats]);

  const migrateProductById = useCallback(async (productId: string) => {
    try {
      const result = await ProductImageMigration.migrateProductById(productId);
      
      // Reload stats after migration
      await loadStats();
      
      return result;
    } catch (error) {
      console.error('Failed to migrate product:', error);
      throw error;
    }
  }, [loadStats]);

  const resetMigration = useCallback(() => {
    setResults([]);
    setProgress(null);
  }, []);

  return {
    // State
    isMigrating,
    progress,
    results,
    stats,
    
    // Actions
    loadStats,
    migrateAllProducts,
    migrateProductById,
    resetMigration,
  };
};
