import { supabase } from './supabase';
import { APP_CONFIG } from './config';

export class StorageService {
  private static readonly BUCKET_NAME = APP_CONFIG.storage.bucketName;

  /**
   * Upload an image file to Supabase Storage
   * @param file - The image file to upload
   * @param productId - Optional product ID for organizing files
   * @returns Promise<string> - The public URL of the uploaded image
   */
  static async uploadImage(file: File, productId?: string): Promise<string> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = productId ? `products/${productId}/${fileName}` : `products/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Supabase Storage
   * @param imageUrl - The public URL of the image to delete
   * @returns Promise<void>
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folder = pathParts[pathParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        throw new Error(`Erro ao deletar imagem: ${error.message}`);
      }
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }

  /**
   * Get all images for a specific product
   * @param productId - The product ID
   * @returns Promise<string[]> - Array of image URLs
   */
  static async getProductImages(productId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`products/${productId}`, {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('Error listing product images:', error);
        throw new Error(`Erro ao listar imagens do produto: ${error.message}`);
      }

      return data.map(file => {
        const { data: urlData } = supabase.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(`products/${productId}/${file.name}`);
        return urlData.publicUrl;
      });
    } catch (error) {
      console.error('Storage list error:', error);
      throw error;
    }
  }

  /**
   * Check if the storage bucket exists and is accessible
   * @returns Promise<boolean>
   */
  static async checkBucketAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1 });

      return !error;
    } catch (error) {
      console.error('Bucket access check failed:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   * @returns Promise<{ used: number; available: number }>
   */
  static async getStorageInfo(): Promise<{ used: number; available: number }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1000 });

      if (error) {
        throw new Error(`Erro ao obter informações de armazenamento: ${error.message}`);
      }

      // Calculate total size (this is a simplified calculation)
      const totalSize = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
      
      return {
        used: totalSize,
        available: 1000000000 - totalSize // Assuming 1GB limit
      };
    } catch (error) {
      console.error('Storage info error:', error);
      throw error;
    }
  }
}