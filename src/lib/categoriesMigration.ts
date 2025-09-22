/**
 * Categories Migration Helper
 * 
 * This file contains utilities to help migrate from string-based categories
 * to a proper categories table structure when the refactoring happens.
 */

import { SupabaseService } from './supabaseService';
import type { CategoryInsert } from './supabase';

export interface CategoryMigrationData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
}

/**
 * Generate a slug from a category name
 */
export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Generate a color for a category based on its name
 */
export function generateCategoryColor(name: string): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
}

/**
 * Get an icon for a category based on its name
 */
export function getCategoryIcon(name: string): string {
  const iconMap: Record<string, string> = {
    'eletrônicos': 'Smartphone',
    'cosméticos': 'Sparkles',
    'bebidas': 'Coffee',
    'roupas': 'Shirt',
    'casa': 'Home',
    'livros': 'Book',
    'esportes': 'Activity',
    'saúde': 'Heart',
    'beleza': 'Sparkles',
    'alimentação': 'Utensils',
  };
  
  const normalizedName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return icon;
    }
  }
  
  return 'Package'; // Default icon
}

/**
 * Extract unique categories from products and prepare migration data
 */
export async function extractCategoriesForMigration(): Promise<CategoryMigrationData[]> {
  try {
    const products = await SupabaseService.getProducts();
    const uniqueCategories = Array.from(
      new Set(products.map(p => p.category).filter(Boolean))
    );
    
    return uniqueCategories.map((category, index) => ({
      name: category,
      slug: generateCategorySlug(category),
      description: `Categoria ${category}`,
      color: generateCategoryColor(category),
      icon: getCategoryIcon(category),
      sortOrder: index + 1,
    }));
  } catch (error) {
    console.error('Error extracting categories:', error);
    return [];
  }
}

/**
 * Create categories in the database (for future use)
 */
export async function createCategoriesFromMigration(
  categories: CategoryMigrationData[],
  createdBy: string
): Promise<void> {
  // This will be implemented when the categories table is created
  console.log('Categories migration data prepared:', categories);
  console.log('Created by:', createdBy);
  
  // Future implementation:
  // const categoryInserts: CategoryInsert[] = categories.map(cat => ({
  //   name: cat.name,
  //   slug: cat.slug,
  //   description: cat.description,
  //   color: cat.color,
  //   icon: cat.icon,
  //   is_active: true,
  //   sort_order: cat.sortOrder,
  //   created_by: createdBy,
  // }));
  // 
  // await SupabaseService.createCategories(categoryInserts);
}

/**
 * Migration plan for categories refactoring
 */
export const CATEGORIES_MIGRATION_PLAN = {
  steps: [
    '1. Create categories table in Supabase',
    '2. Run extractCategoriesForMigration() to get current categories',
    '3. Create categories using createCategoriesFromMigration()',
    '4. Add category_id foreign key to products table',
    '5. Update products to reference category_id instead of category string',
    '6. Update all queries to use category_id joins',
    '7. Remove category string field from products table',
    '8. Update admin panel to use category management',
  ],
  benefits: [
    'Better data integrity with foreign key constraints',
    'Easier category management (CRUD operations)',
    'Category metadata (colors, icons, descriptions)',
    'Better performance with proper indexing',
    'Consistent category naming and slug generation',
  ],
};