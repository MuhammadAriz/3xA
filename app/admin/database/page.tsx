import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DatabaseTroubleshooter from "@/components/admin/database-troubleshooter"

export default function DatabasePage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Database Management</h1>

      <div className="grid gap-6">
        <DatabaseTroubleshooter />

        <Card>
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
            <CardDescription>Overview of your database structure and tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Tables</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  <li>
                    <strong>products</strong> - Store product information including name, description, price, and
                    inventory
                  </li>
                  <li>
                    <strong>categories</strong> - Product categories with hierarchical structure support
                  </li>
                  <li>
                    <strong>users</strong> - User profiles and account information
                  </li>
                  <li>
                    <strong>orders</strong> - Customer orders with status tracking
                  </li>
                  <li>
                    <strong>order_items</strong> - Individual items within each order
                  </li>
                  <li>
                    <strong>reviews</strong> - Product reviews and ratings
                  </li>
                  <li>
                    <strong>coupons</strong> - Discount codes and promotions
                  </li>
                  <li>
                    <strong>wishlist</strong> - User wishlist items
                  </li>
                  <li>
                    <strong>cart</strong> - Shopping cart items
                  </li>
                  <li>
                    <strong>settings</strong> - Store configuration and settings
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Features</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  <li>
                    <strong>Row Level Security (RLS)</strong> - Secure data access based on user roles and permissions
                  </li>
                  <li>
                    <strong>Automatic Timestamps</strong> - Created and updated timestamps are managed automatically
                  </li>
                  <li>
                    <strong>Referential Integrity</strong> - Foreign key constraints ensure data consistency
                  </li>
                  <li>
                    <strong>Triggers</strong> - Automatic updates for related data (e.g., product ratings)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
