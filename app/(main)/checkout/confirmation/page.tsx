"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { OrderService } from "@/services/api/orders";
import {
  AddressService,
  Province,
  District,
  Ward,
} from "@/services/api/address";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Lấy thông tin đơn hàng từ localStorage
    const savedOrder = localStorage.getItem("lastOrder");
    if (!savedOrder) {
      setLoading(false);
      return;
    }
    const localOrder = JSON.parse(savedOrder);
    // Nếu có mã đơn hàng, gọi API lấy chi tiết đơn hàng
    const fetchOrder = async () => {
      try {
        const orderId = localOrder.maDonHang || localOrder.id;
        if (orderId) {
          const apiOrder = await OrderService.getOrderById(orderId);
          setOrder(apiOrder);
        } else {
          setOrder(localOrder);
        }
      } catch (error) {
        setOrder(localOrder);
      }
      setLoading(false);
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    const fetchAddressNames = async () => {
      if (!order) return;
      try {
        if (order.tinhThanh) {
          const provinces = await AddressService.getProvinces();
          const foundProvince = provinces.find(
            (p) => p.code == order.tinhThanh
          );
          setProvinceName(foundProvince?.name || "");
        }
        if (order.quanHuyen) {
          const districts = await AddressService.getDistrictsByProvince(
            Number(order.tinhThanh)
          );
          const foundDistrict = districts.find(
            (d) => d.code == order.quanHuyen
          );
          setDistrictName(foundDistrict?.name || "");
        }
        if (order.phuongXa) {
          const wards = await AddressService.getWardsByDistrict(
            Number(order.quanHuyen)
          );
          const foundWard = wards.find((w) => w.code == order.phuongXa);
          setWardName(foundWard?.name || "");
        }
      } catch {}
    };
    fetchAddressNames();
  }, [order]);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Không tìm thấy thông tin đơn hàng
        </h1>
        <p className="mb-8">
          Có vẻ như bạn chưa hoàn tất đơn hàng hoặc thông tin đơn hàng đã bị
          mất.
        </p>
        <Link href="/products">
          <Button className="bg-pink-600 hover:bg-pink-700">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  // Tính ngày giao hàng dự kiến (5 ngày từ ngày đặt)
  // Giả sử backend trả về ngày đặt là order.ngayDat dạng yyyy-MM-dd hoặc dd/MM/yyyy

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang
            được xử lý.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Thông tin đơn hàng</CardTitle>
            <CardDescription>
              Mã đơn hàng: #{order.maDonHang || order.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-4">
              {/* Thông tin đơn hàng lên trước */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Package className="h-5 w-5 text-pink-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Thông tin đơn hàng</h3>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Ngày đặt:</span>{" "}
                    {(() => {
                      const dateStr = order.ngayDat || order.date;
                      if (!dateStr) return "";
                      const d = new Date(dateStr);
                      const pad = (n: number) => n.toString().padStart(2, "0");
                      return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(
                        d.getDate()
                      )}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
                    })()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Phương thức thanh toán:</span>{" "}
                    {order.phuongThucThanhToan?.moTa ||
                      order.phuongThucThanhToan?.tenPhuongThuc ||
                      "-"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Trạng thái thanh toán:</span>{" "}
                    {order.trangThaiThanhToan || "-"}
                  </p>
                </div>
              </div>
              {/* Thông tin giao hàng ở giữa */}
              <div className="flex flex-col flex-1 min-w-0 gap-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-pink-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Thông tin giao hàng</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Người nhận:</span>{" "}
                      {order.hoTenNguoiNhan ||
                        order.tenNguoiNhan ||
                        order.customer?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {order.soDienThoaiNguoiNhan ||
                        order.soDienThoai ||
                        order.customer?.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {order.diaChiChiTiet || order.customer?.address}
                      {provinceName || districtName || wardName ? ", " : ""}
                      {wardName ? `${wardName}, ` : ""}
                      {districtName ? `${districtName}, ` : ""}
                      {provinceName}
                    </p>
                  </div>
                </div>
              </div>
              {/* Thời gian giao hàng dự kiến ở cuối */}
              <div className="flex flex-col flex-1 min-w-0 gap-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-pink-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Thời gian giao hàng dự kiến</h3>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        const dateStr = order.ngayDat || order.date;
                        let orderDate;
                        if (dateStr?.includes("/")) {
                          orderDate = new Date(
                            dateStr.split("/").reverse().join("-")
                          );
                        } else {
                          orderDate = new Date(dateStr);
                        }
                        const deliveryDate = new Date(orderDate);
                        deliveryDate.setDate(deliveryDate.getDate() + 5);
                        return deliveryDate.toLocaleDateString("vi-VN");
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {(order.ghiChu || order.customer?.notes) && (
              <div className="border-t pt-3 mt-2">
                <div className="font-medium mb-1">Ghi chú đơn hàng</div>
                <p className="text-sm text-gray-600">
                  {order.ghiChu || order.customer?.notes}
                </p>
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
              {(order.chiTietDonHang || order.items)?.map((item: any) => (
                <div
                  key={item.maSanPham || item.id}
                  className="flex justify-between py-2 border-b"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 mr-4">
                      <img
                        src={
                          item.sanPham?.hinhAnh?.[0]?.duongDan ||
                          item.product?.hinhAnh ||
                          item.hinhAnh ||
                          item.image ||
                          "/placeholder.svg"
                        }
                        alt={
                          item.tenSanPham ||
                          item.sanPham?.tenSanPham ||
                          item.product?.tenSanPham ||
                          item.name
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">
                        {item.tenSanPham ||
                          item.sanPham?.tenSanPham ||
                          item.product?.tenSanPham ||
                          item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(item.donGia || item.price)} x{" "}
                        {item.soLuong || item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(
                      (item.donGia || item.price) *
                        (item.soLuong || item.quantity)
                    )}
                  </div>
                </div>
              ))}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>
                    {formatCurrency(
                      order.phiVanChuyen || order.shipping || 30000
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-pink-600">
                    {formatCurrency(order.tongTien || order.total)}
                  </span>
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
          <Button
            variant="outline"
            onClick={() => router.push("/account/orders")}
          >
            Theo dõi đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
