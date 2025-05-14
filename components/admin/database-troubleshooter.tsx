"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react"
import { isSupabaseConfigured, useSupabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export default function DatabaseTroubleshooter() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<{
    configCheck: boolean | null
    connectionCheck: boolean | null
    tablesCheck: Record<string, boolean> | null
    error: string | null
  }>({
    configCheck: null,
    connectionCheck: null,
    tablesCheck: null,
    error: null,
  })
  const supabase = useSupabaseClient()

  const runDiagnostics = async () => {
    setIsChecking(true)
    setResults({
      configCheck: null,
      connectionCheck: null,
      tablesCheck: null,
      error: null,
    })

    try {
      // Step 1: Check if Supabase is configured
      const configCheck = isSupabaseConfigured
      setResults((prev) => ({ ...prev, configCheck }))

      if (!configCheck) {
        setResults((prev) => ({
          ...prev,
          error: "Supabase is not configured. Please check your environment variables.",
        }))
        return
      }

      // Step 2: Check connection to Supabase
      let connectionCheck = false
      try {
        if (supabase) {
          const { data, error } = await supabase.from("_dummy_query").select("*").limit(1)
          // We expect an error because the table doesn't exist, but the error should be about the table not existing
          // not about connection issues
          connectionCheck = error?.code !== "PGRST301" // This is not a connection error
          setResults((prev) => ({ ...prev, connectionCheck }))
        }
      } catch (error) {
        console.error("Connection check error:", error)
        setResults((prev) => ({
          ...prev,
          connectionCheck: false,
          error: "Failed to connect to Supabase. Please check your credentials.",
        }))
        return
      }

      // Step 3: Check if tables exist
      const tables = ["products", "categories", "users", "orders", "settings"]
      const tablesCheck: Record<string, boolean> = {}

      for (const table of tables) {
        try {
          if (supabase) {
            const { data, error } = await supabase.from(table).select("id").limit(1)
            tablesCheck[table] = !error || error.code !== "PGRST301"
          }
        } catch (error) {
          console.error(`Error checking table ${table}:`, error)
          tablesCheck[table] = false
        }
      }

      setResults((prev) => ({ ...prev, tablesCheck }))

      // Check if any tables are missing
      const missingTables = Object.entries(tablesCheck)
        .filter(([_, exists]) => !exists)
        .map(([table]) => table)

      if (missingTables.length > 0) {
        setResults((prev) => ({
          ...prev,
          error: `The following tables are missing: ${missingTables.join(", ")}. Please run the SQL script.`,
        }))
      }
    } catch (error) {
      console.error("Diagnostics error:", error)
      setResults((prev) => ({
        ...prev,
        error: "An unexpected error occurred during diagnostics.",
      }))
    } finally {
      setIsChecking(false)
    }
  }

  const handleFixDatabase = async () => {
    setIsChecking(true)
    try {
      if (!supabase) {
        throw new Error("Supabase client is not available")
      }

      // Execute the SQL script
      const { error } = await supabase.rpc("exec_sql", { sql: sqlScript })

      if (error) {
        throw error
      }

      toast({
        title: "Database setup complete",
        description: "Tables have been created successfully. Please refresh the page.",
      })

      // Re-run diagnostics
      await runDiagnostics()
    } catch (error) {
      console.error("Error fixing database:", error)
      toast({
        title: "Setup failed",
        description: "Please try running the SQL script manually in the Supabase SQL editor",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Troubleshooter</CardTitle>
        <CardDescription>Diagnose and fix issues with your Supabase database connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runDiagnostics} disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Diagnostics...
              </>
            ) : (
              "Run Diagnostics"
            )}
          </Button>

          {results.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{results.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4">
                {results.configCheck === null ? (
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
                ) : results.configCheck ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <span>Supabase Configuration Check</span>
            </div>

            <div className="flex items-center">
              <div className="mr-2 h-4 w-4">
                {results.connectionCheck === null ? (
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
                ) : results.connectionCheck ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <span>Supabase Connection Check</span>
            </div>

            {results.tablesCheck &&
              Object.entries(results.tablesCheck).map(([table, exists]) => (
                <div key={table} className="flex items-center">
                  <div className="mr-2 h-4 w-4">
                    {exists ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <span>
                    Table Check: <code>{table}</code>
                  </span>
                </div>
              ))}
          </div>

          {results.tablesCheck && Object.values(results.tablesCheck).some((exists) => !exists) && (
            <div className="mt-4 space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing Tables Detected</AlertTitle>
                <AlertDescription>
                  Some database tables are missing. You need to run the SQL script to create them.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">How to fix:</h3>
                <ol className="ml-6 list-decimal space-y-2 text-sm">
                  <li>
                    Go to your{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Supabase Dashboard
                    </a>
                  </li>
                  <li>Select your project</li>
                  <li>Go to the "SQL Editor" section in the left sidebar</li>
                  <li>Create a new query</li>
                  <li>Paste the SQL script below</li>
                  <li>Click "Run" to execute the script</li>
                </ol>
              </div>

              <div className="mt-4">
                <Button onClick={handleFixDatabase} disabled={isChecking}>
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fixing Database...
                    </>
                  ) : (
                    "Try to Fix Automatically"
                  )}
                </Button>
                <p className="mt-2 text-xs text-gray-500">
                  Note: Automatic fixing may not work due to permission restrictions. Manual execution is recommended.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
            Open Supabase Dashboard <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

// SQL script to create database tables
const sqlScript = `
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
  rating NUMERIC NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
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
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

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
RETURNS TRIGGER AS $
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
$ LANGUAGE plpgsql;

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
`
