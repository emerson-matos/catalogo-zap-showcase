import { supabase } from './supabase';

// Storage configuration
export const STORAGE_CONFIG = {
  bucketName: 'serenacosmeticoscatalogoimagem',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

// Storage service for handling image uploads
export class StorageService {
  /**
   * Upload an image file to Supabase storage
   * @param file - The image file to upload
   * @param productId - The product ID to use as part of the filename
   * @returns Promise<string> - The public URL of the uploaded image
   */
  static async uploadProductImage(
    file: File,
    productId: string
  ): Promise<string> {
    // Validate file type
    if (!STORAGE_CONFIG.allowedTypes.includes(file.type as any)) {
      throw new Error(
        `Tipo de arquivo não suportado. Tipos permitidos: ${STORAGE_CONFIG.allowedTypes.join(', ')}`
      );
    }

    // Validate file size
    if (file.size > STORAGE_CONFIG.maxFileSize) {
      throw new Error(
        `Arquivo muito grande. Tamanho máximo: ${STORAGE_CONFIG.maxFileSize / (1024 * 1024)}MB`
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const fileName = `products/${productId}/${timestamp}.${fileExtension}`;

    try {
      // Upload file to Supabase storage
      const { error } = await supabase.storage
        .from(STORAGE_CONFIG.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false, // Don't overwrite existing files
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_CONFIG.bucketName)
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Supabase storage
   * @param imageUrl - The public URL of the image to delete
   * @returns Promise<void>
   */
  static async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      
      if (!pathMatch) {
        throw new Error('URL de imagem inválida');
      }

      const [, bucket, filePath] = pathMatch;
      
      if (bucket !== STORAGE_CONFIG.bucketName) {
        throw new Error('Bucket não corresponde ao esperado');
      }

      // Delete file from storage
      const { error } = await supabase.storage
        .from(STORAGE_CONFIG.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Storage delete error:', error);
        throw new Error(`Erro ao deletar imagem: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  /**
   * Check if a URL is from Supabase storage
   * @param url - The URL to check
   * @returns boolean
   */
  static isSupabaseStorageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('supabase') && urlObj.pathname.includes('/storage/');
    } catch {
      return false;
    }
  }

  /**
   * Get a signed URL for private access (if needed in the future)
   * @param filePath - The file path in storage
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   * @returns Promise<string> - The signed URL
   */
  static async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from(STORAGE_CONFIG.bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      throw new Error(`Erro ao gerar URL assinada: ${error.message}`);
    }

    return data.signedUrl;
  }
}

export default StorageService;