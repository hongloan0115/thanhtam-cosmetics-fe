import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, CreditCard, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import React from "react";

// ...types for Order, OrderItem...
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}
interface Order {
  id: string;
  customerId: number;
  date: string;
  status: string;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  shippingFee?: number;
  items?: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  hoTenNguoiNhan?: string;
  soDienThoaiNguoiNhan?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  getStatusBadge: (status: string) => React.ReactNode;
  getUserName: (customerId: number) => string;
  getUserEmail: (customerId: number) => string;
  getUserPhone: (customerId: number) => string;
  getPaymentMethodText: (method: string) => string;
  getPaymentStatusText: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
  handleStatusChange: (status: string) => void;
  isStatusUpdateLoading: boolean;
  printOrder: () => void;
}

export default function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  getStatusBadge,
  getUserName,
  getUserEmail,
  getUserPhone,
  getPaymentMethodText,
  getPaymentStatusText,
  getStatusText,
  handleStatusChange,
  isStatusUpdateLoading,
  printOrder,
}: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Chi tiết đơn hàng #{order?.id}</span>
            {order && getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>
        {order && (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Thông tin đơn hàng</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="timeline">Lịch sử đơn hàng</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      Thông tin khách hàng
                    </h3>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div>
                          <p className="font-medium">
                            {order.hoTenNguoiNhan ||
                              getUserName(order.customerId)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.soDienThoaiNguoiNhan ||
                              getUserPhone(order.customerId)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      Địa chỉ giao hàng
                    </h3>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm">
                          {order.shippingAddress ||
                            "Chưa cung cấp địa chỉ giao hàng"}
                        </p>
                        {order.notes && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">Ghi chú: </span>
                            {order.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      Thông tin thanh toán
                    </h3>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Phương thức thanh toán:
                          </span>
                          <span className="text-sm font-medium">
                            {getPaymentMethodText(order.paymentMethod)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Trạng thái thanh toán:
                          </span>
                          <span className="text-sm font-medium">
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      Tổng quan đơn hàng
                    </h3>
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Ngày đặt hàng:
                          </span>
                          <span className="text-sm font-medium">
                            {formatDate(order.date)}
                          </span>
                        </div>
                        {order.items && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Tổng sản phẩm:
                            </span>
                            <span className="text-sm font-medium">
                              {order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}
                            </span>
                          </div>
                        )}
                        {order.shippingFee !== undefined && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Tạm tính:
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(
                                  order.total - (order.shippingFee || 0)
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Phí vận chuyển:
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(order.shippingFee || 0)}
                              </span>
                            </div>
                          </>
                        )}
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Tổng cộng:</span>
                          <span className="text-lg">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-4 pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={item.productImage || "/placeholder.svg"}
                                alt={item.productName}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SKU:{" "}
                                  {item.productId.toString().padStart(8, "0")}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Không có sản phẩm
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  {order.shippingFee !== undefined && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính:</span>
                        <span>
                          {formatCurrency(
                            order.total - (order.shippingFee || 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Phí vận chuyển:
                        </span>
                        <span>{formatCurrency(order.shippingFee || 0)}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between font-medium">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 pt-4">
              <div className="relative pl-6 border-l-2 border-muted space-y-6 py-2">
                {/* Order created */}
                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-background border-2 border-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Đơn hàng được tạo</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </p>
                    <p className="text-sm">
                      Khách hàng {getUserName(order.customerId)} đã đặt hàng.
                    </p>
                  </div>
                </div>
                {/* ...timeline logic, adapt as needed... */}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={printOrder}>
              <Printer className="mr-2 h-4 w-4" />
              In đơn hàng
            </Button>
          </div>
          {/* ...actions for status change, pass as children or props if needed... */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
