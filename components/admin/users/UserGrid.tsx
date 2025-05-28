import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Lock, Trash2, Mail, Phone, Calendar } from "lucide-react";

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
  totalSpent?: number;
}

export default function UserGrid({
  filteredUsers,
  selectedUsers,
  toggleSelectUser,
  handleViewUser,
  handleEditUser,
  handleResetPassword,
  handleDeleteClick,
  formatCurrency,
}: {
  filteredUsers: User[];
  selectedUsers: number[];
  toggleSelectUser: (id: number) => void;
  handleViewUser: (u: User) => void;
  handleEditUser: (u: User) => void;
  handleResetPassword: (u: User) => void;
  handleDeleteClick: (id: number) => void;
  formatCurrency: (n: number) => string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredUsers.length === 0 ? (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          Không tìm thấy người dùng nào
        </div>
      ) : (
        filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden group">
            <div className="relative">
              {user.role !== "Admin" && (
                <div className="absolute top-2 right-2 z-10">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleSelectUser(user.id)}
                    className="bg-white/80"
                  />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-center">{user.name}</h3>
                <Badge variant="outline" className="mt-1 mb-2">
                  {user.role}
                </Badge>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "Hoạt động"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Tham gia: {user.createdAt}</span>
                </div>
                {user.role === "Khách hàng" && (
                  <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <span className="text-muted-foreground">Đơn hàng:</span>
                    <span className="font-medium">{user.orders}</span>
                  </div>
                )}
                {user.role === "Khách hàng" &&
                  user.totalSpent !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Chi tiêu:</span>
                      <span className="font-medium">
                        {formatCurrency(user.totalSpent)}
                      </span>
                    </div>
                  )}
              </div>
              <div className="mt-4 flex justify-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewUser(user)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetPassword(user)}
                >
                  <Lock className="h-4 w-4" />
                </Button>
                {user.role !== "Admin" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
