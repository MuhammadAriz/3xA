import Link from "next/link"
import { ArrowRight, ShoppingBag, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeaturedProducts from "@/components/featured-products"
import HeroSection from "@/components/hero-section"
import IntegrationBanner from "@/components/integration-banner"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      <IntegrationBanner />

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Why Choose Us</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Products</h3>
              <p className="text-gray-600">We offer only the highest quality products that are built to last.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customer Satisfaction</h3>
              <p className="text-gray-600">Our customers love our products and service, with 4.9/5 average rating.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Shopping</h3>
              <p className="text-gray-600">
                Shop with confidence with our secure payment processing and data protection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
