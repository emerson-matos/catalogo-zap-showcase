import { supabase } from "./supabase";

export interface ImageUploadResult {
  url: string;
  path: string;
}

export interface ImageUploadError {
  message: string;
  code?: string;
}

export interface MultipleImageUploadResult {
  images: ImageUploadResult[];
  urls: string[];
  paths: string[];
}

export class ImageUploadService {
  private static readonly BUCKET_NAME = "serenacosmeticoscatalogoimagem";
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  /**
   * Validates if the file is a valid image
   */
  private static validateFile(file: File): {
    isValid: boolean;
    error?: string;
  } {
    if (!file) {
      return { isValid: false, error: "Nenhum arquivo selecionado" };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: "Arquivo muito grande. Tamanho máximo: 5MB",
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: "Tipo de arquivo não suportado. Use JPG, PNG ou WebP",
      };
    }

    return { isValid: true };
  }

  /**
   * Generates a unique file path for the image
   */
  private static generateFilePath(file: File): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "jpg";
    return `products/${timestamp}-${randomId}.${extension}`;
  }

  /**
   * Uploads an image file to Supabase Storage
   */
  static async uploadImage(file: File): Promise<ImageUploadResult> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      // Generate unique file path
      const filePath = this.generateFilePath(file);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error("Erro ao obter URL pública da imagem");
      }

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error("Image upload error:", error);
      throw error instanceof Error
        ? error
        : new Error("Erro desconhecido ao fazer upload da imagem");
    }
  }

  /**
   * Uploads multiple image files to Supabase Storage
   */
  static async uploadMultipleImages(
    files: File[],
  ): Promise<MultipleImageUploadResult> {
    if (files.length === 0) {
      throw new Error("Nenhum arquivo selecionado");
    }

    if (files.length > 10) {
      throw new Error("Máximo de 10 imagens por produto");
    }

    const results: ImageUploadResult[] = [];
    const errors: string[] = [];

    // Process files sequentially to avoid overwhelming the system
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadImage(files[i]);
        results.push(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        errors.push(`Imagem ${i + 1}: ${errorMessage}`);
      }
    }

    if (results.length === 0) {
      throw new Error(
        `Falha ao fazer upload de todas as imagens: ${errors.join(", ")}`,
      );
    }

    if (errors.length > 0) {
      console.warn("Algumas imagens falharam no upload:", errors);
    }

    return {
      images: results,
      urls: results.map((r) => r.url),
      paths: results.map((r) => r.path),
    };
  }

  /**
   * Deletes an image from Supabase Storage
   */
  static async deleteImage(imagePath: string): Promise<void> {
    try {
      // Extract path from URL if it's a full URL
      const path = imagePath.includes("/storage/v1/object/public/")
        ? imagePath
            .split("/storage/v1/object/public/")[1]
            ?.split("/")
            .slice(1)
            .join("/")
        : imagePath;

      if (!path) {
        throw new Error("Caminho da imagem inválido");
      }

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);

      if (error) {
        console.error("Error deleting file:", error);
        throw new Error(`Erro ao deletar imagem: ${error.message}`);
      }
    } catch (error) {
      console.error("Image deletion error:", error);
      throw error instanceof Error
        ? error
        : new Error("Erro desconhecido ao deletar imagem");
    }
  }

  /**
   * Checks if an image URL is from Supabase Storage
   */
  static isSupabaseImageUrl(url: string): boolean {
    return (
      url.includes("supabase") && url.includes("/storage/v1/object/public/")
    );
  }

  /**
   * Extracts the storage path from a Supabase Storage URL
   */
  static extractStoragePath(url: string): string | null {
    if (!this.isSupabaseImageUrl(url)) {
      return null;
    }

    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    return match ? match[1] : null;
  }
}
