-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  sale_price NUMERIC CHECK (sale_price IS NULL OR sale_price >= 0),
  image TEXT NOT NULL,
  images JSONB, -- Array of additional images
  category_id UUID REFERENCES categories(id),
  category TEXT NOT NULL, -- Legacy field for backward compatibility
  rating NUMERIC NOT NULL DEFAULT 0  CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  daraz_link TEXT,
  specifications JSONB, -- Product specifications as JSON
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (in addition to Supabase's auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address JSONB,
  role TEXT NOT NULL DEFAULT 'customer',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC NOT NULL CHECK (total >= 0),
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  tax NUMERIC NOT NULL DEFAULT 0 CHECK (tax >= 0),
  shipping_fee NUMERIC NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  discount NUMERIC NOT NULL DEFAULT 0 CHECK (discount >= 0),
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  tracking_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL CHECK (price >= 0),
  total NUMERIC NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  minimum_purchase NUMERIC DEFAULT 0 CHECK (minimum_purchase >= 0),
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create settings table for store configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at
BEFORE UPDATE ON cart
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to update product rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC;
  review_count INTEGER;
BEGIN
  -- Calculate the new average rating and count
  SELECT AVG(rating), COUNT(*)
  INTO avg_rating, review_count
  FROM reviews
  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
  AND status = 'published';
  
  -- Update the product
  UPDATE products
  SET rating = COALESCE(avg_rating, 0),
      review_count = COALESCE(review_count, 0)
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for the review rating function
CREATE TRIGGER review_inserted
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER review_updated
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER review_deleted
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- Create Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create a function to WITH CHECK if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM users
    WHERE id = auth.uid()
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products policies
CREATE POLICY "Allow public read access to products" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to insert products" 
ON products FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Allow admin to update products" 
ON products FOR UPDATE 
TO authenticated
USING (is_admin());

CREATE POLICY "Allow admin to delete products" 
ON products FOR DELETE 
TO authenticated
USING (is_admin());

-- Categories policies
CREATE POLICY "Allow public read access to categories" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to insert categories" 
ON categories FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Allow admin to update categories" 
ON categories FOR UPDATE 
TO authenticated
USING (is_admin());

CREATE POLICY "Allow admin to delete categories" 
ON categories FOR DELETE 
TO authenticated
USING (is_admin());

-- Users policies
CREATE POLICY "Allow users to read their own user data" 
ON users FOR SELECT 
TO authenticated
USING (id = auth.uid() OR is_admin());

CREATE POLICY "Allow admin to read all users" 
ON users FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "Allow users to update their own user data" 
ON users FOR UPDATE 
TO authenticated
USING (id = auth.uid() OR is_admin());

CREATE POLICY "Allow admin to insert users" 
ON users FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

-- Orders policies
CREATE POLICY "Allow users to read their own orders" 
ON orders FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Allow users to insert their own orders" 
ON orders FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Allow users to update their own orders" 
ON orders FOR UPDATE 
TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Order items policies
CREATE POLICY "Allow users to read their own order items" 
ON order_items FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id 
  AND (orders.user_id = auth.uid() OR is_admin())
));

CREATE POLICY "Allow users to insert their own order items" 
ON order_items FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id 
  AND (orders.user_id = auth.uid() OR is_admin())
));

-- Reviews policies
CREATE POLICY "Allow public read access to reviews" 
ON reviews FOR SELECT 
USING (status = 'published' OR user_id = auth.uid() OR is_admin());

CREATE POLICY "Allow authenticated users to insert reviews" 
ON reviews FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to update their own reviews" 
ON reviews FOR UPDATE 
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Allow users to delete their own reviews" 
ON reviews FOR DELETE 
TO authenticated
USING (user_id = auth.uid() OR is_admin());

-- Coupons policies
CREATE POLICY "Allow public read access to active coupons" 
ON coupons FOR SELECT 
USING (is_active = true OR is_admin());

CREATE POLICY "Allow admin to manage coupons" 
ON coupons FOR ALL 
TO authenticated
USING (is_admin());

-- Wishlist policies
CREATE POLICY "Allow users to manage their own wishlist" 
ON wishlist FOR ALL 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow admin to view all wishlists" 
ON wishlist FOR SELECT 
TO authenticated
USING (is_admin());

-- Cart policies
CREATE POLICY "Allow users to manage their own cart" 
ON cart FOR ALL 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Allow admin to view all carts" 
ON cart FOR SELECT 
TO authenticated
USING (is_admin());

-- Settings policies
CREATE POLICY "Allow public read access to settings" 
ON settings FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to manage settings" 
ON settings FOR ALL 
TO authenticated
USING (is_admin());

-- Insert some initial categories
INSERT INTO categories (name, slug, description)
VALUES 
('Electronics', 'electronics', 'Electronic devices and accessories'),
('Clothing', 'clothing', 'Apparel and fashion items'),
('Home & Kitchen', 'home-kitchen', 'Home and kitchen products'),
('Books', 'books', 'Books and publications'),
('Toys & Games', 'toys-games', 'Toys and games for all ages');

-- Insert some initial settings
INSERT INTO settings (key, value)
VALUES 
('store_info', '{"name": "My E-commerce Store", "email": "contact@example.com", "phone": "+1234567890", "address": "123 Main St, City, Country"}'),
('shipping_methods', '[{"name": "Standard Shipping", "price": 5.99, "estimated_days": "3-5"}, {"name": "Express Shipping", "price": 15.99, "estimated_days": "1-2"}]'),
('payment_methods', '[{"name": "Credit Card", "enabled": true}, {"name": "PayPal", "enabled": true}, {"name": "Cash on Delivery", "enabled": true}]'),
('tax_settings', '{"rate": 0.1, "included_in_price": false}');
