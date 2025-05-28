"use client";

import type React from "react";
import { ChangeEvent } from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Grid, List, Filter, Download } from "lucide-react";
import { ProductService } from "@/services/api/product";
import {
  CategoryService,
  Category as ApiCategory,
} from "@/services/api/category";
import { useAuth } from "@/components/auth-provider";
import type { Product, ProductForm } from "./types";
import ProductFormDialog from "../../../components/admin/products/ProductFormDialog";
import ProductTable from "../../../components/admin/products/ProductTable";
import ProductGrid from "../../../components/admin/products/ProductGrid";
import ProductDetail from "../../../components/admin/products/ProductDetail";

export default function AdminProducts() {
  // Sample data - in a real app, this would come from a database
  const [products, setProducts] = useState<Product[]>([]);

  // Lấy danh sách danh mục từ API
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [viewProductOpen, setViewProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [productForm, setProductForm] = useState<ProductForm>({
    tenSanPham: "",
    moTa: "",
    giaBan: 0,
    soLuongTonKho: 0,
    trangThai: true,
    maDanhMuc: null,
    images: [], // sẽ là File[] hoặc (File | string)[]
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { user } = useAuth();

  // Lấy dữ liệu sản phẩm từ API khi mount
  useEffect(() => {
    // Lấy danh mục
    CategoryService.getAll().then((data: ApiCategory[]) => {
      setCategories(
        data.map((cat) => ({
          id: cat.maDanhMuc,
          name: cat.tenDanhMuc,
        }))
      );
    });

    // Lấy sản phẩm
    ProductService.getAll().then((data: Product[]) => {
      const mapped = data.map((item) => ({
        ...item,
        images: item.hinhAnh && item.hinhAnh.length > 0 ? item.hinhAnh : [],
        featured: false,
        status: item.trangThai
          ? item.soLuongTonKho > 10
            ? "Còn hàng"
            : item.soLuongTonKho > 0
            ? "Sắp hết hàng"
            : "Hết hàng"
          : "Hết hàng",
        name: item.tenSanPham,
        price: item.giaBan,
        stock: item.soLuongTonKho,
        category: item.maDanhMuc,
        description: item.moTa,
        id: item.maSanPham,
        createdAt: new Date(item.ngayTao).toLocaleDateString("vi-VN"),
        updatedAt: new Date(item.ngayCapNhat).toLocaleDateString("vi-VN"),
      }));
      setProducts(mapped);
    });
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.moTa?.toLowerCase().includes(searchTerm.toLowerCase());
      // Sửa: so sánh với id danh mục
      const matchesCategory =
        categoryFilter === "all" ||
        String(product.category) === String(categoryFilter);
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.tenSanPham.localeCompare(b.tenSanPham)
          : b.tenSanPham.localeCompare(a.tenSanPham);
      } else if (sortBy === "price") {
        return sortOrder === "asc" ? a.giaBan - b.giaBan : b.giaBan - a.giaBan;
      } else if (sortBy === "stock") {
        return sortOrder === "asc"
          ? a.soLuongTonKho - b.soLuongTonKho
          : b.soLuongTonKho - a.soLuongTonKho;
      }
      return 0;
    });

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  // Hàm load lại danh sách sản phẩm (giúp đồng bộ danh mục)
  const reloadProducts = async () => {
    const data = await ProductService.getAll();
    setProducts(
      data.map((item) => ({
        ...item,
        images: item.hinhAnh && item.hinhAnh.length > 0 ? item.hinhAnh : [],
        featured: false,
        status: item.trangThai
          ? item.soLuongTonKho > 10
            ? "Còn hàng"
            : item.soLuongTonKho > 0
            ? "Sắp hết hàng"
            : "Hết hàng"
          : "Hết hàng",
        name: item.tenSanPham,
        price: item.giaBan,
        stock: item.soLuongTonKho,
        category: item.maDanhMuc,
        description: item.moTa,
        id: item.maSanPham,
        createdAt: new Date(item.ngayTao).toLocaleDateString("vi-VN"),
        updatedAt: new Date(item.ngayCapNhat).toLocaleDateString("vi-VN"),
      }))
    );
  };

  // Thêm sản phẩm sử dụng API, đảm bảo đúng quyền và dữ liệu backend yêu cầu
  const saveProduct = async () => {
    if (!user || !user.roles || !user.roles.includes("ADMIN")) {
      alert("Bạn không có quyền thực hiện chức năng này!");
      return;
    }

    const payload = {
      tenSanPham: productForm.tenSanPham,
      moTa: productForm.moTa,
      giaBan: productForm.giaBan,
      soLuongTonKho: productForm.soLuongTonKho,
      trangThai: productForm.trangThai,
      maDanhMuc: productForm.maDanhMuc,
    };

    try {
      if (productForm.maSanPham) {
        // keep_image_ids: lấy từ các object có maHinhAnh, chuyển thành string 'id1,id2,'
        const keep_image_ids =
          productForm.images
            .filter((img: any) => img && img.maHinhAnh)
            .map((img: any) => img.maHinhAnh)
            .join(",") +
          (productForm.images.some((img: any) => img && img.maHinhAnh)
            ? ","
            : "");

        // Ảnh mới là File
        const newImages = productForm.images.filter(
          (img: any) => img instanceof File
        ) as File[];

        await ProductService.update(productForm.maSanPham, {
          ...payload,
          keep_image_ids,
          images: newImages,
        });
        setEditProductOpen(false);
      } else {
        await ProductService.create({
          ...payload,
          images: productForm.images.filter(
            (img: any) => img instanceof File
          ) as File[],
        });
        setAddProductOpen(false);
      }
      await reloadProducts();
      setProductForm({ ...productForm, images: [] });
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu sản phẩm.");
    }
  };

  // Xóa sản phẩm sử dụng API, đảm bảo đúng quyền và backend
  const confirmDelete = async () => {
    if (!user || !user.roles || !user.roles.includes("ADMIN")) {
      alert("Bạn không có quyền thực hiện chức năng này!");
      return;
    }
    if (productToDelete !== null) {
      try {
        await ProductService.delete(productToDelete);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        await reloadProducts();
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa sản phẩm.");
      }
    }
  };

  const handleBulkDelete = () => {
    setProducts(
      products.filter(
        (product) => !selectedProducts.includes(product.maSanPham)
      )
    );
    setSelectedProducts([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleAddProduct = () => {
    setProductForm({
      tenSanPham: "",
      moTa: "",
      giaBan: 0,
      soLuongTonKho: 0,
      trangThai: true,
      maDanhMuc: null,
      images: [],
      featured: false,
    });
    setAddProductOpen(true);
  };

  const handleEditProduct = async (product: any) => {
    // Gọi API lấy chi tiết sản phẩm theo id
    const detail = await ProductService.getById(
      product.maSanPham || product.id
    );
    setProductForm({
      maSanPham: detail.maSanPham,
      tenSanPham: detail.tenSanPham,
      moTa: detail.moTa || "",
      giaBan: detail.giaBan,
      soLuongTonKho: detail.soLuongTonKho,
      trangThai: detail.trangThai && detail.soLuongTonKho > 0,
      maDanhMuc: detail.maDanhMuc ? Number(detail.maDanhMuc) : null,
      images: detail.hinhAnh && detail.hinhAnh.length > 0 ? detail.hinhAnh : [],
      featured: false, // hoặc lấy từ detail nếu có
    });
    setEditProductOpen(true);
  };

  const handleViewProduct = async (product: Product) => {
    // Gọi API lấy chi tiết sản phẩm theo id
    const detail = await ProductService.getById(product.maSanPham);
    // Map lại dữ liệu nếu cần (giống như khi load danh sách)
    const mapped = {
      ...detail,
      images:
        detail.hinhAnh && detail.hinhAnh.length > 0
          ? detail.hinhAnh.map((img) => img.duongDanAnh)
          : ["/placeholder.svg?height=200&width=200"],
      featured: false,
      status: detail.trangThai
        ? detail.soLuongTonKho > 10
          ? "Còn hàng"
          : detail.soLuongTonKho > 0
          ? "Sắp hết hàng"
          : "Hết hàng"
        : "Hết hàng",
      name: detail.tenSanPham,
      price: detail.giaBan,
      stock: detail.soLuongTonKho,
      // Sửa: category là id danh mục (number)
      category: detail.maDanhMuc,
      description: detail.moTa,
      id: detail.maSanPham,
      createdAt: new Date(detail.ngayTao).toLocaleDateString("vi-VN"),
      updatedAt: new Date(detail.ngayCapNhat).toLocaleDateString("vi-VN"),
    };
    setCurrentProduct(mapped);
    setViewProductOpen(true);
  };

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

  // Khi chọn danh mục ở filter, chỉ cập nhật tên danh mục (categoryFilter)
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
  };

  // Khi chọn danh mục ở form thêm/sửa, cập nhật mã danh mục (maDanhMuc)
  const handleCategoryChange = (value: string) => {
    // value là id dạng string
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

  // Xử lý chọn file ảnh
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProductForm({
        ...productForm,
        images: [...productForm.images, ...files],
      });
    }
  };

  const toggleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.maSanPham));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const exportProducts = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Xuất danh sách sản phẩm thành công!");
  };

  console.log("productForm:", productForm);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportProducts}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700"
            onClick={handleAddProduct}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={viewMode === "list" ? "bg-muted" : ""}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={viewMode === "grid" ? "bg-muted" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                className="border rounded-md px-3 py-2"
                value={categoryFilter}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-md px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Còn hàng">Còn hàng</option>
                <option value="Sắp hết hàng">Sắp hết hàng</option>
                <option value="Hết hàng">Hết hàng</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setFilterDialogOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <div className="bg-muted p-2 rounded-md mb-4 flex justify-between items-center">
              <span>{selectedProducts.length} sản phẩm đã chọn</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Bỏ chọn
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                >
                  Xóa đã chọn
                </Button>
              </div>
            </div>
          )}

          {viewMode === "list" ? (
            <ProductTable
              products={filteredProducts}
              categories={categories}
              selectedProducts={selectedProducts}
              toggleSelectAll={toggleSelectAll}
              toggleSelectProduct={toggleSelectProduct}
              setSortBy={setSortBy}
              toggleSortOrder={toggleSortOrder}
              handleViewProduct={handleViewProduct}
              handleEditProduct={handleEditProduct}
              handleDeleteClick={handleDeleteClick}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ) : (
            <ProductGrid
              products={filteredProducts}
              categories={categories}
              selectedProducts={selectedProducts}
              toggleSelectProduct={toggleSelectProduct}
              handleViewProduct={handleViewProduct}
              handleEditProduct={handleEditProduct}
              handleDeleteClick={handleDeleteClick}
            />
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Hiển thị 1-{filteredProducts.length} của {filteredProducts.length}{" "}
              sản phẩm
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
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete confirmation dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa nhiều sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {selectedProducts.length} sản phẩm đã
              chọn? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lọc nâng cao</DialogTitle>
            <DialogDescription>
              Tùy chỉnh các bộ lọc để tìm sản phẩm chính xác hơn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox id={`category-${category.id}`} />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Khoảng giá</Label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Từ" />
                <span>-</span>
                <Input type="number" placeholder="Đến" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  Còn hàng
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  Sắp hết hàng
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  Hết hàng
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tính năng</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <label htmlFor="featured" className="text-sm">
                  Sản phẩm nổi bật
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFilterDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={() => setFilterDialogOpen(false)}>Áp dụng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        categories={categories}
        productForm={productForm}
        setProductForm={setProductForm}
        onSave={saveProduct}
        mode="add"
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={editProductOpen}
        onOpenChange={setEditProductOpen}
        categories={categories}
        productForm={productForm}
        setProductForm={setProductForm}
        onSave={saveProduct}
        mode="edit"
      />

      {/* View Product Dialog */}
      <Dialog open={viewProductOpen} onOpenChange={setViewProductOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {currentProduct && (
            <ProductDetail
              product={currentProduct}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
              onClose={() => setViewProductOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
