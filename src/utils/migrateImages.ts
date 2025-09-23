import { SupabaseService } from "@/lib/supabaseService";
import type { Product } from "@/lib/supabase";

export interface MigrationOptions {
  dryRun?: boolean;
  batchSize?: number;
  onProgress?: (current: number, total: number, productName: string) => void;
  onError?: (error: Error, productName: string) => void;
}

export async function migrateProductImages(
  products: Product[],
  options: MigrationOptions = {}
): Promise<{
  migrated: number;
  errors: number;
  skipped: number;
  results: Array<{ product: Product; success: boolean; error?: string }>;
}> {
  const {
    dryRun = false,
    batchSize = 5,
    onProgress,
    onError,
  } = options;

  let migrated = 0;
  let errors = 0;
  let skipped = 0;
  const results: Array<{ product: Product; success: boolean; error?: string }> = [];

  console.log(`Starting migration of ${products.length} products ${dryRun ? '(DRY RUN)' : ''}`);

  // Filter products that have Google Photos URLs
  const productsToMigrate = products.filter(product =>
    product.image &&
    (product.image.includes('photos.google.com') ||
     product.image.includes('googleusercontent.com') ||
     product.image.includes('drive.google.com'))
  );

  console.log(`Found ${productsToMigrate.length} products with Google Photos URLs`);

  for (let i = 0; i < productsToMigrate.length; i += batchSize) {
    const batch = productsToMigrate.slice(i, i + batchSize);

    for (const product of batch) {
      try {
        if (dryRun) {
          console.log(`[DRY RUN] Would migrate: ${product.name}`);
          onProgress?.(i + 1, productsToMigrate.length, product.name);
          results.push({ product, success: true });
          migrated++;
          continue;
        }

        console.log(`Migrating image for: ${product.name}`);

        // Download image from Google Photos
        const response = await fetch(product.image, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ImageMigrationBot/1.0)',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const fileName = `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

        // Upload to Supabase storage
        const newImageUrl = await SupabaseService.uploadImage(file, fileName);

        // Update product with new image URL
        await SupabaseService.updateProduct(product.id, { image: newImageUrl });

        console.log(`✅ Successfully migrated: ${product.name}`);
        onProgress?.(i + 1, productsToMigrate.length, product.name);
        results.push({ product, success: true });
        migrated++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Failed to migrate ${product.name}: ${errorMessage}`);

        onError?.(error instanceof Error ? error : new Error(errorMessage), product.name);
        results.push({ product, success: false, error: errorMessage });
        errors++;
      }

      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Delay between batches
    if (i + batchSize < productsToMigrate.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`Migration completed: ${migrated} migrated, ${errors} errors, ${skipped} skipped`);

  return {
    migrated,
    errors,
    skipped,
    results,
  };
}

export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getMigrationReport(products: Product[]): Promise<{
  total: number;
  googlePhotos: number;
  validGooglePhotos: number;
  invalidUrls: number;
}> {
  const googlePhotos = products.filter(product =>
    product.image &&
    (product.image.includes('photos.google.com') ||
     product.image.includes('googleusercontent.com') ||
     product.image.includes('drive.google.com'))
  );

  let validGooglePhotos = 0;
  let invalidUrls = 0;

  for (const product of googlePhotos) {
    if (await validateImageUrl(product.image)) {
      validGooglePhotos++;
    } else {
      invalidUrls++;
    }
  }

  return {
    total: products.length,
    googlePhotos: googlePhotos.length,
    validGooglePhotos,
    invalidUrls,
  };
}