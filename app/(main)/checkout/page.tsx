"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  PaymentMethodService,
  PaymentMethod,
} from "@/services/api/payment-method";
import {
  OrderService,
  OrderCreate,
  OrderDetailCreate,
} from "@/services/api/orders";
import {
  AddressService,
  Province,
  District,
  Ward,
} from "@/services/api/address";
import { useAuth } from "@/components/auth-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  console.log("Current user:", user);

  // Lấy dữ liệu giỏ hàng từ localStorage nếu có, nếu không thì dùng mẫu
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("checkoutCartItems");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        setCartItems([]);
      }
    } else {
      // fallback mẫu nếu không có dữ liệu
      setCartItems([
        {
          id: 1,
          name: "Kem dưỡng ẩm Thanh Tâm",
          price: 450000,
          image: "/placeholder.svg?height=100&width=100",
          quantity: 1,
        },
        {
          id: 3,
          name: "Phấn nước Thanh Tâm",
          price: 550000,
          image: "/placeholder.svg?height=100&width=100",
          quantity: 2,
        },
      ]);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    paymentMethod: "cod",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    city: false,
    district: false,
    ward: false,
    phoneInvalid: false, // thêm trường kiểm tra định dạng số điện thoại
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

  // State cho địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    PaymentMethodService.getAll()
      .then((data) => {
        setPaymentMethods(data);
        // Nếu chưa chọn phương thức nào, chọn mặc định là phương thức đầu tiên
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            paymentMethod: data[0].maPhuongThuc.toString(),
          }));
        }
      })
      .finally(() => setLoadingPaymentMethods(false));
  }, []);

  // Load tỉnh/thành phố khi mount
  useEffect(() => {
    AddressService.getProvinces().then(setProvinces);
  }, []);

  // Khi chọn tỉnh/thành phố, load quận/huyện
  useEffect(() => {
    if (formData.city) {
      const selectedProvince = provinces.find(
        (p) => p.code.toString() === formData.city
      );
      if (selectedProvince) {
        AddressService.getDistrictsByProvince(selectedProvince.code).then(
          setDistricts
        );
      }
    } else {
      setDistricts([]);
      setWards([]);
    }
    setFormData((prev) => ({ ...prev, district: "", ward: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.city]);

  // Khi chọn quận/huyện, load phường/xã
  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = districts.find(
        (d) => d.code.toString() === formData.district
      );
      if (selectedDistrict) {
        AddressService.getWardsByDistrict(selectedDistrict.code).then(setWards);
      }
    } else {
      setWards([]);
    }
    setFormData((prev) => ({ ...prev, ward: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.district]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: false,
      });
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    });
  };

  // Hàm kiểm tra số điện thoại Việt Nam
  const isValidVietnamesePhone = (phone: string) => {
    // Bắt đầu bằng 0, theo sau là 9 hoặc 10 số
    return /^0\d{9,10}$/.test(phone);
  };

  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName,
      phone: !formData.phone,
      address: !formData.address,
      city: !formData.city,
      district: !formData.district,
      ward: !formData.ward,
      phoneInvalid: false,
    };

    // Kiểm tra định dạng số điện thoại nếu đã nhập
    if (formData.phone && !isValidVietnamesePhone(formData.phone)) {
      errors.phoneInvalid = true;
    }

    setFormErrors(errors);
    // Nếu có lỗi hoặc số điện thoại không hợp lệ thì trả về false
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Chuyển cartItems thành orderDetails đúng chuẩn API
    const orderDetails: OrderDetailCreate[] = cartItems.map((item) => ({
      maSanPham: item.id || item.sanPham?.maSanPham,
      soLuong: item.quantity || item.soLuong,
      donGia: item.price || item.sanPham?.giaBan,
      tongTien:
        (item.price || item.sanPham?.giaBan) *
        (item.quantity || item.soLuong || 1),
    }));

    // Đảm bảo đúng trường cho OrderCreate
    const order: OrderCreate = {
      maNguoiDung: user?.maNguoiDung ?? 1,
      diaChiChiTiet: formData.address,
      tinhThanh: formData.city,
      quanHuyen: formData.district,
      phuongXa: formData.ward,
      maPhuongThuc: Number(formData.paymentMethod),
      ghiChu: formData.notes,
      tongTien: subtotal + shipping,
      hoTenNguoiNhan: formData.fullName,
      soDienThoaiNguoiNhan: formData.phone,
    };

    try {
      const res = await OrderService.createOrder(order, orderDetails);
      // Nếu có payment_url (ví dụ VNPay), chuyển hướng tới đó
      if (res.payment_url) {
        window.location.href = res.payment_url;
      } else {
        // Nếu không, chuyển sang trang xác nhận
        localStorage.setItem("lastOrder", JSON.stringify(res));
        router.push("/checkout/confirmation");
      }
    } catch (err) {
      alert("Đặt hàng thất bại. Vui lòng thử lại!");
    }
  };

  // Tính toán lại subtotal, total dựa trên cartItems
  const subtotal = cartItems.reduce((total, item) => {
    // Nếu là dữ liệu từ API, dùng sanPham, nếu là mẫu thì dùng name/price/quantity
    if (item.sanPham) {
      return total + (item.sanPham.giaBan || 0) * item.soLuong;
    }
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);
  const shipping = 30000; // Fixed shipping cost
  const total = subtotal + shipping;

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm hover:text-pink-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại giỏ hàng
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-pink-600" />
                  Thông tin giao hàng
                </CardTitle>
                <CardDescription>
                  Vui lòng nhập thông tin giao hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={formErrors.fullName ? "border-red-500" : ""}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs">
                        Vui lòng nhập họ và tên
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={
                        formErrors.phone || formErrors.phoneInvalid
                          ? "border-red-500"
                          : ""
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Số điện thoại này sẽ được dùng để xác nhận đơn hàng với
                      bạn.
                    </p>
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs">
                        Vui lòng nhập số điện thoại
                      </p>
                    )}
                    {formErrors.phoneInvalid && (
                      <p className="text-red-500 text-xs">
                        Số điện thoại không hợp lệ (phải là số Việt Nam, bắt đầu
                        bằng 0, gồm 10 hoặc 11 số)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Địa chỉ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs">
                      Vui lòng nhập địa chỉ
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                          district: "",
                          ward: "",
                        }))
                      }
                      className={`w-full border rounded px-3 py-2 ${
                        formErrors.city ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.city && (
                      <p className="text-red-500 text-xs">
                        Vui lòng chọn tỉnh/thành phố
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          district: e.target.value,
                          ward: "",
                        }))
                      }
                      className={`w-full border rounded px-3 py-2 ${
                        formErrors.district ? "border-red-500" : ""
                      }`}
                      disabled={!formData.city}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.district && (
                      <p className="text-red-500 text-xs">
                        Vui lòng chọn quận/huyện
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">
                      Phường/Xã <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ward: e.target.value,
                        }))
                      }
                      className={`w-full border rounded px-3 py-2 ${
                        formErrors.ward ? "border-red-500" : ""
                      }`}
                      disabled={!formData.district}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.ward && (
                      <p className="text-red-500 text-xs">
                        Vui lòng chọn phường/xã
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-pink-600" />
                  Phương thức thanh toán
                </CardTitle>
                <CardDescription>
                  Chọn phương thức thanh toán phù hợp với bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPaymentMethods ? (
                  <div>Đang tải phương thức thanh toán...</div>
                ) : (
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className="space-y-4"
                  >
                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.maPhuongThuc}
                        className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:border-pink-600"
                      >
                        <RadioGroupItem
                          value={pm.maPhuongThuc.toString()}
                          id={`payment-${pm.maPhuongThuc}`}
                        />
                        <Label
                          htmlFor={`payment-${pm.maPhuongThuc}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">{pm.tenPhuongThuc}</div>
                          {pm.moTa && (
                            <div className="text-sm text-gray-500">
                              {pm.moTa}
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ghi chú đơn hàng</CardTitle>
                <CardDescription>
                  Thêm ghi chú hoặc yêu cầu đặc biệt cho đơn hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Thời gian giao hàng, hướng dẫn giao hàng..."
                  className="h-24"
                />
              </CardContent>
            </Card>
          </form>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
              <CardDescription>Tóm tắt đơn hàng và thanh toán</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id || item.maGioHang}
                    className="flex justify-between py-2 border-b"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 mr-3">
                        <img
                          src={
                            item.image ||
                            item.sanPham?.hinhAnh?.find(
                              (img: any) => img.laAnhChinh
                            )?.duongDan ||
                            item.sanPham?.hinhAnh?.[0]?.duongDan ||
                            "/placeholder.svg"
                          }
                          alt={
                            item.name || item.sanPham?.tenSanPham || "Sản phẩm"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">
                          {item.name || item.sanPham?.tenSanPham || "Sản phẩm"}
                        </div>
                        <div className="text-sm text-gray-500">
                          SL: {item.quantity || item.soLuong}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(
                        (item.price || item.sanPham?.giaBan || 0) *
                          (item.quantity || item.soLuong || 1)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-pink-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
                onClick={handleSubmit}
              >
                Đặt hàng
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
