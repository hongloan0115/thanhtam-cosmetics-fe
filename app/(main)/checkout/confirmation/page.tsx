"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Package, Truck, Calendar, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface OrderItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  ward: string
  paymentMethod: string
  notes?: string
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  customer: CustomerInfo
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the order from your API
    // For this demo, we'll use localStorage to simulate persistence
    const savedOrder = localStorage.getItem("lastOrder")
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đơn hàng</h1>
        <p className="mb-8">Có vẻ như bạn chưa hoàn tất đơn hàng hoặc thông tin đơn hàng đã bị mất.</p>
        <Link href="/products">
          <Button className="bg-pink-600 hover:bg-pink-700">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    )
  }

  // Calculate estimated delivery date (5 days from order date)
  const orderDate = new Date(order.date.split("/").reverse().join("-"))
  const deliveryDate = new Date(orderDate)
  deliveryDate.setDate(deliveryDate.getDate() + 5)
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("vi-VN")

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Thông tin đơn hàng</CardTitle>
            <CardDescription>Mã đơn hàng: {order.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Thông tin đơn hàng</h3>
                  <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
                  <p className="text-sm text-gray-500">
                    Phương thức thanh toán:{" "}
                    {order.customer.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.customer.paymentMethod === "bank"
                        ? "Chuyển khoản ngân hàng"
                        : "Thẻ tín dụng/Thẻ ghi nợ"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Thông tin giao hàng</h3>
                  <p className="text-sm text-gray-500">{order.customer.fullName}</p>
                  <p className="text-sm text-gray-500">{order.customer.phone}</p>
                  <p className="text-sm text-gray-500">
                    {order.customer.address}, {order.customer.ward}, {order.customer.district}, {order.customer.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Thời gian giao hàng dự kiến</h3>
                  <p className="text-sm text-gray-500">{formattedDeliveryDate}</p>
                </div>
              </div>
            </div>

            {order.customer.notes && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-1">Ghi chú đơn hàng</h3>
                <p className="text-sm text-gray-600">{order.customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Chi tiết sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 mr-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-pink-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="bg-pink-600 hover:bg-pink-700">
              Tiếp tục mua sắm
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline">Theo dõi đơn hàng</Button>
        </div>
      </div>
    </div>
  )
}
