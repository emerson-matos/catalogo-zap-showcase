import {
  supabase,
  type Product,
  type ProductInsert,
  type ProductUpdate,
  type Category,
  type CategoryInsert,
  type CategoryUpdate,
} from "./supabase";
import { StorageService } from "./storage";

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

  static async createProductWithImage(
    productData: Omit<ProductInsert, 'image'>,
    imageFile: File
  ): Promise<Product> {
    try {
      // First create the product to get the ID
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert({ ...productData, image: 'temp' }) // Temporary image URL
        .select()
        .single();

      if (productError) {
        console.error("Error creating product:", productError);
        throw new Error(`Erro ao criar produto: ${productError.message}`);
      }

      // Upload image to storage
      const imageUrl = await StorageService.uploadProductImage(imageFile, product.id);

      // Update product with the actual image URL
      const { data: updatedProduct, error: updateError } = await supabase
        .from("products")
        .update({ image: imageUrl })
        .eq("id", product.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating product with image:", updateError);
        // Try to clean up the uploaded image
        try {
          await StorageService.deleteProductImage(imageUrl);
        } catch (cleanupError) {
          console.error("Error cleaning up uploaded image:", cleanupError);
        }
        throw new Error(`Erro ao atualizar produto com imagem: ${updateError.message}`);
      }

      return updatedProduct;
    } catch (error) {
      console.error("Error creating product with image:", error);
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

  static async updateProductWithImage(
    id: string,
    updates: Omit<ProductUpdate, 'image'>,
    imageFile: File
  ): Promise<Product> {
    try {
      // Get current product to check if it has an existing image
      const { data: currentProduct, error: fetchError } = await supabase
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching current product:", fetchError);
        throw new Error(`Erro ao buscar produto atual: ${fetchError.message}`);
      }

      // Upload new image
      const imageUrl = await StorageService.uploadProductImage(imageFile, id);

      // Update product with new image URL
      const { data: updatedProduct, error: updateError } = await supabase
        .from("products")
        .update({ 
          ...updates, 
          image: imageUrl,
          updated_at: new Date().toISOString() 
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating product with image:", updateError);
        // Try to clean up the uploaded image
        try {
          await StorageService.deleteProductImage(imageUrl);
        } catch (cleanupError) {
          console.error("Error cleaning up uploaded image:", cleanupError);
        }
        throw new Error(`Erro ao atualizar produto com imagem: ${updateError.message}`);
      }

      // Delete old image if it's from Supabase storage
      if (currentProduct?.image && StorageService.isSupabaseStorageUrl(currentProduct.image)) {
        try {
          await StorageService.deleteProductImage(currentProduct.image);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
          // Don't throw here, as the main operation succeeded
        }
      }

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product with image:", error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      // Get product image before deleting
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching product for deletion:", fetchError);
        throw new Error(`Erro ao buscar produto para deletar: ${fetchError.message}`);
      }

      // Delete product from database
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Error deleting product:", error);
        throw new Error(`Erro ao deletar produto: ${error.message}`);
      }

      // Delete associated image if it's from Supabase storage
      if (product?.image && StorageService.isSupabaseStorageUrl(product.image)) {
        try {
          await StorageService.deleteProductImage(product.image);
        } catch (deleteError) {
          console.error("Error deleting product image:", deleteError);
          // Don't throw here, as the main operation succeeded
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
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
