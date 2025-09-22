-- Migration: Create categories table and migrate data from products.category
-- This migration creates a proper categories table and migrates existing category data

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS categories (
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Step 3: Insert existing categories from products table
-- This will extract unique categories and create proper category records
INSERT INTO categories (name, slug, description, created_by)
SELECT DISTINCT
  category as name,
  LOWER(REGEXP_REPLACE(category, '[^a-zA-Z0-9]+', '-', 'g')) as slug,
  CONCAT('Categoria: ', category) as description,
  created_by
FROM products 
WHERE category IS NOT NULL 
  AND category != ''
  AND category NOT IN (SELECT name FROM categories)
ORDER BY category;

-- Step 4: Add category_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Step 5: Update products to reference the new category table
UPDATE products 
SET category_id = c.id
FROM categories c
WHERE products.category = c.name
  AND products.category IS NOT NULL;

-- Step 6: Create index on the new foreign key
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Step 7: Add RLS policies for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access to all authenticated users
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Policy: Allow insert/update/delete only for admins
CREATE POLICY "Categories are manageable by admins" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Step 8: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Step 9: Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_category_slug(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_category_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_category_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_category_slug_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION set_category_slug();
