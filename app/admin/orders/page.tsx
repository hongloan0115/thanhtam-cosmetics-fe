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

// Sample data interfaces
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  customerId: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: "paid" | "unpaid";
  shippingFee: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0912345678",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    email: "levancuong@email.com",
    phone: "0923456789",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    email: "phamthidung@email.com",
    phone: "0934567890",
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "hoangvanem@email.com",
    phone: "0945678901",
  },
];

const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: 1,
    date: "2024-01-15T10:30:00Z",
    status: "delivered",
    total: 1250000,
    shippingFee: 30000,
    paymentMethod: "cod",
    paymentStatus: "paid",
    shippingAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    trackingNumber: "TT123456789",
    estimatedDelivery: "2024-01-20",
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Kem dưỡng ẩm Thanh Tâm",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 450000,
        total: 450000,
      },
      {
        id: 2,
        productId: 3,
        productName: "Phấn nước Thanh Tâm",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 550000,
        total: 550000,
      },
      {
        id: 3,
        productId: 4,
        productName: "Son lì Thanh Tâm",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 250000,
        total: 250000,
      },
    ],
  },
  {
    id: "ORD-002",
    customerId: 2,
    date: "2024-01-14T14:20:00Z",
    status: "shipped",
    total: 850000,
    shippingFee: 30000,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    shippingAddress: "456 Lê Lợi, Quận 3, TP.HCM",
    trackingNumber: "TT987654321",
    estimatedDelivery: "2024-01-18",
    items: [
      {
        id: 4,
        productId: 2,
        productName: "Serum Vitamin C",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 650000,
        total: 650000,
      },
      {
        id: 5,
        productId: 8,
        productName: "Mặt nạ dưỡng da",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 200000,
        total: 200000,
      },
    ],
  },
  {
    id: "ORD-003",
    customerId: 3,
    date: "2024-01-13T09:15:00Z",
    status: "processing",
    total: 550000,
    shippingFee: 30000,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    shippingAddress: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
    estimatedDelivery: "2024-01-17",
    items: [
      {
        id: 6,
        productId: 3,
        productName: "Phấn nước Thanh Tâm",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 550000,
        total: 550000,
      },
    ],
  },
  {
    id: "ORD-004",
    customerId: 4,
    date: "2024-01-12T16:45:00Z",
    status: "pending",
    total: 750000,
    shippingFee: 30000,
    paymentMethod: "momo",
    paymentStatus: "unpaid",
    shippingAddress: "321 Võ Văn Tần, Quận 3, TP.HCM",
    items: [
      {
        id: 7,
        productId: 1,
        productName: "Kem dưỡng ẩm Thanh Tâm",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 450000,
        total: 450000,
      },
      {
        id: 8,
        productId: 4,
        productName: "Son lì Thanh Tâm",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 1,
        price: 300000,
        total: 300000,
      },
    ],
  },
  {
    id: "ORD-005",
    customerId: 5,
    date: "2024-01-11T11:30:00Z",
    status: "cancelled",
    total: 1200000,
    shippingFee: 30000,
    paymentMethod: "cod",
    paymentStatus: "unpaid",
    shippingAddress: "654 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    items: [
      {
        id: 9,
        productId: 2,
        productName: "Serum Vitamin C",
        productImage: "/placeholder.svg?height=50&width=50",
        quantity: 2,
        price: 650000,
        total: 1300000,
      },
    ],
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [customers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc" as "asc" | "desc",
  });
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);

  // Stats for the dashboard cards
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;
  const shippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply date filter
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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getUserName(order.customerId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.shippingAddress
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
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
        const nameA = getUserName(a.customerId).toLowerCase();
        const nameB = getUserName(b.customerId).toLowerCase();
        return sortConfig.direction === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    setFilteredOrders(filtered);
  }, [searchTerm, orders, statusFilter, dateFilter, sortConfig]);

  const getUserName = (customerId: number) => {
    const customer = customers.find((customer) => customer.id === customerId);
    return customer ? customer.name : "Khách hàng không xác định";
  };

  const getUserEmail = (customerId: number) => {
    const customer = customers.find((customer) => customer.id === customerId);
    return customer ? customer.email : "Email không xác định";
  };

  const getUserPhone = (customerId: number) => {
    const customer = customers.find((customer) => customer.id === customerId);
    return customer ? customer.phone || "Chưa cung cấp" : "SĐT không xác định";
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Chờ xử lý
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Đang xử lý
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" /> Đang giao
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Đã giao
          </Badge>
        );
      case "cancelled":
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

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "credit_card":
        return "Thẻ tín dụng/ghi nợ";
      case "momo":
        return "Ví MoMo";
      case "zalopay":
        return "ZaloPay";
      default:
        return method || "Chưa xác định";
    }
  };

  const handleStatusChange = async (status: Order["status"]) => {
    if (!currentOrder) return;

    setIsStatusUpdateLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedOrder = { ...currentOrder, status };
      const updatedOrders = orders.map((order) =>
        order.id === currentOrder.id ? updatedOrder : order
      );

      setOrders(updatedOrders);
      setCurrentOrder(updatedOrder);
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
            <p><strong>Trạng thái:</strong> ${getStatusText(
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 max-w-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Trạng thái" />
              </div>
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
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Thời gian" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
            </SelectContent>
          </Select>

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
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Chi tiết đơn hàng #{currentOrder?.id}</span>
              {currentOrder && getStatusBadge(currentOrder.status)}
            </DialogTitle>
          </DialogHeader>
          {currentOrder && (
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
                              {getUserName(currentOrder.customerId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getUserEmail(currentOrder.customerId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getUserPhone(currentOrder.customerId)}
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
                            {currentOrder.shippingAddress ||
                              "Chưa cung cấp địa chỉ giao hàng"}
                          </p>
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
                              {getPaymentMethodText(currentOrder.paymentMethod)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Trạng thái thanh toán:
                            </span>
                            <span className="text-sm font-medium">
                              {currentOrder.paymentStatus === "paid" ? (
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" /> Đã thanh
                                  toán
                                </span>
                              ) : (
                                <span className="text-yellow-600 flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Chưa thanh toán
                                </span>
                              )}
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
                              {formatDate(currentOrder.date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Tổng sản phẩm:
                            </span>
                            <span className="text-sm font-medium">
                              {currentOrder.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Tạm tính:
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(
                                currentOrder.total - currentOrder.shippingFee
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Phí vận chuyển:
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(currentOrder.shippingFee)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Tổng cộng:</span>
                            <span className="text-lg">
                              {formatCurrency(currentOrder.total)}
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
                      {currentOrder.items.map((item) => (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính:</span>
                      <span>
                        {formatCurrency(
                          currentOrder.total - currentOrder.shippingFee
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển:
                      </span>
                      <span>{formatCurrency(currentOrder.shippingFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng:</span>
                      <span>{formatCurrency(currentOrder.total)}</span>
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
                        {formatDate(currentOrder.date)}
                      </p>
                      <p className="text-sm">
                        Khách hàng {getUserName(currentOrder.customerId)} đã đặt
                        hàng.
                      </p>
                    </div>
                  </div>

                  {/* Order status changes - dynamically generated based on order history */}
                  {currentOrder.status !== "pending" && (
                    <div className="relative">
                      <div className="absolute -left-[25px] p-1 rounded-full bg-background border-2 border-blue-200">
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Đơn hàng đang được xử lý</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(
                            new Date(
                              new Date(currentOrder.date).getTime() +
                                1000 * 60 * 60
                            ).toISOString()
                          )}
                        </p>
                        <p className="text-sm">
                          Đơn hàng của bạn đang được chuẩn bị.
                        </p>
                      </div>
                    </div>
                  )}

                  {(currentOrder.status === "shipped" ||
                    currentOrder.status === "delivered") && (
                    <div className="relative">
                      <div className="absolute -left-[25px] p-1 rounded-full bg-background border-2 border-purple-200">
                        <Truck className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Đơn hàng đang được giao</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(
                            new Date(
                              new Date(currentOrder.date).getTime() +
                                1000 * 60 * 60 * 24
                            ).toISOString()
                          )}
                        </p>
                        <p className="text-sm">
                          Đơn hàng đã được giao cho đơn vị vận chuyển.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentOrder.status === "delivered" && (
                    <div className="relative">
                      <div className="absolute -left-[25px] p-1 rounded-full bg-background border-2 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">
                          Đơn hàng đã giao thành công
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(
                            new Date(
                              new Date(currentOrder.date).getTime() +
                                1000 * 60 * 60 * 24 * 3
                            ).toISOString()
                          )}
                        </p>
                        <p className="text-sm">
                          Đơn hàng đã được giao thành công cho khách hàng.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentOrder.status === "cancelled" && (
                    <div className="relative">
                      <div className="absolute -left-[25px] p-1 rounded-full bg-background border-2 border-red-200">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Đơn hàng đã bị hủy</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(
                            new Date(
                              new Date(currentOrder.date).getTime() +
                                1000 * 60 * 60 * 2
                            ).toISOString()
                          )}
                        </p>
                        <p className="text-sm">Đơn hàng đã bị hủy.</p>
                      </div>
                    </div>
                  )}
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

            {currentOrder && (
              <div className="flex flex-wrap gap-2">
                {currentOrder.status === "pending" && (
                  <Button
                    onClick={() => handleStatusChange("processing")}
                    disabled={isStatusUpdateLoading}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isStatusUpdateLoading ? (
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Xử lý đơn hàng
                      </div>
                    )}
                  </Button>
                )}

                {currentOrder.status === "processing" && (
                  <Button
                    onClick={() => handleStatusChange("shipped")}
                    disabled={isStatusUpdateLoading}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    {isStatusUpdateLoading ? (
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Truck className="mr-2 h-4 w-4" />
                        Giao hàng
                      </div>
                    )}
                  </Button>
                )}

                {currentOrder.status === "shipped" && (
                  <Button
                    onClick={() => handleStatusChange("delivered")}
                    disabled={isStatusUpdateLoading}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isStatusUpdateLoading ? (
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Xác nhận đã giao
                      </div>
                    )}
                  </Button>
                )}

                {(currentOrder.status === "pending" ||
                  currentOrder.status === "processing") && (
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={isStatusUpdateLoading}
                  >
                    {isStatusUpdateLoading ? (
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4" />
                        Hủy đơn hàng
                      </div>
                    )}
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
