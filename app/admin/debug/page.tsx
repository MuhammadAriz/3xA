import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DebugImage from "@/components/debug-image"
import StorageSetupGuide from "@/components/admin/storage-setup-guide"

export const metadata = {
  title: "Debug Tools - Admin",
  description: "Debug tools for the admin panel",
}

export default function DebugPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Debug Tools</h1>

      <Tabs defaultValue="storage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="storage">Storage Setup</TabsTrigger>
          <TabsTrigger value="images">Image Testing</TabsTrigger>
        </TabsList>
        <TabsContent value="storage" className="mt-6">
          <StorageSetupGuide />
        </TabsContent>
        <TabsContent value="images" className="mt-6">
          <DebugImage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
