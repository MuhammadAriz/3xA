"use server"

import supabaseAdmin from "@/lib/supabase-admin"

export async function setupDatabaseTriggers() {
  const { error } = await supabaseAdmin.rpc("exec_sql", {
    sql: `
    -- Create triggers to update the updated_at column
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Apply the trigger to all tables with updated_at column
    DROP TRIGGER IF EXISTS update_products_updated_at ON products;
    CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
    CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
    CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
    CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_cart_updated_at ON cart;
    CREATE TRIGGER update_cart_updated_at
    BEFORE UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
    CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    `,
  })

  if (error) {
    console.error("Error setting up triggers:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function setupProductRatingFunction() {
  const { error } = await supabaseAdmin.rpc("exec_sql", {
    sql: `
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
    DROP TRIGGER IF EXISTS review_inserted ON reviews;
    CREATE TRIGGER review_inserted
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

    DROP TRIGGER IF EXISTS review_updated ON reviews;
    CREATE TRIGGER review_updated
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

    DROP TRIGGER IF EXISTS review_deleted ON reviews;
    CREATE TRIGGER review_deleted
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();
    `,
  })

  if (error) {
    console.error("Error setting up product rating function:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function setupRLS() {
  const { error } = await supabaseAdmin.rpc("exec_sql", {
    sql: `
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

    -- Create a function to check if a user is an admin
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
    DROP POLICY IF EXISTS "Allow public read access to products" ON products;
    CREATE POLICY "Allow public read access to products" 
    ON products FOR SELECT 
    USING (true);

    DROP POLICY IF EXISTS "Allow admin to insert products" ON products;
    CREATE POLICY "Allow admin to insert products" 
    ON products FOR INSERT 
    TO authenticated
    WITH CHECK (is_admin());

    DROP POLICY IF EXISTS "Allow admin to update products" ON products;
    CREATE POLICY "Allow admin to update products" 
    ON products FOR UPDATE 
    TO authenticated
    USING (is_admin());

    DROP POLICY IF EXISTS "Allow admin to delete products" ON products;
    CREATE POLICY "Allow admin to delete products" 
    ON products FOR DELETE 
    TO authenticated
    USING (is_admin());

    -- Categories policies
    DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
    CREATE POLICY "Allow public read access to categories" 
    ON categories FOR SELECT 
    USING (true);

    DROP POLICY IF EXISTS "Allow admin to insert categories" ON categories;
    CREATE POLICY "Allow admin to insert categories" 
    ON categories FOR INSERT 
    TO authenticated
    WITH CHECK (is_admin());

    DROP POLICY IF EXISTS "Allow admin to update categories" ON categories;
    CREATE POLICY "Allow admin to update categories" 
    ON categories FOR UPDATE 
    TO authenticated
    USING (is_admin());

    DROP POLICY IF EXISTS "Allow admin to delete categories" ON categories;
    CREATE POLICY "Allow admin to delete categories" 
    ON categories FOR DELETE 
    TO authenticated
    USING (is_admin());

    -- Settings policies
    DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
    CREATE POLICY "Allow public read access to settings" 
    ON settings FOR SELECT 
    USING (true);

    DROP POLICY IF EXISTS "Allow admin to manage settings" ON settings;
    CREATE POLICY "Allow admin to manage settings" 
    ON settings FOR ALL 
    TO authenticated
    USING (is_admin());
    `,
  })

  if (error) {
    console.error("Error setting up RLS:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function insertInitialData() {
  // Insert categories
  const { error: categoriesError } = await supabaseAdmin
    .from("categories")
    .insert([
      { name: "Electronics", slug: "electronics", description: "Electronic devices and accessories" },
      { name: "Clothing", slug: "clothing", description: "Apparel and fashion items" },
      { name: "Home & Kitchen", slug: "home-kitchen", description: "Home and kitchen products" },
      { name: "Books", slug: "books", description: "Books and publications" },
      { name: "Toys & Games", slug: "toys-games", description: "Toys and games for all ages" },
    ])
    .select()

  if (categoriesError) {
    console.error("Error inserting categories:", categoriesError)
    return { success: false, error: categoriesError.message }
  }

  // Get the electronics category ID
  const { data: electronicsCategory } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", "electronics")
    .single()

  // Insert sample products
  const { error: productsError } = await supabaseAdmin.from("products").insert([
    {
      name: "Smartphone X",
      slug: "smartphone-x",
      description: "The latest smartphone with advanced features",
      price: 999.99,
      sale_price: 899.99,
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category_id: electronicsCategory?.id,
      category: "Electronics",
      stock: 50,
      featured: true,
      specifications: JSON.stringify({
        processor: "Octa-core",
        ram: "8GB",
        storage: "256GB",
        camera: "48MP",
      }),
      tags: ["smartphone", "mobile", "tech"],
    },
    {
      name: "Wireless Earbuds",
      slug: "wireless-earbuds",
      description: "High-quality wireless earbuds with noise cancellation",
      price: 149.99,
      sale_price: null,
      image:
        "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category_id: electronicsCategory?.id,
      category: "Electronics",
      stock: 100,
      featured: true,
      specifications: JSON.stringify({
        battery: "24 hours",
        connectivity: "Bluetooth 5.0",
        waterproof: "IPX4",
      }),
      tags: ["audio", "wireless", "earbuds"],
    },
  ])

  if (productsError) {
    console.error("Error inserting products:", productsError)
    return { success: false, error: productsError.message }
  }

  // Insert settings
  const { error: settingsError } = await supabaseAdmin.from("settings").insert([
    {
      key: "store_info",
      value: {
        name: "3xA",
        email: "3x.a.brand@gmail.com",
        phone: "+92 323 2056640",
        address: "123 Main St, City, Country",
      },
    },
    {
      key: "shipping_methods",
      value: [
        { name: "Standard Shipping", price: 500, estimated_days: "3-5" },
        { name: "Express Shipping", price: 1000, estimated_days: "1-2" },
      ],
    },
    {
      key: "payment_methods",
      value: [
        { name: "Credit Card", enabled: true },
        { name: "Cash on Delivery", enabled: true },
      ],
    },
    {
      key: "tax_settings",
      value: {
        rate: 0.05,
        included_in_price: false,
      },
    },
  ])

  if (settingsError) {
    console.error("Error inserting settings:", settingsError)
    return { success: false, error: settingsError.message }
  }

  return { success: true }
}
