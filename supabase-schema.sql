-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC NOT NULL,
  review_count INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  daraz_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (in addition to Supabase's auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Allow public read access to products" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Allow admin to insert products" 
ON products FOR INSERT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Allow admin to update products" 
ON products FOR UPDATE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Allow admin to delete products" 
ON products FOR DELETE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Users policies
CREATE POLICY "Allow users to read their own user data" 
ON users FOR SELECT 
TO authenticated
USING (id = auth.uid() OR EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Allow admin to insert users" 
ON users FOR INSERT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

-- Orders policies
CREATE POLICY "Allow users to read their own orders" 
ON orders FOR SELECT 
TO authenticated
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM users
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Allow users to insert their own orders" 
ON orders FOR INSERT 
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

-- Order items policies
CREATE POLICY "Allow users to read their own order items" 
ON order_items FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ))
));

CREATE POLICY "Allow users to insert their own order items" 
ON order_items FOR INSERT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));
