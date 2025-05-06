import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { OrderProvider } from "@/contexts/order-context"
import { ProductProvider } from "@/contexts/product-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import SupabaseStatusChecker from "@/components/supabase-status-checker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "3xA | Quality Products",
  description: "Discover our collection of high-quality products",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SupabaseStatusChecker />
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
