-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
-- Anyone can read products (for public access)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Only authenticated users with editor+ role can insert products
CREATE POLICY "Only editors and admins can insert products" ON products
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

-- Only authenticated users with editor+ role can update products
CREATE POLICY "Only editors and admins can update products" ON products
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'editor')
    )
  );

-- Only authenticated users with admin role can delete products
CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create policies for user_roles table
-- Users can view their own role
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Only admins can manage user roles
CREATE POLICY "Only admins can manage user roles" ON user_roles
  FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at 
  BEFORE UPDATE ON user_roles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM user_roles 
    WHERE user_id = user_uuid 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  role_hierarchy JSONB := '{"admin": 3, "editor": 2, "viewer": 1}'::jsonb;
BEGIN
  user_role := get_user_role(user_uuid);
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN (role_hierarchy->>user_role)::INT >= (role_hierarchy->>required_role)::INT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user role (you'll need to replace with actual user ID)
-- INSERT INTO user_roles (user_id, role) VALUES ('your-admin-user-id', 'admin');

-- Create view for products with user information
CREATE OR REPLACE VIEW products_with_creator AS
SELECT 
  p.*,
  u.email as creator_email
FROM products p
LEFT JOIN auth.users u ON p.created_by = u.id;

-- Grant access to the view
GRANT SELECT ON products_with_creator TO authenticated;
GRANT SELECT ON products_with_creator TO anon;