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
  Upload,
  X,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CategoryService,
  Category as ApiCategory,
} from "@/services/api/category";
import { useAuth } from "@/components/auth-provider";

// Define category type
interface Category {
  id: string;
  name: string;
  description?: string;
  // image?: string; // Bỏ image
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

// Define form type
interface CategoryForm {
  id?: string;
  name: string;
  description: string;
  // image: string; // Bỏ image
  status: "active" | "inactive";
}

export default function AdminCategories() {
  // Sample data - in a real app, this would come from a database
  const [categories, setCategories] = useState<Category[]>([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [viewCategoryOpen, setViewCategoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: "",
    description: "",
    // image: "",
    status: "active",
  });

  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const { user } = useAuth();

  // Lấy dữ liệu từ API khi mount
  useEffect(() => {
    CategoryService.getAll().then((data: ApiCategory[]) => {
      // Map dữ liệu từ API về định dạng Category cho bảng
      const mapped = data.map((item) => ({
        id: item.maDanhMuc.toString(),
        name: item.tenDanhMuc,
        description: item.moTa,
        image: "", // Nếu API có trường ảnh thì map vào đây
        productCount: 0, // Nếu API có trường số sản phẩm thì map vào đây
        status: item.trangThai ? "active" : "inactive",
        createdAt: new Date(item.ngayTao).toLocaleDateString("vi-VN"),
      }));
      setCategories(mapped);
    });
  }, []);

  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => {
      // Apply search filter
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        false;

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "productCount") {
        return sortDirection === "asc"
          ? a.productCount - b.productCount
          : b.productCount - a.productCount;
      } else if (sortField === "createdAt") {
        // Simple date comparison for demo purposes
        return sortDirection === "asc"
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt);
      }
      return 0;
    });

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  // Xóa danh mục sử dụng API, đảm bảo đúng quyền và backend
  const confirmDelete = async () => {
    if (!user || !user.roles || !user.roles.includes("ADMIN")) {
      alert("Bạn không có quyền thực hiện chức năng này!");
      return;
    }
    if (categoryToDelete !== null) {
      await CategoryService.delete(categoryToDelete);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      await fetchCategories();
    }
  };

  const handleBulkDelete = () => {
    if (selectedCategories.length > 0) {
      setCategories(
        categories.filter(
          (category) => !selectedCategories.includes(category.id)
        )
      );
      setSelectedCategories([]);
    }
  };

  const handleAddCategory = () => {
    setCategoryForm({
      name: "",
      description: "",
      // image: "",
      status: "active",
    });
    setAddCategoryOpen(true);
  };

  // Thêm biến để lưu category đang chỉnh sửa trước khi mở dialog edit
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      // image: category.image || "",
      status: category.status,
    });
    setEditingCategory(category); // Lưu lại category đang chỉnh sửa
    setEditCategoryOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setViewingCategory(category);
    setViewCategoryOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setCategoryForm({
      ...categoryForm,
      status: value as "active" | "inactive",
    });
  };

  // Thêm hoặc sửa danh mục sử dụng API, đảm bảo đúng dữ liệu backend yêu cầu
  const saveCategory = async () => {
    if (!user || !user.roles || !user.roles.includes("ADMIN")) {
      alert("Bạn không có quyền thực hiện chức năng này!");
      return;
    }
    // Chuẩn hóa dữ liệu gửi đi đúng với backend (chỉ gửi các trường backend yêu cầu)
    const payload: { tenDanhMuc?: string; moTa?: string } = {};
    if (categoryForm.name) payload.tenDanhMuc = categoryForm.name;
    if (categoryForm.description) payload.moTa = categoryForm.description;

    if (categoryForm.id) {
      // Sửa danh mục
      await CategoryService.update(categoryForm.id, payload);
    } else {
      // Thêm danh mục
      await CategoryService.create(
        payload as { tenDanhMuc: string; moTa: string }
      );
    }
    setAddCategoryOpen(false);
    setEditCategoryOpen(false);
    await fetchCategories();
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
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((cat) => cat.id));
    }
  };

  const toggleSelectCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Đảm bảo fetchCategories dùng lại khi cần reload danh sách
  const fetchCategories = async () => {
    const data = await CategoryService.getAll();
    const mapped = data.map((item: ApiCategory) => ({
      id: item.maDanhMuc.toString(),
      name: item.tenDanhMuc,
      description: item.moTa,
      image: "",
      productCount: 0,
      status: item.trangThai ? "active" : "inactive",
      createdAt: new Date(item.ngayTao).toLocaleDateString("vi-VN"),
    }));
    setCategories(mapped);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Button
          className="bg-pink-600 hover:bg-pink-700"
          onClick={handleAddCategory}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm danh mục mới
        </Button>
      </div>

      {/* Bỏ Tabs và TabsList, chỉ giữ phần table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Danh sách danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục..."
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

          {selectedCategories.length > 0 && (
            <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
              <span className="text-sm">
                Đã chọn {selectedCategories.length} danh mục
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
                        selectedCategories.length ===
                          filteredCategories.length &&
                        filteredCategories.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[120px] text-center">Mã</TableHead>
                  <TableHead
                    className="cursor-pointer text-center"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center justify-center">
                      Tên danh mục
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
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không tìm thấy danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-muted/50">
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() =>
                            toggleSelectCategory(category.id)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {category.id}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {category.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-center">
                        {category.description}
                      </TableCell>
                      <TableCell className="text-center">
                        {category.productCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            category.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            category.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {category.status === "active"
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {category.createdAt}
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
                              onClick={() => handleViewCategory(category)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(category.id)}
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
              Hiển thị {filteredCategories.length > 0 ? 1 : 0}-
              {filteredCategories.length} của {filteredCategories.length} danh
              mục
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
            <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể
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

      {/* View Category Dialog */}
      <Dialog open={viewCategoryOpen} onOpenChange={setViewCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết danh mục</DialogTitle>
          </DialogHeader>

          {viewingCategory && (
            <div className="space-y-6 py-4">
              {/* Bỏ hình ảnh, chỉ hiển thị thông tin dạng grid đẹp hơn */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Mã danh mục
                  </p>
                  <p className="font-medium text-base">{viewingCategory.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Trạng thái
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {viewingCategory.status === "active" ? (
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
                    Tên danh mục
                  </p>
                  <p className="font-medium text-base">
                    {viewingCategory.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Số sản phẩm
                  </p>
                  <p className="font-medium">{viewingCategory.productCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Ngày tạo
                  </p>
                  <p className="font-medium">{viewingCategory.createdAt}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Mô tả
                  </p>
                  <p className="font-normal">{viewingCategory.description}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewCategoryOpen(false)}
            >
              Đóng
            </Button>
            {viewingCategory && (
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => {
                  setViewCategoryOpen(false);
                  handleEditCategory(viewingCategory);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm danh mục mới</DialogTitle>
            <DialogDescription>
              Điền thông tin danh mục mới vào form bên dưới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục</Label>
              <Input
                id="name"
                name="name"
                value={categoryForm.name}
                onChange={handleFormChange}
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                value={categoryForm.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả danh mục"
                className="h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={categoryForm.status}
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
            {/* Bỏ phần hình ảnh danh mục */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={saveCategory}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={!categoryForm.name}
            >
              Thêm danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin danh mục.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên danh mục</Label>
              <Input
                id="edit-name"
                name="name"
                value={categoryForm.name}
                onChange={handleFormChange}
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={categoryForm.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả danh mục"
                className="h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select
                value={categoryForm.status}
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
            {/* Bỏ phần hình ảnh danh mục */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditCategoryOpen(false)}
            >
              Hủy
            </Button>
            {/* Nút quay lại xem chi tiết */}
            {editingCategory && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditCategoryOpen(false);
                  setViewingCategory(editingCategory);
                  setViewCategoryOpen(true);
                }}
              >
                Xem chi tiết
              </Button>
            )}
            <Button
              onClick={saveCategory}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={!categoryForm.name}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
