"use client";

import type React from "react";
import { useEffect } from "react";
import { AuthProvider } from "@/components/auth-provider";
import RouteGuard from "@/components/route-guard";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cuộn lên đầu trang khi chuyển trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <RouteGuard requireAdmin={true}>
        <div className="flex min-h-screen bg-gray-50">
          <div className="w-64 hidden md:block">
            <AdminSidebar />
          </div>
          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </RouteGuard>
    </AuthProvider>
  );
}
