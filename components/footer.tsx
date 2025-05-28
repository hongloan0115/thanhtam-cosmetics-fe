import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-pink-50 border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-pink-600 mb-4">Thanh Tâm</h3>
            <p className="text-sm text-gray-600 mb-4">
              Chuyên cung cấp các sản phẩm mỹ phẩm chính hãng, chất lượng cao với giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-pink-600 hover:text-pink-800">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-pink-600 hover:text-pink-800">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-pink-600 hover:text-pink-800">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products/skincare" className="text-gray-600 hover:text-pink-600">
                  Chăm sóc da
                </Link>
              </li>
              <li>
                <Link href="/products/makeup" className="text-gray-600 hover:text-pink-600">
                  Trang điểm
                </Link>
              </li>
              <li>
                <Link href="/products/haircare" className="text-gray-600 hover:text-pink-600">
                  Chăm sóc tóc
                </Link>
              </li>
              <li>
                <Link href="/products/bodycare" className="text-gray-600 hover:text-pink-600">
                  Chăm sóc cơ thể
                </Link>
              </li>
              <li>
                <Link href="/products/fragrance" className="text-gray-600 hover:text-pink-600">
                  Nước hoa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-600">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-pink-600">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-pink-600">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-pink-600">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-pink-600">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-4">Liên hệ</h3>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>123 Đường Nguyễn Huệ</p>
              <p>Quận 1, TP. Hồ Chí Minh</p>
              <p>Email: info@thanhtam.com</p>
              <p>Hotline: 1900 1234</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Thanh Tâm Cosmetics. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
