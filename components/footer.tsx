import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold">3xA</h3>
            <p className="mt-4 text-sm text-gray-600">
              Providing quality products since 2025. We offer a wide range of items to meet your needs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=featured" className="text-sm text-gray-600 hover:text-gray-900">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/products?category=new" className="text-sm text-gray-600 hover:text-gray-900">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#daraz-integration" className="text-sm text-gray-600 hover:text-gray-900">
                  Daraz Store
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://www.facebook.com/share/15AeugAAZ6/" target="_blank" className="text-sm text-gray-600 hover:text-gray-900">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} 3xA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
