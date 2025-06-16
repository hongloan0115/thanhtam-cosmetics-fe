import React, { ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, UploadCloud, X } from "lucide-react";

type Category = { id: number; name: string };
type ProductForm = {
  maSanPham?: number;
  tenSanPham: string;
  moTa: string;
  giaBan: number;
  soLuongTonKho: number;
  trangThai: boolean;
  maDanhMuc: number | null;
  maThuongHieu?: number | null; // Thêm trường này
  images: (File | string)[]; // Có thể là File hoặc object hoặc string
  featured: boolean;
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[]; // Thêm prop brands
  productForm: any;
  setProductForm: (form: any) => void;
  onSave: () => void;
  mode: "add" | "edit";
  onBrandChange: (value: string) => void; // Thêm prop onBrandChange
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onOpenChange,
  categories,
  brands,
  productForm,
  setProductForm,
  onSave,
  mode,
  onBrandChange,
}) => {
  // ...handlers giống như trong page.tsx...
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]:
        name === "giaBan" || name === "soLuongTonKho" ? Number(value) : value,
    });
  };

  console.log("ProductFormDialog - productForm:", productForm);

  const handleCategoryChange = (value: string) => {
    setProductForm({
      ...productForm,
      maDanhMuc: value ? Number(value) : null,
    });
  };

  const handleFeaturedChange = (checked: boolean) => {
    setProductForm({
      ...productForm,
      featured: checked,
    });
  };

  const handleAddImage = () => {
    document.getElementById("product-image-upload")?.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({
      ...productForm,
      images: newImages,
    });
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProductForm({
        ...productForm,
        images: [...productForm.images, ...files],
      });
    }
  };

  const handleBrandChange = (value: string) => {
    onBrandChange(value);
  };

  // Thêm handler cho trạng thái
  const handleStatusChange = (value: string) => {
    setProductForm({
      ...productForm,
      trangThai: value, // value sẽ là "ĐANG BÁN" hoặc "NGỪNG BÁN"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Điền thông tin sản phẩm mới vào form bên dưới."
              : "Chỉnh sửa thông tin sản phẩm."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Giữ lại phần tên sản phẩm */}
          <div className="space-y-2">
            <Label htmlFor={mode === "add" ? "name" : "edit-name"}>
              Tên sản phẩm
            </Label>
            <Input
              id={mode === "add" ? "name" : "edit-name"}
              name="tenSanPham"
              value={productForm.tenSanPham}
              onChange={handleFormChange}
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          {/* Danh mục và Thương hiệu trên cùng một hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={mode === "add" ? "category" : "edit-category"}>
                Danh mục
              </Label>
              <Select
                value={
                  productForm.maDanhMuc ? productForm.maDanhMuc.toString() : ""
                }
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={mode === "add" ? "brand" : "edit-brand"}>
                Thương hiệu
              </Label>
              <Select
                value={
                  productForm.maThuongHieu !== null &&
                  productForm.maThuongHieu !== undefined
                    ? productForm.maThuongHieu.toString()
                    : ""
                }
                onValueChange={handleBrandChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Giá và Số lượng tồn kho trên cùng một hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={mode === "add" ? "price" : "edit-price"}>
                Giá (VNĐ)
              </Label>
              <Input
                id={mode === "add" ? "price" : "edit-price"}
                name="giaBan"
                type="number"
                value={productForm.giaBan}
                onChange={handleFormChange}
                placeholder="Nhập giá sản phẩm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={mode === "add" ? "stock" : "edit-stock"}>
                Số lượng tồn kho
              </Label>
              <Input
                id={mode === "add" ? "stock" : "edit-stock"}
                name="soLuongTonKho"
                type="number"
                value={productForm.soLuongTonKho}
                onChange={handleFormChange}
                placeholder="Nhập số lượng tồn kho"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor={mode === "add" ? "description" : "edit-description"}
            >
              Mô tả sản phẩm
            </Label>
            <Textarea
              id={mode === "add" ? "description" : "edit-description"}
              name="moTa"
              value={productForm.moTa}
              onChange={handleFormChange}
              placeholder="Nhập mô tả sản phẩm"
              className="h-32"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={mode === "add" ? "featured" : "edit-featured"}
              checked={productForm.featured}
              onCheckedChange={handleFeaturedChange}
            />
            <label
              htmlFor={mode === "add" ? "featured" : "edit-featured"}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Đánh dấu là sản phẩm nổi bật
            </label>
          </div>
          {/* Thêm trạng thái khi chỉnh sửa */}
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <select
                id="edit-status"
                name="trangThai"
                className="border rounded-md px-3 py-2 w-full"
                value={productForm.trangThai || ""}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="ĐANG BÁN">Đang bán</option>
                <option value="NGỪNG BÁN">Ngừng bán</option>
              </select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Hình ảnh sản phẩm</Label>
            <div className="grid grid-cols-3 gap-2">
              {productForm.images.map((image: any, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={
                      image?.maHinhAnh
                        ? image?.duongDan // Sử dụng đúng trường trả về từ API
                        : image instanceof File
                        ? URL.createObjectURL(image)
                        : typeof image === "string"
                        ? image
                        : "/placeholder.svg"
                    }
                    alt={`Product ${index + 1}`}
                    className="h-20 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImage}
                className="h-20 w-full border border-dashed rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
            {/* Bỏ phần kéo thả hình ảnh vào đây */}
            {/* 
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                Kéo thả hình ảnh vào đây
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                hoặc nhấp để chọn file
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
                id="product-image-upload"
              />
              <label htmlFor="product-image-upload">
                <Button variant="outline" size="sm" asChild>
                  <span>Chọn file</span>
                </Button>
              </label>
            </div>
            */}
            {/* Thêm input file ẩn để chọn ảnh khi bấm nút thêm ảnh */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
              id="product-image-upload"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSave} className="bg-pink-600 hover:bg-pink-700">
            {mode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
