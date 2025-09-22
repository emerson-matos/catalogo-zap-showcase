import { supabase } from "../supabase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CategoryInsert {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
  created_by: string;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
  updated_at?: string;
}

/**
 * Migration script to move categories from text column to dedicated table
 * This should be run after the SQL migration has been executed
 */
export class CategoriesMigration {
  /**
   * Run the complete migration process
   */
  static async migrate(): Promise<void> {
    try {
      console.log("🚀 Starting categories migration...");

      // Step 1: Verify user is authenticated
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error("User must be authenticated to run migration");
      }

      // Step 2: Extract unique categories from products
      const uniqueCategories = await this.extractUniqueCategories();
      console.log(`📊 Found ${uniqueCategories.length} unique categories`);

      // Step 3: Create category records
      const createdCategories = await this.createCategoryRecords(uniqueCategories, user.id);
      console.log(`✅ Created ${createdCategories.length} category records`);

      // Step 4: Update products to reference categories
      const updatedProducts = await this.updateProductsWithCategoryIds(createdCategories);
      console.log(`🔄 Updated ${updatedProducts} products with category references`);

      // Step 5: Verify migration
      await this.verifyMigration();

      console.log("🎉 Categories migration completed successfully!");
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }

  /**
   * Extract unique categories from products table
   */
  private static async extractUniqueCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null)
      .neq("category", "");

    if (error) {
      throw new Error(`Failed to extract categories: ${error.message}`);
    }

    const categories = Array.from(
      new Set(data?.map(item => item.category).filter(Boolean))
    ).sort();

    return categories;
  }

  /**
   * Create category records in the categories table
   */
  private static async createCategoryRecords(
    categoryNames: string[],
    userId: string
  ): Promise<Category[]> {
    const categoriesToCreate: CategoryInsert[] = categoryNames.map(name => ({
      name,
      description: `Categoria: ${name}`,
      is_active: true,
      sort_order: 0,
      created_by: userId,
    }));

    const { data, error } = await supabase
      .from("categories")
      .insert(categoriesToCreate)
      .select();

    if (error) {
      throw new Error(`Failed to create categories: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Update products to reference the new category table
   */
  private static async updateProductsWithCategoryIds(
    categories: Category[]
  ): Promise<number> {
    let updatedCount = 0;

    for (const category of categories) {
      const { error, count } = await supabase
        .from("products")
        .update({ category_id: category.id })
        .eq("category", category.name)
        .not("category", "is", null);

      if (error) {
        console.warn(`Failed to update products for category ${category.name}:`, error);
        continue;
      }

      updatedCount += count || 0;
    }

    return updatedCount;
  }

  /**
   * Verify the migration was successful
   */
  private static async verifyMigration(): Promise<void> {
    // Check that all products have category_id
    const { data: productsWithoutCategory, error: productsError } = await supabase
      .from("products")
      .select("id, name, category")
      .is("category_id", null)
      .not("category", "is", null);

    if (productsError) {
      throw new Error(`Failed to verify products: ${productsError.message}`);
    }

    if (productsWithoutCategory && productsWithoutCategory.length > 0) {
      console.warn(`⚠️ ${productsWithoutCategory.length} products still missing category_id:`, 
        productsWithoutCategory.map(p => p.name));
    }

    // Check that categories table has data
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name")
      .limit(1);

    if (categoriesError) {
      throw new Error(`Failed to verify categories: ${categoriesError.message}`);
    }

    if (!categories || categories.length === 0) {
      throw new Error("Categories table is empty after migration");
    }

    console.log("✅ Migration verification completed");
  }

  /**
   * Get current authenticated user
   */
  private static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }

    return user;
  }

  /**
   * Rollback the migration (for testing purposes)
   */
  static async rollback(): Promise<void> {
    try {
      console.log("🔄 Rolling back categories migration...");

      // Remove category_id column from products
      await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE products DROP COLUMN IF EXISTS category_id;'
      });

      // Drop categories table
      await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS categories CASCADE;'
      });

      console.log("✅ Rollback completed");
    } catch (error) {
      console.error("❌ Rollback failed:", error);
      throw error;
    }
  }
}

/**
 * Utility function to run migration from browser console
 * Usage: window.migrateCategories()
 */
export function setupCategoriesMigrationHelper() {
  if (typeof window !== "undefined") {
    (window as Record<string, unknown>).migrateCategories = CategoriesMigration.migrate;
    (window as Record<string, unknown>).rollbackCategoriesMigration = CategoriesMigration.rollback;
    console.log("Categories migration helpers available:");
    console.log("- window.migrateCategories()");
    console.log("- window.rollbackCategoriesMigration()");
  }
}