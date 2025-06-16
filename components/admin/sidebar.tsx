"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BadgePercent,
  Settings,
  LogOut,
} from "lucide-react";

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: Box,
  },
  {
    title: "Thương hiệu",
    href: "/admin/brands",
    icon: BadgePercent,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Home className="h-6 w-6" />
          <span>Thanh Tâm Admin</span>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-1">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-pink-50 text-pink-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.title}
          </Link>
        ))}
      </div>
      <div className="p-4 mt-auto border-t">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
