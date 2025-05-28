import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Edit, Lock, Trash2 } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  status: string
  avatar?: string
  createdAt: string
  orders?: number
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
}: {
  filteredUsers: User[]
  selectedUsers: number[]
  toggleSelectAll: () => void
  toggleSelectUser: (id: number) => void
  setSortBy: (v: string) => void
  toggleSortOrder: () => void
  handleViewUser: (u: User) => void
  handleEditUser: (u: User) => void
  handleResetPassword: (u: User) => void
  handleDeleteClick: (id: number) => void
}) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setSortBy("name")
                  toggleSortOrder()
                }}
              >
                Tên người dùng
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setSortBy("createdAt")
                  toggleSortOrder()
                }}
              >
                Ngày tạo
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setSortBy("orders")
                  toggleSortOrder()
                }}
              >
                Đơn hàng
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                Không tìm thấy người dùng nào
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleSelectUser(user.id)}
                    disabled={user.role === "Admin"}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
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
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.orders || 0}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Hoạt động" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleResetPassword(user)}>
                      <Lock className="h-4 w-4" />
                    </Button>
                    {user.role !== "Admin" && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user.id)}>
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
  )
}
