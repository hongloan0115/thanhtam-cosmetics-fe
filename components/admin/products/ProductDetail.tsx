import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Bổ sung type Product (copy từ page.tsx hoặc định nghĩa lại)
export interface Product {
  maSanPham: number;
  tenSanPham: string;
  moTa?: string;
  giaBan: number;
  soLuongTonKho: number;
  giamGia?: number;
  trangThai: boolean;
  maDanhMuc: number;
  maThuongHieu?: number;
  ngayTao: string;
  ngayCapNhat: string;
  hinhAnh: {
    maHinhAnh: number;
    duongDanAnh: string;
    maAnhClound: string;
    moTa: string;
    laAnhChinh: number;
    maSanPham: number;
  }[];
}

interface ProductDetailProps {
  product: Product;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[]; // Thêm prop brands
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  categories,
  brands, // nhận prop brands
  onEdit,
  onDelete,
  onClose,
}) => {
  console.log("Product received:", product);
  // Lấy danh sách ảnh từ product.hinhAnh nếu có, fallback sang product.images (string[])
  let images: string[] = [];
  if (product.hinhAnh && product.hinhAnh.length > 0) {
    images = product.hinhAnh.map((img) => img.duongDan || img.duongDanAnh);
  }
  // Tìm ảnh chính
  const mainImage =
    (product.hinhAnh &&
      product.hinhAnh.find(
        (img) => img.laAnhChinh === 1 || img.laAnhChinh === true
      )?.duongDan) ||
    (product.hinhAnh &&
      product.hinhAnh.find(
        (img) => img.laAnhChinh === 1 || img.laAnhChinh === true
      )?.duongDanAnh) ||
    images[0] ||
    "/placeholder.svg?height=300&width=300";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <div>
        <div className="aspect-square overflow-hidden rounded-md bg-gray-100 mb-4">
          <img
            src={mainImage}
            alt={product.tenSanPham}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-md bg-gray-100"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.tenSanPham} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{product.tenSanPham}</h3>
          <div className="flex flex-col gap-1 mt-2">
            <div>
              <span className="text-xs text-gray-400 mr-1">Danh mục:</span>
              <span className="text-sm text-gray-700 font-medium">
                {categories.find((cat) => cat.id === Number(product.maDanhMuc))
                  ?.name || ""}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 mr-1">Thương hiệu:</span>
              <span className="text-sm text-gray-700 font-medium">
                {brands.find(
                  (brand) => brand.id === Number(product.maThuongHieu)
                )?.name || ""}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Giá</p>
            <p className="font-semibold text-lg text-pink-600">
              {formatCurrency(product.giaBan)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tồn kho</p>
            <p className="font-semibold">{product.soLuongTonKho}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trạng thái</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.trangThai === "ĐANG BÁN"
                  ? "bg-green-100 text-green-800"
                  : product.trangThai === "SẮP HẾT"
                  ? "bg-yellow-100 text-yellow-800"
                  : product.trangThai === "HẾT HÀNG"
                  ? "bg-red-100 text-red-800"
                  : product.trangThai === "SẮP VỀ"
                  ? "bg-blue-100 text-blue-800"
                  : product.trangThai === "NGỪNG BÁN"
                  ? "bg-gray-200 text-gray-600"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.trangThai}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Mô tả</p>
          <p className="text-sm">{product.moTa}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Ngày tạo</p>
            <p>
              {product.ngayTao
                ? new Date(product.ngayTao).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Cập nhật lần cuối</p>
            <p>
              {product.ngayCapNhat
                ? new Date(product.ngayCapNhat).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onClose();
              onDelete(product.maSanPham);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
