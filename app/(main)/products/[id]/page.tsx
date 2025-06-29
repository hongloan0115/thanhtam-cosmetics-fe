"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { formatCurrency } from "@/lib/utils";
import { ProductService, Product } from "@/services/api/product";
import { CartService } from "@/services/api/carts";
import React from "react";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  // unwrap params nếu là Promise (Next.js App Router mới)
  const unwrappedParams =
    typeof params.then === "function" ? React.use(params) : params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Thêm state số lượng
  const [adding, setAdding] = useState(false); // Trạng thái loading khi thêm
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // State cho ảnh đang xem
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    ProductService.getById(unwrappedParams.id)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [unwrappedParams.id]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Các trường bổ sung không có trong API
  const extraFields = {
    rating: 4.8,
    reviewCount: 124,
    category: "Chăm sóc da",
    description:
      "Kem dưỡng ẩm Thanh Tâm giúp cung cấp độ ẩm sâu cho da, làm dịu da khô và kích ứng. Sản phẩm chứa các thành phần tự nhiên như chiết xuất lô hội, vitamin E và ceramide giúp tăng cường hàng rào bảo vệ da, giữ ẩm lâu dài và làm mềm da.",
    features: [
      "Cung cấp độ ẩm sâu cho da",
      "Làm dịu da khô và kích ứng",
      "Tăng cường hàng rào bảo vệ da",
      "Phù hợp với mọi loại da",
      "Không chứa paraben và hương liệu nhân tạo",
    ],
    specifications: {
      "Thương hiệu": "Thanh Tâm",
      "Xuất xứ": "Việt Nam",
      "Dung tích": "50ml",
      "Loại da phù hợp": "Mọi loại da",
      "Thành phần chính": "Chiết xuất lô hội, Vitamin E, Ceramide",
      "Hạn sử dụng": "36 tháng kể từ ngày sản xuất",
    },
    stock: 15,
    isNew: true,
  };

  // Sản phẩm liên quan mẫu (giữ nguyên)
  const relatedProducts = [
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
  ];

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center py-12 text-red-500">
          Không tìm thấy sản phẩm
        </div>
      </div>
    );
  }

  // Lấy danh sách ảnh từ API, fallback nếu không có
  const images =
    product.hinhAnh && product.hinhAnh.length > 0
      ? product.hinhAnh.map((img) => img.duongDan)
      : ["/placeholder.svg?height=600&width=600"];

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await CartService.addItem({
        maSanPham: product.maSanPham,
        soLuong: quantity,
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart:add"));
      }
      setNotification({
        type: "success",
        message: "Thêm vào giỏ hàng thành công!",
      });
    } catch (error: any) {
      const isNotAuthenticated =
        error?.response?.status === 401 ||
        error?.response?.data?.detail === "Not authenticated";
      if (isNotAuthenticated) {
        if (
          window.confirm(
            "Bạn cần đăng nhập để thêm vào giỏ hàng. Chuyển đến trang đăng nhập?"
          )
        ) {
          window.location.href = "/auth/login";
        }
      } else {
        setNotification({
          type: "error",
          message: "Thêm vào giỏ hàng thất bại!",
        });
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="container py-8">
      {notification && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
          <button
            className="float-right ml-4 text-lg font-bold"
            onClick={() => setNotification(null)}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}
      <Link
        href="/products"
        className="inline-flex items-center text-sm mb-6 hover:text-pink-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại danh sách sản phẩm
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-white disabled:opacity-50"
              onClick={() =>
                setSelectedImageIndex((idx) => Math.max(0, idx - 1))
              }
              disabled={selectedImageIndex === 0}
              aria-label="Ảnh trước"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <img
              src={images[selectedImageIndex]}
              alt={product.tenSanPham}
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow hover:bg-white disabled:opacity-50"
              onClick={() =>
                setSelectedImageIndex((idx) =>
                  Math.min(images.length - 1, idx + 1)
                )
              }
              disabled={selectedImageIndex === images.length - 1}
              aria-label="Ảnh sau"
            >
              <ArrowRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 ${
                  selectedImageIndex === index
                    ? "border-pink-600"
                    : "border-transparent"
                } hover:border-pink-600`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.tenSanPham} - Hình ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div>
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">
              {extraFields.category}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.tenSanPham}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(extraFields.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {extraFields.rating}
                </span>
              </div>
              <span className="mx-2 text-gray-300">·</span>
              <span className="text-sm text-gray-500">
                {extraFields.reviewCount} đánh giá
              </span>
            </div>

            <div className="text-2xl font-bold text-pink-600 mb-4">
              {formatCurrency(product.giaBan)}
            </div>

            <p className="text-gray-600 mb-6">{product.moTa}</p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-sm">
                <Truck className="h-5 w-5 mr-2 text-green-600" />
                <span>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
              </div>
              <div className="flex items-center text-sm">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="mr-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-1"
                >
                  Số lượng
                </label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={extraFields.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(extraFields.stock, Number(e.target.value))
                        )
                      )
                    }
                    className="h-9 w-12 border-y text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() =>
                      setQuantity((q) => Math.min(extraFields.stock, q + 1))
                    }
                    disabled={quantity >= extraFields.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tình trạng
                </label>
                <div className="text-sm font-medium text-green-600">
                  {product.trangThai
                    ? `Còn hàng (${product.soLuongTonKho} sản phẩm)`
                    : "Hết hàng"}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 flex-1"
                onClick={handleAddToCart}
                disabled={adding}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                className="border-pink-600 text-pink-600 hover:bg-pink-50"
              >
                <Heart className="mr-2 h-5 w-5" />
                Yêu thích
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Product details sections (no tabs) */}
      {/* <div className="mb-12 space-y-12">
        <section>
          <h2 className="text-xl font-bold mb-4">Mô tả</h2>
          <div className="prose max-w-none">
            <p>{extraFields.description}</p>
            <h3 className="text-lg font-medium mt-6 mb-4">Đặc điểm nổi bật</h3>
            <ul>
              {extraFields.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <h3 className="text-lg font-medium mt-6 mb-4">Hướng dẫn sử dụng</h3>
            <p>
              Lấy một lượng kem vừa đủ và thoa đều lên da mặt và cổ sau khi đã
              làm sạch và sử dụng toner. Vỗ nhẹ để kem thẩm thấu hoàn toàn vào
              da. Sử dụng hai lần mỗi ngày, sáng và tối.
            </p>
            <h3 className="text-lg font-medium mt-6 mb-4">Lưu ý</h3>
            <p>
              Tránh tiếp xúc với mắt. Nếu sản phẩm tiếp xúc với mắt, rửa sạch
              ngay bằng nước. Ngừng sử dụng nếu xuất hiện dấu hiệu kích ứng và
              tham khảo ý kiến bác sĩ.
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(extraFields.specifications).map(([key, value]) => (
              <div key={key} className="flex border-b py-2">
                <span className="font-medium w-40">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">
            Đánh giá ({extraFields.reviewCount})
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(extraFields.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {extraFields.rating} trên 5
                  </span>
                  <span className="mx-2 text-gray-300">·</span>
                  <span className="text-sm text-gray-500">
                    {extraFields.reviewCount} đánh giá
                  </span>
                </div>
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700">
                Viết đánh giá
              </Button>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">Nguyễn Thị Hương</div>
                    <div className="text-sm text-gray-500">12/03/2023</div>
                  </div>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 5
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Sản phẩm rất tốt, da tôi cảm thấy mềm mịn và đủ ẩm sau khi
                    sử dụng. Kết cấu kem nhẹ, thẩm thấu nhanh và không gây nhờn
                    rít. Sẽ tiếp tục mua lại!
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              Xem thêm đánh giá
            </Button>
          </div>
        </section>
      </div> */}

      {/* Related products */}
      {/* <div>
        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
