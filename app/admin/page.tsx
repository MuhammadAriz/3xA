"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Users, CreditCard, Package, ArrowUpRight, ArrowDownRight } from "lucide-react"
import SupabaseSetupGuide from "@/components/admin/supabase-setup-guide"
import { isSupabaseConfigured, useSupabaseClient } from "@/lib/supabase"
import { useState, useEffect } from "react"
import DatabaseSetup from "@/components/admin/database-setup"

export default function AdminDashboard() {
  const [tablesExist, setTablesExist] = useState<boolean | null>(null)
  const supabase = useSupabaseClient()

  useEffect(() => {
    // Check if the products table exists
    async function checkTables() {
      if (!isSupabaseConfigured || !supabase) {
        setTablesExist(false)
        return
      }

      try {
        // Try to fetch a single product to see if the table exists
        const { error } = await supabase.from("products").select("id").limit(1)

        if (error && error.message.includes("does not exist")) {
          setTablesExist(false)
        } else {
          setTablesExist(true)
        }
      } catch (error) {
        console.error("Error checking tables:", error)
        setTablesExist(false)
      }
    }

    checkTables()
  }, [supabase])

  // Show loading state while checking
  if (tablesExist === null) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
        </div>
      </div>
    )
  }

  // Show database setup if tables don't exist
  if (!tablesExist) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <DatabaseSetup />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      {!isSupabaseConfigured && (
        <div className="mb-8">
          <SupabaseSetupGuide />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                +20.1% <ArrowUpRight className="ml-1 h-4 w-4" />
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                +15% <ArrowUpRight className="ml-1 h-4 w-4" />
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                +2 <ArrowUpRight className="ml-1 h-4 w-4" />
              </span>
              new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                -2% <ArrowDownRight className="ml-1 h-4 w-4" />
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 12 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Customer #{i}</p>
                      <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto font-medium">+PKR {Math.floor(Math.random() * 10000)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
