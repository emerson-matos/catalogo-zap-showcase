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
  // Products
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
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

  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
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
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null);

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    const categories = Array.from(
      new Set(data?.map((item) => item.category).filter(Boolean)),
    ).sort();

    return ["Todos", ...categories];
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

  // Future: Categories (commented out until categories table is created)
  /*
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

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

  static async createCategories(categories: CategoryInsert[]): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .insert(categories)
      .select();

    if (error) {
      console.error("Error creating categories:", error);
      throw new Error(`Erro ao criar categorias: ${error.message}`);
    }

    return data || [];
  }
  */
}
