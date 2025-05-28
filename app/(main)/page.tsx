import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Star, TrendingUp } from "lucide-react"
import CategoryCard from "@/components/category-card"
import TestimonialCard from "@/components/testimonial-card"
import ChatbotButton from "@/components/chatbot-button"

export default function Home() {
  // Sample data - in a real app, this would come from a database
  const featuredProducts = [
    {
      id: 1,
      name: "Kem dưỡng ẩm Thanh Tâm",
      price: 450000,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviewCount: 124,
      category: "Chăm sóc da",
      isNew: true,
    },
    {
      id: 2,
      name: "Serum Vitamin C",
      price: 650000,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviewCount: 89,
      category: "Chăm sóc da",
      isNew: false,
    },
    {
      id: 3,
      name: "Phấn nước Thanh Tâm",
      price: 550000,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviewCount: 56,
      category: "Trang điểm",
      isNew: true,
    },
    {
      id: 4,
      name: "Son lì Thanh Tâm",
      price: 350000,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviewCount: 78,
      category: "Trang điểm",
      isNew: false,
    },
  ]

  const categories = [
    {
      id: 1,
      name: "Chăm sóc da",
      image: "/placeholder.svg?height=200&width=200",
      count: 45,
    },
    {
      id: 2,
      name: "Trang điểm",
      image: "/placeholder.svg?height=200&width=200",
      count: 38,
    },
    {
      id: 3,
      name: "Chăm sóc tóc",
      image: "/placeholder.svg?height=200&width=200",
      count: 24,
    },
    {
      id: 4,
      name: "Nước hoa",
      image: "/placeholder.svg?height=200&width=200",
      count: 16,
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Hương",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      comment: "Sản phẩm chất lượng, giao hàng nhanh. Tôi rất hài lòng với dịch vụ của Thanh Tâm.",
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      comment: "Kem dưỡng ẩm Thanh Tâm đã cải thiện làn da của tôi rất nhiều. Sẽ tiếp tục ủng hộ!",
    },
    {
      id: 3,
      name: "Lê Thị Hà",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
      comment: "Son lì Thanh Tâm lên màu đẹp, bền màu và không làm khô môi. Rất đáng để thử!",
    },
  ]

  return (
    <div className="pb-16">
      {/* Hero section */}
      <section className="relative bg-pink-50 py-16 md:py-24">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">Mới ra mắt</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Khám phá bí mật làm đẹp cùng Thanh Tâm</h1>
            <p className="text-lg text-gray-600">
              Sản phẩm mỹ phẩm chất lượng cao, an toàn và hiệu quả. Chăm sóc làn da của bạn với những sản phẩm tốt nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                Mua sắm ngay
              </Button>
              <Button size="lg" variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-pink-100 flex items-center justify-center">
              <img src="/placeholder.svg?height=400&width=600" alt="Thanh Tâm Cosmetics" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
            <Link href="/products" className="text-pink-600 hover:text-pink-700 flex items-center">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured products section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
            <Link href="/products" className="text-pink-600 hover:text-pink-700 flex items-center">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner section */}
      <section className="py-16">
        <div className="container">
          <div className="relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-pink-600 opacity-90"></div>
            <div className="relative z-10 p-8 md:p-12 text-white">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <Badge className="bg-white text-pink-600 hover:bg-white">Khuyến mãi đặc biệt</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Giảm giá 20% cho tất cả sản phẩm mới</h2>
                <p className="text-lg opacity-90">
                  Chỉ áp dụng trong thời gian giới hạn. Nhanh tay mua sắm ngay hôm nay!
                </p>
                <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                  Mua ngay
                </Button>
              </div>
            </div>
            <div className="h-[300px] md:h-[400px] bg-pink-500">
              <img
                src="/placeholder.svg?height=400&width=1200"
                alt="Khuyến mãi đặc biệt"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá trải nghiệm của khách hàng với sản phẩm và dịch vụ của Thanh Tâm Cosmetics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sản phẩm chất lượng cao</h3>
                <p className="text-gray-600">
                  Tất cả sản phẩm của chúng tôi đều được kiểm tra nghiêm ngặt về chất lượng và an toàn.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dịch vụ khách hàng 24/7</h3>
                <p className="text-gray-600">Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Cam kết hoàn tiền</h3>
                <p className="text-gray-600">
                  Không hài lòng với sản phẩm? Chúng tôi sẽ hoàn tiền 100% trong vòng 30 ngày.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chatbot button */}
      <ChatbotButton />
    </div>
  )
}
