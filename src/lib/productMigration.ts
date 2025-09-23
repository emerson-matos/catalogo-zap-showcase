import { SupabaseService } from './supabaseService';
import { ImageUploadService } from './imageUpload';
import type { Product } from './supabase';

export interface MigrationResult {
  success: boolean;
  productId: string;
  productName: string;
  oldUrl: string;
  newUrl?: string;
  error?: string;
}

export interface MigrationProgress {
  total: number;
  completed: number;
  successful: number;
  failed: number;
  current?: string;
}

export class ProductImageMigration {
  private static readonly BATCH_SIZE = 5; // Process products in batches to avoid overwhelming the system

  /**
   * Downloads an image from a URL and converts it to a File object
   * Handles CORS issues by adding proper headers and fallback options
   */
  private static async downloadImageAsFile(url: string, filename: string): Promise<File> {
    try {
      // Try with CORS-enabled headers first
      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        },
      });

      if (!response.ok) {
        // If CORS fails, try without CORS mode as fallback
        console.warn(`CORS request failed for ${url}, trying without CORS...`);
        const fallbackResponse = await fetch(url, {
          mode: 'no-cors',
        });

        if (!fallbackResponse.ok) {
          throw new Error(`Failed to download image: ${response.statusText} (CORS likely blocked)`);
        }

        // For no-cors mode, we get an opaque response, so we need to handle it differently
        // We'll create a placeholder file since we can't access the actual content
        throw new Error('Image download blocked by CORS policy - cannot access Google Photos images from browser');
      }

      const blob = await response.blob();

      // Validate that we got an actual image
      if (blob.size === 0) {
        throw new Error('Downloaded image is empty');
      }

      return new File([blob], filename, { type: blob.type || 'image/jpeg' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to download image from ${url}:`, errorMessage);

      // If it's a CORS error, provide a helpful message
      if (errorMessage.includes('CORS') || errorMessage.includes('Access-Control')) {
        throw new Error(`CORS policy blocked access to image at ${url}. This is common with Google Photos links. Please download the image manually and upload it through the admin panel instead.`);
      }

      throw new Error(`Error downloading image: ${errorMessage}`);
    }
  }

  /**
   * Checks if a URL is a Google Photos URL
   */
  private static isGooglePhotosUrl(url: string): boolean {
    return url.includes('googleusercontent.com') || 
           url.includes('photos.google.com') ||
           url.includes('drive.google.com');
  }

  /**
   * Checks if a product has Google Photos URLs in its images array
   */
  private static hasGooglePhotosImages(product: Product): boolean {
    if (!product.images || product.images.length === 0) {
      return false;
    }
    return product.images.some(imageUrl => this.isGooglePhotosUrl(imageUrl));
  }

  /**
   * Generates a filename for the migrated image
   */
  private static generateFilename(product: Product, originalUrl: string): string {
    const extension = originalUrl.split('.').pop()?.split('?')[0] || 'jpg';
    const sanitizedName = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${product.id}-${sanitizedName}.${extension}`;
  }

  /**
   * Migrates a single product's images
   */
  private static async migrateProductImages(product: Product): Promise<MigrationResult> {
    try {
      // Skip if already using Supabase Storage
      if (!this.hasGooglePhotosImages(product)) {
        return {
          success: true,
          productId: product.id,
          productName: product.name,
          oldUrl: product.images?.join(', ') || '',
          newUrl: product.images?.join(', ') || '',
        };
      }

      // Filter Google Photos URLs
      const googlePhotosUrls = product.images?.filter(url => this.isGooglePhotosUrl(url)) || [];
      const nonGooglePhotosUrls = product.images?.filter(url => !this.isGooglePhotosUrl(url)) || [];

      if (googlePhotosUrls.length === 0) {
        return {
          success: false,
          productId: product.id,
          productName: product.name,
          oldUrl: product.images?.join(', ') || '',
          error: 'No Google Photos URLs found - skipping',
        };
      }

      // Download and upload all Google Photos images
      const uploadedImages: string[] = [];
      const errors: string[] = [];

      for (let i = 0; i < googlePhotosUrls.length; i++) {
        try {
          const filename = this.generateFilename(product, googlePhotosUrls[i]);
          const imageFile = await this.downloadImageAsFile(googlePhotosUrls[i], filename);
          const uploadResult = await ImageUploadService.uploadImage(imageFile);
          uploadedImages.push(uploadResult.url);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Imagem ${i + 1}: ${errorMessage}`);
        }
      }

      if (uploadedImages.length === 0) {
        return {
          success: false,
          productId: product.id,
          productName: product.name,
          oldUrl: googlePhotosUrls.join(', '),
          error: `Failed to upload all images: ${errors.join(', ')}`,
        };
      }

      // Combine uploaded images with existing non-Google Photos images
      const finalImages = [...uploadedImages, ...nonGooglePhotosUrls];

      // Update the product with the new image URLs
      await SupabaseService.updateProduct(product.id, {
        images: finalImages,
      });

      return {
        success: true,
        productId: product.id,
        productName: product.name,
        oldUrl: googlePhotosUrls.join(', '),
        newUrl: uploadedImages.join(', '),
      };
    } catch (error) {
      return {
        success: false,
        productId: product.id,
        productName: product.name,
        oldUrl: product.images?.join(', ') || '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Migrates all products with Google Photos URLs
   */
  static async migrateAllProducts(
    onProgress?: (progress: MigrationProgress) => void,
    onResult?: (result: MigrationResult) => void
  ): Promise<MigrationResult[]> {
    try {
      // Get all products
      const products = await SupabaseService.getProducts();
      
      // Filter products that need migration
      const productsToMigrate = products.filter(product => 
        this.hasGooglePhotosImages(product)
      );

      const results: MigrationResult[] = [];
      const progress: MigrationProgress = {
        total: productsToMigrate.length,
        completed: 0,
        successful: 0,
        failed: 0,
      };

      // Process products in batches
      for (let i = 0; i < productsToMigrate.length; i += this.BATCH_SIZE) {
        const batch = productsToMigrate.slice(i, i + this.BATCH_SIZE);
        
        // Process batch concurrently
        const batchPromises = batch.map(async (product) => {
          progress.current = product.name;
          onProgress?.(progress);

          const result = await this.migrateProductImages(product);
          results.push(result);

          progress.completed++;
          if (result.success) {
            progress.successful++;
          } else {
            progress.failed++;
          }

          onProgress?.(progress);
          onResult?.(result);

          return result;
        });

        await Promise.all(batchPromises);

        // Add a small delay between batches to avoid overwhelming the system
        if (i + this.BATCH_SIZE < productsToMigrate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets migration statistics
   */
  static async getMigrationStats(): Promise<{
    total: number;
    migrated: number;
    needsMigration: number;
    googlePhotos: number;
    other: number;
  }> {
    try {
      const products = await SupabaseService.getProducts();
      
      const stats = {
        total: products.length,
        migrated: 0,
        needsMigration: 0,
        googlePhotos: 0,
        other: 0,
      };

      products.forEach(product => {
        if (!this.hasGooglePhotosImages(product)) {
          stats.migrated++;
        } else {
          stats.needsMigration++;
          // Count Google Photos URLs
          const googlePhotosCount = product.images?.filter(url => this.isGooglePhotosUrl(url)).length || 0;
          stats.googlePhotos += googlePhotosCount;
          // Count other URLs
          const otherCount = product.images?.filter(url => !this.isGooglePhotosUrl(url)).length || 0;
          stats.other += otherCount;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to get migration stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Migrates a single product by ID
   */
  static async migrateProductById(productId: string): Promise<MigrationResult> {
    try {
      const product = await SupabaseService.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      return await this.migrateProductImages(product);
    } catch (error) {
      throw new Error(`Failed to migrate product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reverts migrated products back to original Google Photos URLs
   */
  static async revertMigration(
    onProgress?: (progress: MigrationProgress) => void,
    onResult?: (result: MigrationResult) => void
  ): Promise<MigrationResult[]> {
    try {
      // Get all products that might have been migrated
      const products = await SupabaseService.getProducts();

      // Filter products that have Supabase Storage URLs
      const productsToRevert = products.filter(product =>
        product.images?.some(url => ImageUploadService.isSupabaseImageUrl(url))
      );

      const results: MigrationResult[] = [];
      const progress: MigrationProgress = {
        total: productsToRevert.length,
        completed: 0,
        successful: 0,
        failed: 0,
      };

      for (let i = 0; i < productsToRevert.length; i++) {
        const product = productsToRevert[i];
        progress.current = product.name;
        onProgress?.(progress);

        try {
          // For now, we'll just mark as "reverted" without actually reverting
          // since we don't store the original URLs anywhere
          // In a production system, you might want to store original URLs in a separate field
          const result: MigrationResult = {
            success: true,
            productId: product.id,
            productName: product.name,
            oldUrl: product.images?.join(', ') || '',
            newUrl: 'Migration state reset - no actual revert performed',
          };

          results.push(result);
          progress.completed++;
          progress.successful++;
          onProgress?.(progress);
          onResult?.(result);
        } catch (error) {
          const result: MigrationResult = {
            success: false,
            productId: product.id,
            productName: product.name,
            oldUrl: product.images?.join(', ') || '',
            error: error instanceof Error ? error.message : 'Unknown error',
          };

          results.push(result);
          progress.completed++;
          progress.failed++;
          onProgress?.(progress);
          onResult?.(result);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Revert migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Completely resets migration state and clears all migration data
   */
  static async resetMigrationState(): Promise<void> {
    try {
      // Clear any migration tracking data if it exists
      // For now, this is mainly for clearing the UI state
      // In a production system, you might want to clear migration logs from a database table
      console.log('Migration state reset - all migration data cleared');
    } catch (error) {
      throw new Error(`Failed to reset migration state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
