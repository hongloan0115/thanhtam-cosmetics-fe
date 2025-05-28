"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import AccountLayout from "@/components/account-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export default function WishlistPage() {
  const { user, isLoading, removeFromWishlist } = useAuth()
  const router = useRouter()

  // Sample products data - in a real app, this would come from an API
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Kem dưỡng ẩm Thanh Tâm",
      price: 450000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Chăm sóc da",
    },
    {
      id: 2,
      name: "Serum Vitamin C",
      price: 650000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Chăm sóc da",
    },
    {
      id: 3,
      name: "Phấn nước Thanh Tâm",
      price: 550000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Trang điểm",
    },
    {
      id: 4,
      name: "Son lì Thanh Tâm",
      price: 350000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Trang điểm",
    },
    {
      id: 5,
      name: "Dầu gội Thanh Tâm",
      price: 250000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Chăm sóc tóc",
    },
    {
      id: 6,
      name: "Sữa tắm Thanh Tâm",
      price: 280000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Chăm sóc cơ thể",
    },
    {
      id: 7,
      name: "Nước hoa Thanh Tâm",
      price: 850000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Nước hoa",
    },
    {
      id: 8,
      name: "Mặt nạ dưỡng da",
      price: 150000,
      image: "/placeholder.svg?height=300&width=300",
      category: "Chăm sóc da",
    },
  ]

  useEffect(() => {
    // Bỏ kiểm tra đăng nhập
  }, [])

  if (isLoading) {
    return <div className="container py-8">Đang tải...</div>
  }

  // Filter products to only show those in the user's wishlist
  const wishlistProducts = allProducts.filter((product) => user?.wishlist.includes(product.id))

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sản phẩm yêu thích</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm yêu thích của bạn</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Heart className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Danh sách yêu thích trống</p>
              <p className="text-gray-500 mb-4">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
              <Link href="/products">
                <Button className="bg-pink-600 hover:bg-pink-700">Khám phá sản phẩm</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white text-red-600 hover:text-red-700 border-none"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium line-clamp-2 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="font-semibold">{formatCurrency(product.price)}</div>
                      <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
