"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Eye,
  Filter,
  Calendar,
  Download,
  Printer,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  User,
  MapPin,
  CreditCard,
  FileText,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderService } from "@/services/api/orders";
import OrderDetailDialog from "./OrderDetailDialog";

// Define types based on API response
interface ApiOrder {
  maDonHang: number;
  maNguoiDung: number;
  diaChiChiTiet: string;
  tinhThanh: string;
  quanHuyen: string;
  phuongXa: string;
  maPhuongThuc: number;
  ghiChu?: string;
  tongTien: string;
  trangThai: string;
  nguoiDung: {
    maNguoiDung: number;
    tenNguoiDung?: string | null;
    hoTen?: string | null;
    soDienThoai?: string | null;
    email?: string | null;
    trangThai?: boolean;
  };
  ngayDat: string;
  phuongThucThanhToan: {
    tenPhuongThuc: string;
    moTa?: string;
    daKichHoat?: boolean | null;
    maPhuongThuc: number;
  };
  trangThaiThanhToan: string;
  // ...add more fields if needed...
}

// Normalized order for UI
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
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc" as "asc" | "desc",
  });
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const apiOrders: ApiOrder[] = await OrderService.getAllOrdersForAdmin();
        // Normalize data
        const normalizedOrders: Order[] = apiOrders.map((o) => ({
          id: o.maDonHang.toString(),
          customerId: o.maNguoiDung,
          date: o.ngayDat,
          status: o.trangThai,
          total: parseFloat(o.tongTien),
          shippingAddress: [
            o.diaChiChiTiet,
            o.phuongXa,
            o.quanHuyen,
            o.tinhThanh,
          ]
            .filter(Boolean)
            .join(", "),
          paymentMethod: o.phuongThucThanhToan?.tenPhuongThuc || "",
          paymentStatus: o.trangThaiThanhToan,
          notes: o.ghiChu,
          customer: {
            name:
              o.nguoiDung?.hoTen || o.nguoiDung?.tenNguoiDung || "Không rõ tên",
            email: o.nguoiDung?.email || "Không rõ email",
            phone: o.nguoiDung?.soDienThoai || "Không rõ SĐT",
          },
        }));
        setOrders(normalizedOrders);
      } catch (e) {
        setOrders([]);
      }
    }
    fetchOrders();
  }, []);

  // Stats for the dashboard cards
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "CHỜ XỬ LÝ"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "ĐANG XỬ LÝ"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "ĐANG GIAO"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "ĐÃ GIAO"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "ĐÃ HỦY"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "ĐÃ HỦY")
    .reduce((sum, order) => sum + order.total, 0);

  // Filtering, searching, sorting
  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate >= today;
          });
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.date);
            return orderDate >= monthAgo;
          });
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.shippingAddress
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortConfig.key === "total") {
        return sortConfig.direction === "asc"
          ? a.total - b.total
          : b.total - a.total;
      } else if (sortConfig.key === "customer") {
        const nameA = a.customer.name.toLowerCase();
        const nameB = b.customer.name.toLowerCase();
        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, orders, statusFilter, dateFilter, sortConfig]);

  // Helper functions
  const getUserName = (customerId: number) => {
    const order = orders.find((o) => o.customerId === customerId);
    return order?.customer.name || "Không rõ tên";
  };

  const getUserEmail = (customerId: number) => {
    const order = orders.find((o) => o.customerId === customerId);
    return order?.customer.email || "Không rõ email";
  };

  const getUserPhone = (customerId: number) => {
    const order = orders.find((o) => o.customerId === customerId);
    return order?.customer.phone || "Không rõ SĐT";
  };

  // Map API status to badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHỜ XỬ LÝ":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Chờ xử lý
          </Badge>
        );
      case "ĐANG XỬ LÝ":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Đang xử lý
          </Badge>
        );
      case "ĐANG GIAO":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" /> Đang giao
          </Badge>
        );
      case "ĐÃ GIAO":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Đã giao
          </Badge>
        );
      case "ĐÃ HỦY":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Map API status to text
  const getStatusText = (status: string) => {
    switch (status) {
      case "CHỜ XỬ LÝ":
        return "Chờ xử lý";
      case "ĐANG XỬ LÝ":
        return "Đang xử lý";
      case "ĐANG GIAO":
        return "Đang giao";
      case "ĐÃ GIAO":
        return "Đã giao";
      case "ĐÃ HỦY":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Map API payment method
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "VNPAY":
        return "Thanh toán trực tuyến qua cổng VNPAY";
      default:
        return method || "Chưa xác định";
    }
  };

  // Map API payment status
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "ĐÃ THANH TOÁN":
        return (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Đã thanh toán
          </span>
        );
      case "CHƯA THANH TOÁN":
        return (
          <span className="text-yellow-600 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Chưa thanh toán
          </span>
        );
      default:
        return status;
    }
  };

  // Handle status change (call API)
  const handleStatusChange = async (status: string) => {
    if (!currentOrder) return;
    setIsStatusUpdateLoading(true);
    try {
      await OrderService.updateOrderStatus(currentOrder.id, status);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === currentOrder.id ? { ...order, status } : order
        )
      );
      setCurrentOrder((prev) => (prev ? { ...prev, status } : prev));
    } finally {
      setIsStatusUpdateLoading(false);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setCurrentOrder(order);
    setIsViewDialogOpen(true);
  };

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

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortConfig.direction === "asc" ? (
      <ChevronDown className="h-4 w-4 ml-1 rotate-180" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  const printOrder = () => {
    if (!currentOrder) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Generate the print content
    const printContent = `
      <html>
        <head>
          <title>Đơn hàng #${currentOrder.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Thanh Tâm Cosmetics</h1>
            <h2>Đơn hàng #${currentOrder.id}</h2>
            <p>Ngày đặt: ${formatDate(currentOrder.date)}</p>
          </div>
          
          <div class="order-info">
            <h3>Thông tin đơn hàng</h3>
            <p><strong>Trạng thái đơn hàng:</strong> ${getStatusText(
              currentOrder.status
            )}</p>
            <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(
              currentOrder.paymentMethod
            )}</p>
          </div>
          
          <div class="customer-info">
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> ${getUserName(currentOrder.customerId)}</p>
            <p><strong>Email:</strong> ${getUserEmail(
              currentOrder.customerId
            )}</p>
            <p><strong>Số điện thoại:</strong> ${getUserPhone(
              currentOrder.customerId
            )}</p>
            <p><strong>Địa chỉ giao hàng:</strong> ${
              currentOrder.shippingAddress || "Chưa cung cấp"
            }</p>
          </div>
          
          <h3>Sản phẩm</h3>
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${currentOrder.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${formatCurrency(item.total)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="total">
            <p>Tổng tiền: ${formatCurrency(currentOrder.total)}</p>
          </div>
          
          <div class="footer">
            <p>Cảm ơn bạn đã mua hàng tại Thanh Tâm Cosmetics!</p>
            <p>Mọi thắc mắc xin liên hệ: support@thanhtamcosmetics.com | 0123 456 789</p>
          </div>
        </body>
      </html>
    `;

    // Write to the new window and print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Doanh thu: {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đơn chờ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <Badge
                variant="outline"
                className="ml-2 bg-yellow-100 text-yellow-800"
              >
                {totalOrders > 0
                  ? ((pendingOrders / totalOrders) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>
            <Button
              variant="ghost"
              className="text-xs p-0 h-auto mt-1 text-yellow-600 hover:text-yellow-800"
              onClick={() => setStatusFilter("pending")}
            >
              Xem tất cả
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang giao
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{shippedOrders}</div>
              <Badge
                variant="outline"
                className="ml-2 bg-purple-100 text-purple-800"
              >
                {totalOrders > 0
                  ? ((shippedOrders / totalOrders) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>
            <Button
              variant="ghost"
              className="text-xs p-0 h-auto mt-1 text-purple-600 hover:text-purple-800"
              onClick={() => setStatusFilter("shipped")}
            >
              Xem tất cả
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã giao
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{deliveredOrders}</div>
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800"
              >
                {totalOrders > 0
                  ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>
            <Button
              variant="ghost"
              className="text-xs p-0 h-auto mt-1 text-green-600 hover:text-green-800"
              onClick={() => setStatusFilter("delivered")}
            >
              Xem tất cả
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters, Search, Pagination wrapper */}
      <div>
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đang giao</SelectItem>
                <SelectItem value="delivered">Đã giao</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xuất dữ liệu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã đơn</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center">
                    Khách hàng
                    {getSortIcon("customer")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Ngày đặt
                    {getSortIcon("date")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Tổng tiền
                    {getSortIcon("total")}
                  </div>
                </TableHead>
                <TableHead>Trạng thái đơn hàng</TableHead>
                <TableHead>Trạng thái thanh toán</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Không tìm thấy đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{getUserName(order.customerId)}</span>
                        <span className="text-xs text-muted-foreground">
                          {getUserEmail(order.customerId)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {getPaymentStatusText(order.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewOrderDetails(order)}
                          className="opacity-70 group-hover:opacity-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-70 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => viewOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                viewOrderDetails(order);
                                setTimeout(
                                  () => handleStatusChange("processing"),
                                  100
                                );
                              }}
                              disabled={order.status !== "pending"}
                            >
                              <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />{" "}
                              Xử lý đơn hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                viewOrderDetails(order);
                                setTimeout(
                                  () => handleStatusChange("shipped"),
                                  100
                                );
                              }}
                              disabled={order.status !== "processing"}
                            >
                              <Truck className="h-4 w-4 mr-2 text-purple-500" />{" "}
                              Giao hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                viewOrderDetails(order);
                                setTimeout(
                                  () => handleStatusChange("delivered"),
                                  100
                                );
                              }}
                              disabled={order.status !== "shipped"}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />{" "}
                              Xác nhận đã giao
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                viewOrderDetails(order);
                                setTimeout(
                                  () => handleStatusChange("cancelled"),
                                  100
                                );
                              }}
                              disabled={
                                order.status === "delivered" ||
                                order.status === "cancelled"
                              }
                              className="text-red-500 focus:text-red-500"
                            >
                              <XCircle className="h-4 w-4 mr-2" /> Hủy đơn hàng
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredOrders.length > 0 ? 1 : 0}-{filteredOrders.length}{" "}
            của {filteredOrders.length} đơn hàng
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled>
              &lt;
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-pink-600 text-white"
            >
              1
            </Button>
            <Button variant="outline" size="icon">
              &gt;
            </Button>
          </nav>
        </div>
      </div>

      {/* View Order Dialog */}
      <OrderDetailDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        order={currentOrder}
        getStatusBadge={getStatusBadge}
        getUserName={getUserName}
        getUserEmail={getUserEmail}
        getUserPhone={getUserPhone}
        getPaymentMethodText={getPaymentMethodText}
        getPaymentStatusText={getPaymentStatusText}
        getStatusText={getStatusText}
        handleStatusChange={handleStatusChange}
        isStatusUpdateLoading={isStatusUpdateLoading}
        printOrder={printOrder}
      />
    </div>
  );
}
