import { SupabaseService } from '@/lib/supabaseService';
import { supabase } from '@/lib/supabase';

interface MigrationResult {
  success: boolean;
  productId: string;
  productName: string;
  oldImageUrl: string;
  newImageUrl?: string;
  error?: string;
}

export class ImageMigrationService {
  private static readonly BUCKET_NAME = 'serenacosmeticoscatalogoimagem';

  /**
   * Migrates all products with Google Photos links to Supabase storage
   */
  static async migrateAllProducts(): Promise<MigrationResult[]> {
    console.log('Starting image migration...');
    
    // Get all products
    const products = await SupabaseService.getProducts();
    const results: MigrationResult[] = [];

    for (const product of products) {
      try {
        const result = await this.migrateProduct(product);
        results.push(result);
        
        if (result.success) {
          console.log(`✅ Migrated: ${product.name}`);
        } else {
          console.log(`❌ Failed: ${product.name} - ${result.error}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          success: false,
          productId: product.id,
          productName: product.name,
          oldImageUrl: product.image,
          error: errorMessage,
        });
        console.log(`❌ Error migrating ${product.name}: ${errorMessage}`);
      }
    }

    console.log(`Migration completed. ${results.filter(r => r.success).length}/${results.length} products migrated successfully.`);
    return results;
  }

  /**
   * Migrates a single product's image
   */
  static async migrateProduct(product: any): Promise<MigrationResult> {
    const { id, name, image } = product;

    // Check if it's a Google Photos link
    if (!this.isGooglePhotosUrl(image)) {
      return {
        success: true,
        productId: id,
        productName: name,
        oldImageUrl: image,
        newImageUrl: image, // Already migrated or not a Google Photos URL
      };
    }

    try {
      // Download the image from Google Photos
      const imageBlob = await this.downloadImage(image);
      
      // Create a file object
      const fileName = `${id}-${Date.now()}.jpg`;
      const file = new File([imageBlob], fileName, { type: 'image/jpeg' });

      // Upload to Supabase storage
      const newImageUrl = await SupabaseService.uploadImage(file, id);

      // Update the product with the new image URL
      await SupabaseService.updateProduct(id, { image: newImageUrl });

      return {
        success: true,
        productId: id,
        productName: name,
        oldImageUrl: image,
        newImageUrl,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        productId: id,
        productName: name,
        oldImageUrl: image,
        error: errorMessage,
      };
    }
  }

  /**
   * Checks if a URL is a Google Photos link
   */
  private static isGooglePhotosUrl(url: string): boolean {
    return url.includes('googleusercontent.com') || 
           url.includes('photos.google.com') ||
           url.includes('drive.google.com');
  }

  /**
   * Downloads an image from a URL and returns it as a Blob
   */
  private static async downloadImage(url: string): Promise<Blob> {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      if (!blob.type.startsWith('image/')) {
        throw new Error('Downloaded content is not an image');
      }

      return blob;
    } catch (error) {
      throw new Error(`Failed to download image from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets migration statistics
   */
  static async getMigrationStats(): Promise<{
    totalProducts: number;
    googlePhotosProducts: number;
    alreadyMigrated: number;
    needsMigration: number;
  }> {
    const products = await SupabaseService.getProducts();
    const googlePhotosProducts = products.filter(p => this.isGooglePhotosUrl(p.image));
    const alreadyMigrated = products.filter(p => !this.isGooglePhotosUrl(p.image));

    return {
      totalProducts: products.length,
      googlePhotosProducts: googlePhotosProducts.length,
      alreadyMigrated: alreadyMigrated.length,
      needsMigration: googlePhotosProducts.length,
    };
  }

  /**
   * Validates that the Supabase storage bucket exists and is accessible
   */
  static async validateStorageAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1 });

      if (error) {
        console.error('Storage access validation failed:', error);
        return false;
      }

      console.log('✅ Storage bucket is accessible');
      return true;
    } catch (error) {
      console.error('Storage access validation failed:', error);
      return false;
    }
  }
}

// Export a function to run the migration from the browser console
export const runImageMigration = async () => {
  console.log('🚀 Starting image migration process...');
  
  // Validate storage access first
  const hasAccess = await ImageMigrationService.validateStorageAccess();
  if (!hasAccess) {
    console.error('❌ Cannot access Supabase storage. Please check your configuration.');
    return;
  }

  // Get migration stats
  const stats = await ImageMigrationService.getMigrationStats();
  console.log('📊 Migration Statistics:', stats);

  if (stats.needsMigration === 0) {
    console.log('✅ No products need migration. All images are already using Supabase storage.');
    return;
  }

  // Confirm migration
  const confirmed = confirm(
    `Found ${stats.needsMigration} products that need migration. This will download images from Google Photos and upload them to Supabase storage. Continue?`
  );

  if (!confirmed) {
    console.log('❌ Migration cancelled by user');
    return;
  }

  // Run the migration
  const results = await ImageMigrationService.migrateAllProducts();
  
  // Log results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Migration completed: ${successful.length} successful, ${failed.length} failed`);
  
  if (failed.length > 0) {
    console.log('❌ Failed migrations:', failed);
  }
  
  return results;
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).runImageMigration = runImageMigration;
}