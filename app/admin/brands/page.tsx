"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/auth-provider";
// Giả định đã có BrandService và ApiBrand
import { BrandService, Brand as ApiBrand } from "@/services/api/brands";

// Định nghĩa kiểu dữ liệu Brand
interface Brand {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface BrandForm {
  id?: number;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
  const [addBrandOpen, setAddBrandOpen] = useState(false);
  const [editBrandOpen, setEditBrandOpen] = useState(false);
  const [viewBrandOpen, setViewBrandOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [brandForm, setBrandForm] = useState<BrandForm>({
    name: "",
    description: "",
    status: "active",
  });
  const [viewingBrand, setViewingBrand] = useState<Brand | null>(null);
  const { user } = useAuth();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchBrands(page, limit);
    setSelectedBrands([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const filteredBrands = brands
    .filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const matchesStatus =
        statusFilter === "all" || brand.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "productCount") {
        return sortDirection === "asc"
          ? a.productCount - b.productCount
          : b.productCount - a.productCount;
      } else if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt);
      }
      return 0;
    });

  const handleDeleteClick = (brandId: number) => {
    setBrandToDelete(brandId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!user || !user.roles || !user.roles.includes("ADMIN")) {
      setNotification({
        type: "error",
        message: "Bạn không có quyền thực hiện chức năng này!",
      });
      return;
    }
    if (brandToDelete !== null) {
      try {
        await BrandService.delete(brandToDelete);
        setDeleteDialogOpen(false);
        setBrandToDelete(null);
        setNotification({
          type: "success",
          message: "Xóa thương hiệu thành công!",
        });
        try {
          await fetchBrands(page, limit);
        } catch (fetchError) {
          // eslint-disable-next-line no-console
          console.error("Lỗi khi reload danh sách thương hiệu:", fetchError);
        }
      } catch (error: any) {
        setDeleteDialogOpen(false);
        setBrandToDelete(null);
        const msg =
          error?.response?.data?.detail || "Xóa thương hiệu thất bại!";
        setNotification({ type: "error", message: msg });
      }
    }
  };

  const handleBulkDelete = () => {
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
    setSelectedBrands([]);
    setNotification({
      type: "success",
      message:
        "Đã xóa các thương hiệu đã chọn (chỉ trên giao diện, chưa gọi API)!",
    });
  };

  const handleAddBrand = () => {
    setBrandForm({
      name: "",
      description: "",
      status: "active",
    });
    setAddBrandOpen(true);
    setEditBrandOpen(false);
    setViewingBrand(null);
    setEditingBrand(null);
  };

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleEditBrand = (brand: Brand) => {
    setBrandForm({
      id: brand.id,
      name: brand.name,
      description: brand.description || "",
      status: brand.status,
    });
    setEditingBrand(brand);
    setEditBrandOpen(true);
    setAddBrandOpen(false);
    setViewingBrand(null);
  };

  const handleViewBrand = (brand: Brand) => {
    setViewingBrand(brand);
    setViewBrandOpen(true);
    setEditBrandOpen(false);
    setAddBrandOpen(false);
    setEditingBrand(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBrandForm({
      ...brandForm,
      [name]: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setBrandForm({
      ...brandForm,
      status: value as "active" | "inactive",
    });
  };

  const saveBrand = async () => {
    if (!user || !user.roles || !user.roles.includes("ADMIN")) {
      setNotification({
        type: "error",
        message: "Bạn không có quyền thực hiện chức năng này!",
      });
      return;
    }
    const payload: {
      tenThuongHieu?: string;
      moTa?: string;
      trangThai?: boolean;
    } = {};
    if (brandForm.name) payload.tenThuongHieu = brandForm.name;
    if (brandForm.description) payload.moTa = brandForm.description;
    if (brandForm.status) payload.trangThai = brandForm.status === "active";

    try {
      if (brandForm.id) {
        await BrandService.update(brandForm.id, payload);
        setNotification({
          type: "success",
          message: "Cập nhật thương hiệu thành công!",
        });
        await fetchBrands(page, limit);
        setEditBrandOpen(false);
        setViewingBrand(null);
        setEditingBrand(null);
      } else {
        await BrandService.create(
          payload as { tenThuongHieu: string; moTa: string; trangThai: boolean }
        );
        setNotification({
          type: "success",
          message: "Thêm thương hiệu thành công!",
        });
        await fetchBrands(page, limit);
        setAddBrandOpen(false);
        setViewingBrand(null);
        setEditingBrand(null);
      }
    } catch (error: any) {
      setAddBrandOpen(false);
      setEditBrandOpen(false);
      setViewingBrand(null);
      setEditingBrand(null);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Thao tác thất bại!";
      setNotification({ type: "error", message: msg });
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(filteredBrands.map((b) => b.id));
    }
  };

  const toggleSelectBrand = (brandId: number) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  const fetchBrands = async (pageParam = page, limitParam = limit) => {
    const response = await BrandService.getAllWithPaging(pageParam, limitParam);
    const data = response.data;
    setTotal(response.total ?? data.length);
    const mapped: Brand[] = Array.isArray(data)
      ? data.map((item: ApiBrand) => ({
          id: item.maThuongHieu,
          name: item.tenThuongHieu ?? "",
          description: item.moTa ?? "",
          productCount:
            typeof item.soLuongSanPham === "number" ? item.soLuongSanPham : 0,
          status: item.trangThai ? "active" : "inactive",
          createdAt: item.ngayTao
            ? new Date(item.ngayTao).toLocaleDateString("vi-VN")
            : "",
        }))
      : [];
    setBrands(mapped);
  };

  return (
    <div className="p-6 space-y-6">
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
        <Button
          className="bg-pink-600 hover:bg-pink-700"
          onClick={handleAddBrand}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm thương hiệu mới
        </Button>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Danh sách thương hiệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thương hiệu..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {selectedBrands.length > 0 && (
            <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
              <span className="text-sm">
                Đã chọn {selectedBrands.length} thương hiệu
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa đã chọn
              </Button>
            </div>
          )}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] text-center">
                    <Checkbox
                      checked={
                        selectedBrands.length === filteredBrands.length &&
                        filteredBrands.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[120px] text-center">ID</TableHead>
                  <TableHead
                    className="cursor-pointer text-center"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center justify-center">
                      Tên thương hiệu
                      {sortField === "name" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Mô tả</TableHead>
                  <TableHead
                    className="cursor-pointer text-center"
                    onClick={() => toggleSort("productCount")}
                  >
                    <div className="flex items-center justify-center">
                      Số sản phẩm
                      {sortField === "productCount" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead
                    className="cursor-pointer text-center"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="flex items-center justify-center">
                      Ngày tạo
                      {sortField === "createdAt" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không tìm thấy thương hiệu nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand) => (
                    <TableRow key={brand.id} className="hover:bg-muted/50">
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() => toggleSelectBrand(brand.id)}
                        />
                      </TableCell>
                      <TableCell className="text-center">{brand.id}</TableCell>
                      <TableCell className="font-medium text-center">
                        {brand.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-center">
                        {brand.description}
                      </TableCell>
                      <TableCell className="text-center">
                        {brand.productCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            brand.status === "active" ? "default" : "secondary"
                          }
                          className={
                            brand.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {brand.status === "active"
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {brand.createdAt}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewBrand(brand)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditBrand(brand)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(brand.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Xóa</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Hiển thị {(page - 1) * limit + (brands.length > 0 ? 1 : 0)}-
              {(page - 1) * limit + brands.length} của {total} thương hiệu
            </div>
            <nav className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </Button>
              <span className="px-2">{page}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={brands.length < limit}
                onClick={() => setPage((p) => p + 1)}
              >
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
            <DialogTitle>Xác nhận xóa thương hiệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thương hiệu này? Hành động này không thể
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
      {/* View Brand Dialog */}
      <Dialog open={viewBrandOpen} onOpenChange={setViewBrandOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết thương hiệu</DialogTitle>
          </DialogHeader>
          {viewingBrand && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    ID
                  </p>
                  <p className="font-medium text-base">{viewingBrand.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Trạng thái
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {viewingBrand.status === "active" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Đang hoạt động
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700 font-medium">
                          Không hoạt động
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Tên thương hiệu
                  </p>
                  <p className="font-medium text-base">{viewingBrand.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Số sản phẩm
                  </p>
                  <p className="font-medium">{viewingBrand.productCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Ngày tạo
                  </p>
                  <p className="font-medium">{viewingBrand.createdAt}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Mô tả
                  </p>
                  <p className="font-normal">{viewingBrand.description}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewBrandOpen(false)}>
              Đóng
            </Button>
            {viewingBrand && (
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => {
                  setViewBrandOpen(false);
                  handleEditBrand(viewingBrand);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Brand Dialog */}
      <Dialog open={addBrandOpen} onOpenChange={setAddBrandOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thương hiệu mới</DialogTitle>
            <DialogDescription>
              Điền thông tin thương hiệu mới vào form bên dưới.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên thương hiệu</Label>
              <Input
                id="name"
                name="name"
                value={brandForm.name}
                onChange={handleFormChange}
                placeholder="Nhập tên thương hiệu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={brandForm.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả thương hiệu"
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBrandOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={saveBrand}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={!brandForm.name}
            >
              Thêm thương hiệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Brand Dialog */}
      <Dialog open={editBrandOpen} onOpenChange={setEditBrandOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thương hiệu</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin thương hiệu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên thương hiệu</Label>
              <Input
                id="edit-name"
                name="name"
                value={brandForm.name}
                onChange={handleFormChange}
                placeholder="Nhập tên thương hiệu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={brandForm.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả thương hiệu"
                className="h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={brandForm.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBrandOpen(false)}>
              Hủy
            </Button>
            {editingBrand && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditBrandOpen(false);
                  setViewingBrand(editingBrand);
                  setViewBrandOpen(true);
                }}
              >
                Xem chi tiết
              </Button>
            )}
            <Button
              onClick={saveBrand}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={!brandForm.name}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
