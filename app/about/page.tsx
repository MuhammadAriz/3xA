import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | 3xA",
  description: "Learn more about our company, mission, and team",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">About Us</h1>

        {/* Company Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Our Story</h2>
              <p className="mb-4 text-gray-700">
                Founded in 2020, 3xA started with a simple mission: to provide high-quality products that meet the
                everyday needs of our customers. What began as a small online store has grown into a trusted retailer
                with a presence on multiple platforms including our own website and Daraz.
              </p>
              <p className="text-gray-700">
                We believe in quality, affordability, and exceptional customer service. Every product we offer is
                carefully selected to ensure it meets our high standards and provides real value to our customers.
              </p>
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg md:h-80">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Our company building"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16 rounded-xl bg-emerald-50 p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">Our Mission & Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-emerald-700">Quality</h3>
              <p className="text-gray-700">
                We never compromise on quality. Each product is tested and verified to meet our strict standards.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-emerald-700">Customer First</h3>
              <p className="text-gray-700">
                Our customers are at the heart of everything we do. We strive to exceed expectations with every
                interaction.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-xl font-semibold text-emerald-700">Integrity</h3>
              <p className="text-gray-700">
                We operate with honesty and transparency in all our business practices and relationships.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                name: "John Smith",
                position: "Founder & CEO",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Sarah Johnson",
                position: "Head of Operations",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Michael Chen",
                position: "Product Manager",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Our Achievements</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 text-4xl font-bold text-emerald-600">5,000+</div>
              <p className="text-lg text-gray-700">Happy customers served since our founding</p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 text-4xl font-bold text-emerald-600">500+</div>
              <p className="text-lg text-gray-700">Products available across all categories</p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 text-4xl font-bold text-emerald-600">4.8/5</div>
              <p className="text-lg text-gray-700">Average customer satisfaction rating</p>
            </div>
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 text-4xl font-bold text-emerald-600">24/7</div>
              <p className="text-lg text-gray-700">Customer support availability</p>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section>
          <h2 className="mb-8 text-center text-2xl font-bold">Our Partners</h2>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {[1, 2, 3, 4, 5].map((partner) => (
              <div key={partner} className="grayscale transition-all hover:grayscale-0">
                <Image
                  src={`/placeholder.svg?height=100&width=200&text=Partner ${partner}`}
                  alt={`Partner ${partner}`}
                  width={120}
                  height={60}
                  className="h-auto w-auto"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
