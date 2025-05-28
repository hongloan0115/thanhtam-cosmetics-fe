import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  status: string
  avatar?: string
  lastLogin?: string
  createdAt: string
  orders?: number
  totalSpent?: number
}

export default function UserStatsCards({ users }: { users: User[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Tổng người dùng */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +
            {
              users.filter((u) => {
                const parts = u.createdAt.split("/")
                const date = new Date(
                  Number.parseInt(parts[2]),
                  Number.parseInt(parts[1]) - 1,
                  Number.parseInt(parts[0]),
                )
                const oneMonthAgo = new Date()
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
                return date > oneMonthAgo
              }).length
            }{" "}
            trong tháng này
          </p>
        </CardContent>
      </Card>
      {/* Khách hàng */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.filter((u) => u.role === "Khách hàng").length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((users.filter((u) => u.role === "Khách hàng").length / users.length) * 100)}% tổng người dùng
          </p>
        </CardContent>
      </Card>
      {/* Nhân viên */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.filter((u) => u.role === "Nhân viên").length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((users.filter((u) => u.role === "Nhân viên").length / users.length) * 100)}% tổng người dùng
          </p>
        </CardContent>
      </Card>
      {/* Tài khoản bị khóa */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tài khoản bị khóa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.filter((u) => u.status === "Bị khóa").length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((users.filter((u) => u.status === "Bị khóa").length / users.length) * 100)}% tổng người dùng
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
