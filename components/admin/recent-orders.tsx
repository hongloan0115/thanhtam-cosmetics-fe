"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Dữ liệu mẫu
const orders = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    date: "23/05/2023",
    total: "1,250,000đ",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    date: "22/05/2023",
    total: "850,000đ",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    date: "21/05/2023",
    total: "2,100,000đ",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    date: "20/05/2023",
    total: "750,000đ",
    status: "pending",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    date: "19/05/2023",
    total: "1,500,000đ",
    status: "completed",
  },
]

const statusStyles = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  completed: "Hoàn thành",
  processing: "Đang xử lý",
  pending: "Chờ xác nhận",
  cancelled: "Đã hủy",
}

export function RecentOrders() {
  const [page, setPage] = useState(1)
  const totalPages = 3 // Giả sử có 3 trang

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base font-medium">Đơn hàng gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[order.status as keyof typeof statusStyles]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
