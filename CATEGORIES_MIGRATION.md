# Categories Migration Guide

This guide explains how to migrate from the current text-based category system to a proper Supabase categories table.

## Overview

Currently, categories are stored as a simple `string` column in the `products` table. This migration will:

1. Create a dedicated `categories` table with proper structure
2. Migrate existing category data from the text column
3. Add a foreign key relationship between products and categories
4. Update the application code to work with the new structure
5. Maintain backward compatibility during the transition

## Migration Steps

### Step 1: Run SQL Migration

Execute the SQL migration script in your Supabase dashboard:

```sql
-- Run the contents of src/lib/migrations/categories-migration.sql
```

This will:
- Create the `categories` table
- Add indexes for performance
- Insert existing categories from products
- Add `category_id` column to products table
- Update products to reference categories
- Set up RLS policies and triggers

### Step 2: Run TypeScript Migration

After the SQL migration is complete, run the TypeScript migration:

```javascript
// In browser console (after authentication)
window.migrateCategories()
```

This will:
- Verify the migration was successful
- Handle any edge cases
- Update product references

### Step 3: Verify Migration

Check that:
- Categories table has data
- Products have `category_id` values
- Application still works correctly

## New Database Structure

### Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Hex color code for UI
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

### Updated Products Table

```sql
-- New column added
ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);

-- Legacy column remains for backward compatibility
-- category VARCHAR -- Will be deprecated
```

## Application Changes

### New Types

```typescript
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];
```

### New Service Methods

```typescript
// New category management methods
SupabaseService.getCategories()
SupabaseService.getCategoryById(id)
SupabaseService.createCategory(category)
SupabaseService.updateCategory(id, updates)
SupabaseService.deleteCategory(id)

// Updated product methods with category joins
SupabaseService.getProducts() // Now includes category data
SupabaseService.getProductsByCategory(categoryId) // Uses category_id
```

### New Hooks

```typescript
// New category-specific hooks
useCategoriesQuery()
useCategoryQuery(categoryId)
usePrefetchCategories()
useInvalidateCategories()
```

### Updated Product Queries

Products now include category data via joins:

```typescript
const products = await supabase
  .from("products")
  .select(`
    *,
    categories (
      id,
      name,
      slug,
      color
    )
  `)
```

## Backward Compatibility

The migration maintains backward compatibility:

1. **Legacy category column** remains in products table
2. **Fallback logic** in hooks uses legacy method if categories table is empty
3. **Gradual migration** allows for smooth transition
4. **Legacy service methods** available for compatibility

## Benefits

### Performance
- Proper indexing on category relationships
- Reduced data duplication
- Better query optimization

### Functionality
- Category management (CRUD operations)
- Category colors and styling
- Category ordering and sorting
- Category descriptions
- URL-friendly slugs

### Data Integrity
- Foreign key constraints
- Referential integrity
- Consistent category names
- Audit trail (created_by, timestamps)

## Rollback Plan

If needed, you can rollback the migration:

```javascript
// In browser console
window.rollbackCategoriesMigration()
```

This will:
- Remove `category_id` column from products
- Drop the categories table
- Restore original functionality

## Testing

After migration, test:

1. **Product listing** - All products should display
2. **Category filtering** - Filtering should work correctly
3. **Product cards** - Category badges should display
4. **Admin panel** - Product creation/editing should work
5. **Performance** - Queries should be fast

## Future Enhancements

With the new category structure, you can now:

1. **Add category colors** for better UI
2. **Implement category management** in admin panel
3. **Add category descriptions** for SEO
4. **Create category-specific pages** with slugs
5. **Add category ordering** and sorting
6. **Implement category analytics**

## Troubleshooting

### Common Issues

1. **Migration fails** - Check user permissions and authentication
2. **Products missing categories** - Run verification step
3. **Performance issues** - Check indexes are created
4. **RLS errors** - Verify policies are set correctly

### Debug Commands

```javascript
// Check categories table
const { data } = await supabase.from('categories').select('*');

// Check products with category_id
const { data } = await supabase.from('products').select('id, name, category, category_id');

// Verify migration
window.migrateCategories(); // Will show verification results
```

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Supabase permissions
3. Check RLS policies
4. Review the migration logs
5. Test with a small dataset first