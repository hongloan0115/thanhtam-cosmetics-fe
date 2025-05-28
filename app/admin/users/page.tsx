"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, UserPlus, List, Grid, Search, Filter } from "lucide-react";
import UserStatsCards from "../../../components/admin/users/UserStatsCards";
import UserTable from "../../../components/admin/users/UserTable";
import UserGrid from "../../../components/admin/users/UserGrid";
import UserDialogs from "../../../components/admin/users/UserDialogs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserService, User as ApiUser } from "@/services/api/users";

// Define user type
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  orders?: number;
  totalSpent?: number;
}

// Define form type
interface UserForm {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  password?: string;
  confirmPassword?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    setLoading(true);
    setError(null);
    UserService.getAll()
      .then((apiUsers) => {
        // Chuyển đổi dữ liệu từ API sang định dạng UI
        const mappedUsers: User[] = apiUsers.map((u) => ({
          id: u.maNguoiDung,
          name: u.tenNguoiDung || u.hoTen || "Chưa đặt tên",
          email: u.email,
          phone: u.soDienThoai || "",
          role:
            u.vaiTro && u.vaiTro.length > 0
              ? u.vaiTro[0].tenVaiTro
              : "Khách hàng",
          status: u.trangThai ? "Hoạt động" : "Bị khóa",
          avatar: "/placeholder.svg?height=40&width=40",
          lastLogin: "", // Nếu API có trường này thì map vào
          createdAt: "", // Nếu API có trường này thì map vào
          orders: 0, // Nếu API có trường này thì map vào
          totalSpent: 0, // Nếu API có trường này thì map vào
        }));
        setUsers(mappedUsers);
      })
      .catch((err) => {
        setError("Không thể tải danh sách người dùng");
      })
      .finally(() => setLoading(false));
  }, []);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [userForm, setUserForm] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
    role: "Khách hàng",
    status: "Hoạt động",
    password: "",
    confirmPassword: "",
  });

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm));
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "createdAt") {
        // Simple date comparison for demo purposes
        return sortOrder === "asc"
          ? a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt);
      } else if (sortBy === "orders") {
        return sortOrder === "asc"
          ? (a.orders || 0) - (b.orders || 0)
          : (b.orders || 0) - (a.orders || 0);
      }
      return 0;
    });

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete !== null) {
      setUsers(users.filter((user) => user.id !== userToDelete));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleAddUser = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "Khách hàng",
      status: "Hoạt động",
      password: "",
      confirmPassword: "",
    });
    setAddUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserForm({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
    });
    setEditUserOpen(true);
  };

  const handleViewUser = (user: User) => {
    setCurrentUser(user);
    setViewUserOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setCurrentUser(user);
    setUserForm({
      ...userForm,
      id: user.id,
      password: "",
      confirmPassword: "",
    });
    setResetPasswordOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setUserForm({
      ...userForm,
      role: value,
    });
  };

  const handleStatusChange = (value: string) => {
    setUserForm({
      ...userForm,
      status: value,
    });
  };

  const saveUser = () => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${today.getFullYear()}`;

    if (userForm.id) {
      // Edit existing user
      setUsers(
        users.map((user) =>
          user.id === userForm.id
            ? {
                ...user,
                name: userForm.name,
                email: userForm.email,
                phone: userForm.phone,
                role: userForm.role,
                status: userForm.status,
              }
            : user
        )
      );
      setEditUserOpen(false);
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        status: userForm.status,
        avatar: "/placeholder.svg?height=40&width=40",
        createdAt: formattedDate,
        orders: 0,
        totalSpent: 0,
      };

      setUsers([...users, newUser]);
      setAddUserOpen(false);
    }
  };

  const resetPassword = () => {
    // In a real app, this would call an API to reset the password
    // For this demo, we'll just close the dialog
    setResetPasswordOpen(false);
  };

  const toggleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const exportUsers = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Xuất danh sách người dùng thành công!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hiển thị loading/error */}
      {loading && (
        <div className="text-center text-muted-foreground py-10">
          Đang tải danh sách người dùng...
        </div>
      )}
      {error && <div className="text-center text-red-500 py-10">{error}</div>}
      {!loading && !error && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportUsers}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={handleAddUser}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm người dùng mới
              </Button>
            </div>
          </div>

          <UserStatsCards users={users} />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách người dùng</CardTitle>
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
                    placeholder="Tìm kiếm người dùng..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    className="border rounded-md px-3 py-2"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="Admin">Admin</option>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Khách hàng">Khách hàng</option>
                  </select>

                  <select
                    className="border rounded-md px-3 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Bị khóa">Bị khóa</option>
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

              {selectedUsers.length > 0 && (
                <div className="bg-muted p-2 rounded-md mb-4 flex justify-between items-center">
                  <span>{selectedUsers.length} người dùng đã chọn</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUsers([])}
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
                <UserTable
                  filteredUsers={filteredUsers}
                  selectedUsers={selectedUsers}
                  toggleSelectAll={toggleSelectAll}
                  toggleSelectUser={toggleSelectUser}
                  setSortBy={setSortBy}
                  toggleSortOrder={toggleSortOrder}
                  handleViewUser={handleViewUser}
                  handleEditUser={handleEditUser}
                  handleResetPassword={handleResetPassword}
                  handleDeleteClick={handleDeleteClick}
                />
              ) : (
                <UserGrid
                  filteredUsers={filteredUsers}
                  selectedUsers={selectedUsers}
                  toggleSelectUser={toggleSelectUser}
                  handleViewUser={handleViewUser}
                  handleEditUser={handleEditUser}
                  handleResetPassword={handleResetPassword}
                  handleDeleteClick={handleDeleteClick}
                  formatCurrency={formatCurrency}
                />
              )}

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Hiển thị 1-{filteredUsers.length} của {filteredUsers.length}{" "}
                  người dùng
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

          <UserDialogs
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            confirmDelete={confirmDelete}
            bulkDeleteDialogOpen={bulkDeleteDialogOpen}
            setBulkDeleteDialogOpen={setBulkDeleteDialogOpen}
            selectedUsers={selectedUsers}
            handleBulkDelete={handleBulkDelete}
            filterDialogOpen={filterDialogOpen}
            setFilterDialogOpen={setFilterDialogOpen}
            viewUserOpen={viewUserOpen}
            setViewUserOpen={setViewUserOpen}
            currentUser={currentUser}
            handleEditUser={handleEditUser}
            handleResetPassword={handleResetPassword}
            formatCurrency={formatCurrency}
            addUserOpen={addUserOpen}
            setAddUserOpen={setAddUserOpen}
            userForm={userForm}
            handleFormChange={handleFormChange}
            handleRoleChange={handleRoleChange}
            handleStatusChange={handleStatusChange}
            saveUser={saveUser}
            resetPasswordOpen={resetPasswordOpen}
            setResetPasswordOpen={setResetPasswordOpen}
            resetPassword={resetPassword}
            setEditUserOpen={setEditUserOpen}
            editUserOpen={editUserOpen}
            setUserForm={setUserForm}
          />
        </>
      )}
    </div>
  );
}
