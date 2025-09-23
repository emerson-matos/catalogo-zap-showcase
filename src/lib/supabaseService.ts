import {
  supabase,
  type Product,
  type ProductInsert,
  type ProductUpdate,
  type Category,
  type CategoryInsert,
  type CategoryUpdate,
} from "./supabase";

export { supabase };

export class SupabaseService {
  // Storage configuration
  private static readonly BUCKET_NAME = 'serenacosmeticoscatalogoimagem';

  // Storage methods
  static async uploadImage(file: File, productId?: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = productId ? `${productId}/${fileName}` : fileName;

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

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === this.BUCKET_NAME);
    
    if (bucketIndex === -1) {
      throw new Error('URL da imagem inválida');
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Erro ao deletar imagem: ${error.message}`);
    }
  }

  static async getImageUrl(imagePath: string): Promise<string> {
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(imagePath);

    return publicUrl;
  }

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

  static async updateProduct(
    id: string,
    updates: ProductUpdate,
    oldImageUrl?: string,
  ): Promise<Product> {
    // If updating image and old image exists, delete the old image
    if (updates.image && oldImageUrl && updates.image !== oldImageUrl) {
      try {
        await this.deleteImage(oldImageUrl);
      } catch (error) {
        console.warn('Failed to delete old image:', error);
        // Continue with update even if image deletion fails
      }
    }

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

  static async deleteProduct(id: string, imageUrl?: string): Promise<void> {
    // Delete the product image if it exists
    if (imageUrl) {
      try {
        await this.deleteImage(imageUrl);
      } catch (error) {
        console.warn('Failed to delete product image:', error);
        // Continue with product deletion even if image deletion fails
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
