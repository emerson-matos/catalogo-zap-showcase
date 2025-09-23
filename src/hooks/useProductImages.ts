import { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storageService';

interface UseProductImagesReturn {
  images: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to manage product images from Supabase Storage
 * @param productId - The product ID to fetch images for
 * @returns Object with images array, loading state, error, and refetch function
 */
export function useProductImages(productId: string): UseProductImagesReturn {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const productImages = await StorageService.getProductImages(productId);
      setImages(productImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imagens');
      console.error('Error fetching product images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [productId]);

  return {
    images,
    isLoading,
    error,
    refetch: fetchImages,
  };
}

/**
 * Hook to check if an image URL is from Supabase Storage
 * @param imageUrl - The image URL to check
 * @returns boolean indicating if the URL is from Supabase Storage
 */
export function useIsSupabaseImage(imageUrl: string): boolean {
  return imageUrl.includes('supabase') || imageUrl.includes('storage');
}

/**
 * Hook to get optimized image URL for different sizes
 * @param imageUrl - The original image URL
 * @param size - The desired size ('thumbnail', 'medium', 'large')
 * @returns Optimized image URL
 */
export function useOptimizedImageUrl(imageUrl: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
  if (!imageUrl) return '/placeholder.svg';
  
  // If it's a Supabase Storage URL, we can add query parameters for optimization
  if (imageUrl.includes('supabase')) {
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