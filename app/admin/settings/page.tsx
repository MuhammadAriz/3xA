"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [storeSettings, setStoreSettings] = useState({
    storeName: "3xA",
    storeEmail: "3x.a.brand@gmail.com",
    storePhone: "+92 323 2056640",
    storeAddress: "123 Business Street, City Center, Country",
    storeCurrency: "PKR",
    storeDescription: "Providing quality products since 2025. We offer a wide range of items to meet your needs.",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newCustomer: false,
  })

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings({
      ...storeSettings,
      [name]: value,
    })
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }

  const handleStoreSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your store settings have been updated successfully.",
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleNotificationSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your store details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStoreSettingsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeCurrency">Currency</Label>
                    <Input
                      id="storeCurrency"
                      name="storeCurrency"
                      value={storeSettings.storeCurrency}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email Address</Label>
                    <Input
                      id="storeEmail"
                      name="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      name="storePhone"
                      value={storeSettings.storePhone}
                      onChange={handleStoreSettingsChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Address</Label>
                  <Input
                    id="storeAddress"
                    name="storeAddress"
                    value={storeSettings.storeAddress}
                    onChange={handleStoreSettingsChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={handleStoreSettingsChange}
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure when you receive email notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSettingsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderConfirmation" className="text-base">
                        Order Confirmation
                      </Label>
                      <p className="text-sm text-gray-500">Receive notifications when an order is placed.</p>
                    </div>
                    <Switch
                      id="orderConfirmation"
                      checked={notificationSettings.orderConfirmation}
                      onCheckedChange={(checked) => handleNotificationChange("orderConfirmation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderShipped" className="text-base">
                        Order Shipped
                      </Label>
                      <p className="text-sm text-gray-500">Receive notifications when an order is shipped.</p>
                    </div>
                    <Switch
                      id="orderShipped"
                      checked={notificationSettings.orderShipped}
                      onCheckedChange={(checked) => handleNotificationChange("orderShipped", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderDelivered" className="text-base">
                        Order Delivered
                      </Label>
                      <p className="text-sm text-gray-500">Receive notifications when an order is delivered.</p>
                    </div>
                    <Switch
                      id="orderDelivered"
                      checked={notificationSettings.orderDelivered}
                      onCheckedChange={(checked) => handleNotificationChange("orderDelivered", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowStock" className="text-base">
                        Low Stock Alerts
                      </Label>
                      <p className="text-sm text-gray-500">Receive notifications when product stock is low.</p>
                    </div>
                    <Switch
                      id="lowStock"
                      checked={notificationSettings.lowStock}
                      onCheckedChange={(checked) => handleNotificationChange("lowStock", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newCustomer" className="text-base">
                        New Customer Registration
                      </Label>
                      <p className="text-sm text-gray-500">Receive notifications when a new customer registers.</p>
                    </div>
                    <Switch
                      id="newCustomer"
                      checked={notificationSettings.newCustomer}
                      onCheckedChange={(checked) => handleNotificationChange("newCustomer", checked)}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage admin users and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">admin</TableCell>
                        <TableCell>admin@example.com</TableCell>
                        <TableCell>Administrator</TableCell>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Active
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <Button>Add New User</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
