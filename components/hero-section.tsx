import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gray-50">
      <div className="container mx-auto grid min-h-[600px] grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2">
        <div className="z-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">Quality Products</span>
            <span className="block text-emerald-600">For Your Needs</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-gray-600">
            Discover our curated collection of high-quality products. Now available on our website and Daraz store.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#daraz-integration">Visit Our Daraz Store</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] w-full">
          <Image
            src="/placeholder.svg?height=800&width=800"
            alt="Featured products"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}
