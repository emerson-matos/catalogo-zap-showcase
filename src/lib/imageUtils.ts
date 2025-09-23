import { APP_CONFIG } from './config';

/**
 * Check if a file is a valid image type
 * @param file - The file to check
 * @returns boolean indicating if the file is a valid image
 */
export function isValidImageType(file: File): boolean {
  return APP_CONFIG.storage.allowedTypes.includes(file.type);
}

/**
 * Check if a file size is within limits
 * @param file - The file to check
 * @returns boolean indicating if the file size is valid
 */
export function isValidImageSize(file: File): boolean {
  return file.size <= APP_CONFIG.storage.maxFileSize;
}

/**
 * Format file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 * @param filename - The filename
 * @returns File extension without the dot
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Generate a unique filename for upload
 * @param originalFilename - The original filename
 * @param prefix - Optional prefix for the filename
 * @returns Unique filename
 */
export function generateUniqueFilename(originalFilename: string, prefix?: string): string {
  const extension = getFileExtension(originalFilename);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const baseName = prefix ? `${prefix}-${timestamp}-${randomString}` : `${timestamp}-${randomString}`;
  
  return `${baseName}.${extension}`;
}

/**
 * Check if an image URL is from Supabase Storage
 * @param imageUrl - The image URL to check
 * @returns boolean indicating if the URL is from Supabase Storage
 */
export function isSupabaseImageUrl(imageUrl: string): boolean {
  return imageUrl.includes('supabase') || imageUrl.includes('storage');
}

/**
 * Get optimized image URL for different sizes
 * @param imageUrl - The original image URL
 * @param size - The desired size ('thumbnail', 'medium', 'large')
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(imageUrl: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
  if (!imageUrl) return '/placeholder.svg';
  
  // If it's a Supabase Storage URL, we can add query parameters for optimization
  if (isSupabaseImageUrl(imageUrl)) {
    const sizeMap = {
      thumbnail: 'w=150&h=150&fit=cover',
      medium: 'w=400&h=400&fit=cover',
      large: 'w=800&h=800&fit=cover'
    };
    
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}${sizeMap[size]}`;
  }
  
  return imageUrl;
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Object with validation result and error message
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!isValidImageType(file)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não suportado. Tipos permitidos: ${APP_CONFIG.storage.allowedTypes.join(', ')}`
    };
  }
  
  if (!isValidImageSize(file)) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${formatFileSize(APP_CONFIG.storage.maxFileSize)}`
    };
  }
  
  return { isValid: true };
}