import { SupabaseService } from './supabaseService';
import { StorageService } from './storage';

/**
 * Migration script to move existing Google Photos images to Supabase storage
 * This script will:
 * 1. Fetch all products with Google Photos URLs
 * 2. Download images from Google Photos
 * 3. Upload them to Supabase storage
 * 4. Update product records with new Supabase URLs
 */

interface MigrationResult {
  success: number;
  failed: number;
  errors: Array<{
    productId: string;
    productName: string;
    error: string;
  }>;
}

export class ImageMigrationService {
  /**
   * Check if a URL is a Google Photos URL
   */
  static isGooglePhotosUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('googleusercontent.com') || 
             urlObj.hostname.includes('photos.google.com') ||
             urlObj.hostname.includes('drive.google.com');
    } catch {
      return false;
    }
  }

  /**
   * Download image from URL and convert to File object
   */
  static async downloadImageAsFile(url: string, filename: string): Promise<File> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error(`Failed to download image from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Migrate a single product's image
   */
  static async migrateProductImage(productId: string, productName: string, imageUrl: string): Promise<void> {
    try {
      console.log(`Migrating image for product: ${productName} (${productId})`);
      
      // Download the image
      const fileExtension = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const filename = `${productName.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
      const imageFile = await this.downloadImageAsFile(imageUrl, filename);
      
      // Upload to Supabase storage
      const newImageUrl = await StorageService.uploadProductImage(imageFile, productId);
      
      // Update product record
      await SupabaseService.updateProduct(productId, { image: newImageUrl });
      
      console.log(`✅ Successfully migrated image for product: ${productName}`);
    } catch (error) {
      console.error(`❌ Failed to migrate image for product ${productName}:`, error);
      throw error;
    }
  }

  /**
   * Migrate all products with Google Photos URLs
   */
  static async migrateAllProducts(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    try {
      console.log('🚀 Starting image migration...');
      
      // Fetch all products
      const products = await SupabaseService.getProducts();
      console.log(`📦 Found ${products.length} products to check`);

      // Filter products with Google Photos URLs
      const productsToMigrate = products.filter(product => 
        product.image && this.isGooglePhotosUrl(product.image)
      );
      
      console.log(`🔄 Found ${productsToMigrate.length} products with Google Photos images to migrate`);

      if (productsToMigrate.length === 0) {
        console.log('✅ No products need migration');
        return result;
      }

      // Migrate each product
      for (const product of productsToMigrate) {
        try {
          await this.migrateProductImage(product.id, product.name, product.image);
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push({
            productId: product.id,
            productName: product.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`🎉 Migration completed!`);
      console.log(`✅ Successfully migrated: ${result.success} products`);
      console.log(`❌ Failed to migrate: ${result.failed} products`);
      
      if (result.errors.length > 0) {
        console.log('\n❌ Errors encountered:');
        result.errors.forEach(error => {
          console.log(`  - ${error.productName} (${error.productId}): ${error.error}`);
        });
      }

      return result;
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }

  /**
   * Preview what would be migrated (dry run)
   */
  static async previewMigration(): Promise<Array<{id: string, name: string, imageUrl: string}>> {
    try {
      const products = await SupabaseService.getProducts();
      return products
        .filter(product => product.image && this.isGooglePhotosUrl(product.image))
        .map(product => ({
          id: product.id,
          name: product.name,
          imageUrl: product.image
        }));
    } catch (error) {
      console.error('Error previewing migration:', error);
      throw error;
    }
  }

  /**
   * Rollback migration by reverting to original URLs
   * Note: This requires storing original URLs before migration
   */
  static async rollbackMigration(originalUrls: Record<string, string>): Promise<void> {
    console.log('🔄 Starting rollback...');
    
    for (const [productId, originalUrl] of Object.entries(originalUrls)) {
      try {
        await SupabaseService.updateProduct(productId, { image: originalUrl });
        console.log(`✅ Rolled back product: ${productId}`);
      } catch (error) {
        console.error(`❌ Failed to rollback product ${productId}:`, error);
      }
    }
    
    console.log('🎉 Rollback completed!');
  }
}

// Export for use in admin panel or CLI
export default ImageMigrationService;