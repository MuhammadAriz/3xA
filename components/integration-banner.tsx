import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function IntegrationBanner() {
  return (
    <section id="daraz-integration" className="bg-gradient-to-r from-orange-50 to-orange-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Shop on Daraz</h2>
            <p className="mt-4 text-lg text-gray-700">
              We've integrated our store with Daraz to give you more shopping options. Find our products on Daraz and
              enjoy their secure payment and delivery services.
            </p>
            <div className="mt-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                <a href="https://www.daraz.pk" target="_blank" rel="noopener noreferrer">
                  Visit Our Daraz Store
                </a>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] w-full">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Daraz integration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
