"use server"

import { createClient } from "@supabase/supabase-js"

// This function checks if storage is properly configured
export async function checkStorageStatus() {
  try {
    // Create a Supabase client with the anon key (not service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

    // Just check if the product-images bucket exists without trying to create it
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets()

    if (getBucketsError) {
      console.error("Error listing buckets:", getBucketsError)
      return {
        success: false,
        error: getBucketsError.message,
        message: "Could not check storage configuration. Using fallback image storage.",
      }
    }

    // Check if the product-images bucket exists
    const productImagesBucketExists = buckets?.some((bucket) => bucket.name === "product-images")

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
    console.error("Error checking storage:", error)
    return {
      success: false,
      error: String(error),
      message: "Error checking storage configuration. Using fallback image storage.",
    }
  }
}

// This function is exported and used elsewhere in the code
export async function setupStorageBuckets() {
  // This is now just a wrapper around checkStorageStatus to maintain compatibility
  // It doesn't try to create buckets anymore to avoid RLS policy errors
  return await checkStorageStatus()
}
