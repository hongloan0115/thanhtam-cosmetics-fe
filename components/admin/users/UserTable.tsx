import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, Edit, Lock, Unlock, Trash2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: string;
  orders?: number;
  fullName?: string; // thêm trường này
}

export default function UserTable({
  filteredUsers,
  selectedUsers,
  toggleSelectAll,
  toggleSelectUser,
  setSortBy,
  toggleSortOrder,
  handleViewUser,
  handleEditUser,
  handleResetPassword,
  handleDeleteClick,
  handleToggleStatus, // thêm dòng này
}: {
  filteredUsers: User[];
  selectedUsers: number[];
  toggleSelectAll: () => void;
  toggleSelectUser: (id: number) => void;
  setSortBy: (v: string) => void;
  toggleSortOrder: () => void;
  handleViewUser: (u: User) => void;
  handleEditUser: (u: User) => void;
  handleResetPassword?: (u: User) => void;
  handleDeleteClick: (id: number) => void;
  handleToggleStatus: (u: User) => void; // thêm dòng này
}) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] text-center">
              <Checkbox
                checked={
                  selectedUsers.length === filteredUsers.length &&
                  filteredUsers.length > 0
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[50px] text-center">ID</TableHead>
            <TableHead className="text-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setSortBy("name");
                  toggleSortOrder();
                }}
              >
                Tên tài khoản
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-center">Họ tên</TableHead>
            <TableHead className="text-center">Số điện thoại</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Vai trò</TableHead>
            <TableHead className="text-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setSortBy("orders");
                  toggleSortOrder();
                }}
              >
                Đơn hàng
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-10 text-muted-foreground"
              >
                Không tìm thấy người dùng nào
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleSelectUser(user.id)}
                    disabled={user.role === "Admin"}
                  />
                </TableCell>
                <TableCell className="font-medium text-center">
                  {user.id}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                {/* Hiển thị họ tên */}
                <TableCell className="text-center">
                  {user.fullName || "Không có"}
                </TableCell>
                {/* Hiển thị số điện thoại */}
                <TableCell className="text-center">
                  {user.phone && user.phone.trim() !== ""
                    ? user.phone
                    : "Không có"}
                </TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      user.role === "Admin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : user.role === "Nhân viên"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {user.orders || 0}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Hoạt động"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={
                        user.status === "Hoạt động"
                          ? "Khoá tài khoản"
                          : "Mở khoá tài khoản"
                      }
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.status === "Hoạt động" ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                    {user.role !== "Admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
