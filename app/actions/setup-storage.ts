"use server"

import { createClient } from "@supabase/supabase-js"

export async function setupStorage() {
  try {
    // Create a Supabase client with the service role key for admin operations
    const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

    // Check if the product-images bucket exists
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets()

    if (getBucketsError) {
      console.error("Error listing buckets:", getBucketsError)
      return {
        success: false,
        error: getBucketsError.message,
        message: "Could not list storage buckets. Using fallback image storage.",
      }
    }

    // Check if the product-images bucket exists
    const productImagesBucketExists = buckets?.some((bucket) => bucket.name === "product-images")

    // If the bucket doesn't exist, we'll just return a message - we won't try to create it
    if (!productImagesBucketExists) {
      return {
        success: false,
        error: "Bucket does not exist",
        message:
          "The product-images bucket does not exist. Please create it manually in the Supabase dashboard or use direct image URLs.",
      }
    }

    return {
      success: true,
      message: "Storage is properly configured.",
    }
  } catch (error) {
    console.error("Error setting up storage:", error)
    return {
      success: false,
      error: String(error),
      message: "Error checking storage configuration. Using fallback image storage.",
    }
  }
}
