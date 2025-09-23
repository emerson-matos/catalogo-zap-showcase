import { useState } from 'react';
import { SupabaseService } from '@/lib/supabaseService';

export interface ImageUploadState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadedUrl: string | null;
}

export function useImageUpload() {
  const [state, setState] = useState<ImageUploadState>({
    isUploading: false,
    uploadProgress: 0,
    error: null,
    uploadedUrl: null,
  });

  const uploadImage = async (file: File, productId?: string): Promise<string> => {
    setState({
      isUploading: true,
      uploadProgress: 0,
      error: null,
      uploadedUrl: null,
    });

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são permitidos');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('O arquivo deve ter no máximo 10MB');
      }

      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90),
        }));
      }, 100);

      const uploadedUrl = await SupabaseService.uploadImage(file, productId);

      clearInterval(progressInterval);

      setState({
        isUploading: false,
        uploadProgress: 100,
        error: null,
        uploadedUrl,
      });

      return uploadedUrl;
    } catch (error) {
      setState({
        isUploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        uploadedUrl: null,
      });
      throw error;
    }
  };

  const resetState = () => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      error: null,
      uploadedUrl: null,
    });
  };

  return {
    ...state,
    uploadImage,
    resetState,
  };
}