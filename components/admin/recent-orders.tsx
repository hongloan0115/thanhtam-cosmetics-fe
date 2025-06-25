"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OrderService } from "@/services/api/orders";

const statusStyles = {
  completed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  completed: "Hoàn thành",
  processing: "Đang xử lý",
  pending: "Chờ xác nhận",
  cancelled: "Đã hủy",
};

function mapStatus(status: string) {
  switch (status) {
    case "HOAN_THANH":
      return { label: statusLabels.completed, style: statusStyles.completed };
    case "DANG_XU_LY":
      return { label: statusLabels.processing, style: statusStyles.processing };
    case "CHO_XAC_NHAN":
      return { label: statusLabels.pending, style: statusStyles.pending };
    case "DA_HUY":
      return { label: statusLabels.cancelled, style: statusStyles.cancelled };
    default:
      return { label: status, style: "" };
  }
}

export function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    OrderService.getAllOrdersForAdmin()
      .then((data) => {
        setOrders(data || []);
        setTotalPages(Math.ceil((data?.length || 0) / pageSize) || 1);
      })
      .finally(() => setLoading(false));
  }, []);

  const pagedOrders = orders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Đơn hàng gần đây
        </CardTitle>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : pagedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không có đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              pagedOrders.map((order) => {
                const status = mapStatus(order.trangThai);
                return (
                  <TableRow key={order.maDonHang}>
                    <TableCell className="font-medium">
                      {order.maDonHang}
                    </TableCell>
                    <TableCell>
                      {order.hoTenNguoiNhan || order.khachHang || "-"}
                    </TableCell>
                    <TableCell>
                      {order.ngayDat
                        ? new Date(order.ngayDat).toLocaleDateString("vi-VN")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {order.tongTien?.toLocaleString("vi-VN") + "đ"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.style}>
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
