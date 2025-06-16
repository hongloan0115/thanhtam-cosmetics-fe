"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Danh sách các route công khai không cần đăng nhập
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/products",
  "/products/[id]",
  "/about",
  "/contact",
  "/promotions",
  "/auth/login-success-by-google",
];

export default function RouteGuard({
  children,
  requireAdmin = false,
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = () => {
    if (publicRoutes.includes(pathname)) return true;

    if (pathname.startsWith("/products/") && pathname.split("/").length === 3)
      return true;

    return false;
  };

  useEffect(() => {
    // Đợi cho đến khi trạng thái xác thực được xác định
    if (isLoading) return; // Đợi xác thực xong mới xử lý chuyển hướng

    // Nếu không phải route công khai và người dùng chưa đăng nhập
    if (!isPublicRoute() && !isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    // Nếu yêu cầu quyền admin nhưng người dùng không phải admin
    if (
      requireAdmin &&
      (!user || !user.roles || !user.roles.includes("ADMIN"))
    ) {
      router.replace("/");
      return;
    }

    // Nếu route là /account thì chỉ cần đăng nhập, không cần kiểm tra vai trò
  }, [isLoading, isAuthenticated, pathname, router, user, requireAdmin]);

  // Hiển thị nội dung khi đã xác thực hoặc là route công khai
  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!isPublicRoute() && !isAuthenticated) {
    return null; // Không hiển thị nội dung khi chưa xác thực và không phải route công khai
  }

  if (requireAdmin && (!user || !user.roles || !user.roles.includes("ADMIN"))) {
    return null; // Không hiển thị nội dung khi không có quyền admin
  }

  return <>{children}</>;
}
