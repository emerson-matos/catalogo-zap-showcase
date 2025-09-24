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
    productData: Omit<ProductInsert, 'images'>,
    imageFiles: File[]
  ): Promise<Product> {
    try {
      // Upload images first
      const uploadedImages = await ImageUploadService.uploadImages(imageFiles);
      
      // Create product with uploaded images
      const product: ProductInsert = {
        ...productData,
        images: uploadedImages,
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
    updates: Omit<ProductUpdate, 'images'>,
    imageFiles?: File[],
    imagesToRemove?: string[]
  ): Promise<Product> {
    try {
      // Get current product to preserve existing images
      const currentProduct = await this.getProductById(id);
      if (!currentProduct) {
        throw new Error("Product not found");
      }

      let finalImages = [...(currentProduct.images || [])];

      // Remove specified images
      if (imagesToRemove && imagesToRemove.length > 0) {
        finalImages = finalImages.filter(img => !imagesToRemove.includes(img.url));
        
        // Delete removed images from storage
        for (const imageUrl of imagesToRemove) {
          try {
            await ImageUploadService.deleteImageByUrl(imageUrl);
          } catch (error) {
            console.warn("Failed to delete image from storage:", imageUrl, error);
          }
        }
      }

      // Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        const uploadedImages = await ImageUploadService.uploadImages(imageFiles);
        
        // Set the first new image as primary if there are no existing images
        if (finalImages.length === 0 && uploadedImages.length > 0) {
          uploadedImages[0].isPrimary = true;
        }
        
        finalImages = [...finalImages, ...uploadedImages];
      }

      // Ensure at least one image exists
      if (finalImages.length === 0) {
        throw new Error("Pelo menos uma imagem é obrigatória");
      }

      // Update product with new images
      const productUpdate: ProductUpdate = {
        ...updates,
        images: finalImages,
      };

      return await this.updateProduct(id, productUpdate);
    } catch (error) {
      console.error("Error updating product with images:", error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    // Get product to clean up images
    const product = await this.getProductById(id);
    
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }

    // Clean up images after successful deletion
    if (product?.images) {
      for (const image of product.images) {
        try {
          await ImageUploadService.deleteImageByUrl(image.url);
        } catch (error) {
          console.warn("Failed to delete image from storage:", image.url, error);
        }
      }
    }
  }

  // Enhanced pagination method (from our improvements)
  static async getProductsPaginated(options: {
    offset?: number;
    limit?: number;
    category?: string;
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<Product[]> {
    const {
      offset = 0,
      limit = 20,
      category,
      categoryId,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let query = supabase
      .from("products")
      .select("*");

    // Apply filters - support both category name and ID for backward compatibility
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    } else if (category && category !== 'Todos') {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching paginated products:", error);
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }

    return data || [];
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      throw new Error(
        `Erro ao buscar produtos por categoria: ${error.message}`,
      );
    }

    return data || [];
  }

  // New method for category ID (from main branch)
  static async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
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

  // Categories (enhanced from main branch)
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