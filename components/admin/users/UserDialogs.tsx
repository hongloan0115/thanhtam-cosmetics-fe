import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Lock, ShieldCheck, ShieldAlert, UserCog } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, Calendar } from "lucide-react";
import type { User, UserForm } from "../../../app/admin/users/page";

export default function UserDialogs(props: {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (v: boolean) => void;
  confirmDelete: () => void;
  bulkDeleteDialogOpen: boolean;
  setBulkDeleteDialogOpen: (v: boolean) => void;
  selectedUsers: number[];
  handleBulkDelete: () => void;
  filterDialogOpen: boolean;
  setFilterDialogOpen: (v: boolean) => void;
  viewUserOpen: boolean;
  setViewUserOpen: (v: boolean) => void;
  currentUser: User | null;
  handleEditUser: (u: User) => void;
  handleResetPassword: (u: User) => void;
  formatCurrency: (n: number) => string;
  addUserOpen: boolean;
  setAddUserOpen: (v: boolean) => void;
  userForm: UserForm;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (v: string) => void;
  handleStatusChange: (v: string) => void;
  saveUser: () => void;
  resetPasswordOpen: boolean;
  setResetPasswordOpen: (v: boolean) => void;
  resetPassword: () => void;
  setEditUserOpen: (v: boolean) => void;
  editUserOpen: boolean;
  setUserForm: (v: UserForm) => void;
}) {
  return (
    <>
      {/* Delete confirmation dialog */}
      <Dialog
        open={props.deleteDialogOpen}
        onOpenChange={props.setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => props.setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={props.confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete confirmation dialog */}
      <Dialog
        open={props.bulkDeleteDialogOpen}
        onOpenChange={props.setBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa nhiều người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa {props.selectedUsers.length} người dùng
              đã chọn? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => props.setBulkDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={props.handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filter Dialog */}
      <Dialog
        open={props.filterDialogOpen}
        onOpenChange={props.setFilterDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lọc nâng cao</DialogTitle>
            <DialogDescription>
              Tùy chỉnh các bộ lọc để tìm người dùng chính xác hơn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-admin" />
                  <label htmlFor="role-admin" className="text-sm">
                    Admin
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-staff" />
                  <label htmlFor="role-staff" className="text-sm">
                    Nhân viên
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-customer" />
                  <label htmlFor="role-customer" className="text-sm">
                    Khách hàng
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="status-active" />
                  <label htmlFor="status-active" className="text-sm">
                    Hoạt động
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="status-locked" />
                  <label htmlFor="status-locked" className="text-sm">
                    Bị khóa
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ngày tham gia</Label>
              <div className="flex items-center gap-2">
                <Input type="date" placeholder="Từ" />
                <span>-</span>
                <Input type="date" placeholder="Đến" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Số đơn hàng</Label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Từ" />
                <span>-</span>
                <Input type="number" placeholder="Đến" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => props.setFilterDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={() => props.setFilterDialogOpen(false)}>
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={props.viewUserOpen} onOpenChange={props.setViewUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
          </DialogHeader>

          {props.currentUser && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={props.currentUser.avatar}
                    alt={props.currentUser.name}
                  />
                  <AvatarFallback>
                    {props.currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {props.currentUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {props.currentUser.email}
                  </p>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={
                        props.currentUser.role === "Admin"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : props.currentUser.role === "Nhân viên"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {props.currentUser.role}
                    </Badge>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        props.currentUser.status === "Hoạt động"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {props.currentUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">ID:</div>
                    <div>{props.currentUser.id}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Vai trò:</div>
                    <div>{props.currentUser.role}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Trạng thái:</div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          props.currentUser.status === "Hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {props.currentUser.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Số điện thoại:</div>
                    <div>{props.currentUser.phone || "Chưa cập nhật"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Đăng nhập gần nhất:</div>
                    <div>{props.currentUser.lastLogin || "Chưa đăng nhập"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Ngày tạo:</div>
                    <div>{props.currentUser.createdAt}</div>
                  </div>

                  {props.currentUser.role === "Khách hàng" && (
                    <>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Số đơn hàng:</div>
                        <div>{props.currentUser.orders || 0}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Tổng chi tiêu:</div>
                        <div>
                          {props.formatCurrency(
                            props.currentUser.totalSpent || 0
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="text-sm text-muted-foreground text-center py-6">
                    {props.currentUser.role === "Khách hàng" ? (
                      props.currentUser.orders &&
                      props.currentUser.orders > 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b">
                            <span>Đơn hàng gần nhất:</span>
                            <span className="font-medium">15/04/2023</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b">
                            <span>Sản phẩm đã mua:</span>
                            <span className="font-medium">
                              {props.currentUser.orders * 2}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b">
                            <span>Giá trị trung bình/đơn:</span>
                            <span className="font-medium">
                              {props.formatCurrency(
                                (props.currentUser.totalSpent || 0) /
                                  (props.currentUser.orders || 1)
                              )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <ShieldAlert className="h-10 w-10 text-muted-foreground mb-2" />
                          <p>Người dùng chưa có đơn hàng nào</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center">
                        {props.currentUser.role === "Admin" ? (
                          <>
                            <ShieldCheck className="h-10 w-10 text-muted-foreground mb-2" />
                            <p>Tài khoản quản trị viên</p>
                          </>
                        ) : (
                          <>
                            <UserCog className="h-10 w-10 text-muted-foreground mb-2" />
                            <p>Tài khoản nhân viên</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    props.setViewUserOpen(false);
                    props.handleEditUser(props.currentUser);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    props.setViewUserOpen(false);
                    props.handleResetPassword(props.currentUser);
                  }}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Đặt lại mật khẩu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={props.addUserOpen} onOpenChange={props.setAddUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>
              Điền thông tin người dùng mới vào form bên dưới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên người dùng</Label>
              <Input
                id="name"
                name="name"
                value={props.userForm.name}
                onChange={props.handleFormChange}
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={props.userForm.email}
                onChange={props.handleFormChange}
                placeholder="Nhập email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={props.userForm.phone}
                onChange={props.handleFormChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select
                  value={props.userForm.role}
                  onValueChange={props.handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                    <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={props.userForm.status}
                  onValueChange={props.handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                    <SelectItem value="Bị khóa">Bị khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={props.userForm.password}
                onChange={props.handleFormChange}
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={props.userForm.confirmPassword}
                onChange={props.handleFormChange}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => props.setAddUserOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={props.saveUser}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={
                !props.userForm.name ||
                !props.userForm.email ||
                !props.userForm.password ||
                props.userForm.password !== props.userForm.confirmPassword
              }
            >
              Thêm người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={props.editUserOpen} onOpenChange={props.setEditUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin người dùng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên người dùng</Label>
              <Input
                id="edit-name"
                name="name"
                value={props.userForm.name}
                onChange={props.handleFormChange}
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={props.userForm.email}
                onChange={props.handleFormChange}
                placeholder="Nhập email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={props.userForm.phone}
                onChange={props.handleFormChange}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select
                  value={props.userForm.role}
                  onValueChange={props.handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                    <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select
                  value={props.userForm.status}
                  onValueChange={props.handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                    <SelectItem value="Bị khóa">Bị khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => props.setEditUserOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={props.saveUser}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={!props.userForm.name || !props.userForm.email}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={props.resetPasswordOpen}
        onOpenChange={props.setResetPasswordOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đặt lại mật khẩu</DialogTitle>
            <DialogDescription>
              Đặt lại mật khẩu cho người dùng {props.currentUser?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">Mật khẩu mới</Label>
              <Input
                id="reset-password"
                name="password"
                type="password"
                value={props.userForm.password}
                onChange={props.handleFormChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="reset-confirmPassword"
                name="confirmPassword"
                type="password"
                value={props.userForm.confirmPassword}
                onChange={props.handleFormChange}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => props.setResetPasswordOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={props.resetPassword}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={
                !props.userForm.password ||
                props.userForm.password !== props.userForm.confirmPassword
              }
            >
              Đặt lại mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
