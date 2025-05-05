import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OrdersTable from "@/components/admin/orders-table"

export default function OrdersPage() {
  // In a real app, you would fetch orders from your API
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2023-05-15",
      status: "completed",
      total: 12999,
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2023-05-14",
      status: "processing",
      total: 24999,
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      date: "2023-05-13",
      status: "pending",
      total: 3999,
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      date: "2023-05-12",
      status: "completed",
      total: 19999,
    },
    {
      id: "ORD-005",
      customer: "Charlie Wilson",
      date: "2023-05-11",
      status: "cancelled",
      total: 2999,
    },
  ]

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}
