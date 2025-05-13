import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DebugImage from "@/components/debug-image"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Debug Tools</h1>

      <div className="grid gap-6">
        <DebugImage />

        <Card>
          <CardHeader>
            <CardTitle>Storage Information</CardTitle>
            <CardDescription>Information about Supabase storage configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}
              </p>
              <p>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}
              </p>
              <p className="text-sm text-gray-500">
                Note: For storage to work properly, you need to have a "product-images" bucket in your Supabase storage
                with public access enabled.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
