import {
  supabase,
  type Product,
  type ProductInsert,
  type ProductUpdate,
  type Category,
  type CategoryInsert,
  type CategoryUpdate,
} from "./supabase";
import { ImageUploadService } from "./imageUpload";

export { supabase };

export class SupabaseService {
  // Products
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(`*`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    return data || [];
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    return data;
  }

  static async createProduct(product: ProductInsert): Promise<Product> {
    // Ensure images are provided for new products
    if (!product.images || product.images.length === 0) {
      throw new Error(
        "Pelo menos uma imagem é obrigatória para novos produtos",
      );
    }

    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }

    return data;
  }

  static async createProductWithImages(
    productData: Omit<ProductInsert, "images">,
    imageFiles: File[],
  ): Promise<Product> {
    try {
      // Upload images first
      const uploadResult =
        await ImageUploadService.uploadMultipleImages(imageFiles);

      // Create product with the uploaded image URLs
      const product: ProductInsert = {
        ...productData,
        images: uploadResult.urls,
      };

      return await this.createProduct(product);
    } catch (error) {
      console.error("Error creating product with images:", error);
      throw error;
    }
  }

  static async updateProduct(
    id: string,
    updates: ProductUpdate,
  ): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }

    return data;
  }

  static async updateProductWithImages(
    id: string,
    updates: Omit<ProductUpdate, "images">,
    imageFiles?: File[],
    imagesToRemove?: string[],
  ): Promise<Product> {
    try {
      const finalUpdates: ProductUpdate = { ...updates };

      // Get current product to access existing images
      const currentProduct = await this.getProductById(id);
      if (!currentProduct) {
        throw new Error("Produto não encontrado");
      }

      let finalImages = [...(currentProduct.images || [])];

      // Remove specified images from storage and from the images array
      if (imagesToRemove && imagesToRemove.length > 0) {
        for (const imageUrl of imagesToRemove) {
          if (ImageUploadService.isSupabaseImageUrl(imageUrl)) {
            try {
              const imagePath = ImageUploadService.extractStoragePath(imageUrl);
              if (imagePath) {
                await ImageUploadService.deleteImage(imagePath);
              }
            } catch (error) {
              console.warn("Failed to delete image from storage:", error);
              // Continue even if storage deletion fails
            }
          }
          // Remove from images array
          finalImages = finalImages.filter(img => img !== imageUrl);
        }
      }

      // If new images are provided, upload them and add to the array
      if (imageFiles && imageFiles.length > 0) {
        const uploadResult =
          await ImageUploadService.uploadMultipleImages(imageFiles);
        finalImages = [...finalImages, ...uploadResult.urls];
      }

      // Update the product with the final images array
      finalUpdates.images = finalImages;

      return await this.updateProduct(id, finalUpdates);
    } catch (error) {
      console.error("Error updating product with images:", error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    // First get the product to delete its images
    const product = await this.getProductById(id);

    if (product?.images && product.images.length > 0) {
      // Delete all images from Supabase Storage
      for (const imageUrl of product.images) {
        if (ImageUploadService.isSupabaseImageUrl(imageUrl)) {
          try {
            const imagePath = ImageUploadService.extractStoragePath(imageUrl);
            if (imagePath) {
              await ImageUploadService.deleteImage(imagePath);
            }
          } catch (error) {
            console.warn("Failed to delete product image:", error);
            // Continue with product deletion even if image deletion fails
          }
        }
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug,
          color
        )
      `,
      )
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      throw new Error(
        `Erro ao buscar produtos por categoria: ${error.message}`,
      );
    }

    return data || [];
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching products:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    return data || [];
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      throw new Error(`Erro ao buscar categorias: ${error.message}`);
    }

    return data || [];
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return data;
  }

  static async createCategory(category: CategoryInsert): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      throw new Error(`Erro ao criar categoria: ${error.message}`);
    }

    return data;
  }

  static async updateCategory(
    id: string,
    updates: CategoryUpdate,
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      throw new Error(`Erro ao atualizar categoria: ${error.message}`);
    }

    return data;
  }

  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      throw new Error(`Erro ao deletar categoria: ${error.message}`);
    }
  }

  // Auth helpers
  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    return user;
  }
}
