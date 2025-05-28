"use client";

import type React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart, Package, User } from "lucide-react";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Tài khoản của tôi",
      href: "/account",
      icon: User,
    },
    {
      title: "Đơn hàng của tôi",
      href: "/account/orders",
      icon: Package,
    },
    {
      title: "Sản phẩm yêu thích",
      href: "/account/wishlist",
      icon: Heart,
    },
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                {user?.username?.charAt(0) || "U"}{" "}
                {/* Use username's first character or fallback */}
              </div>
              <div>
                <p className="font-medium">{user?.username || "Người dùng"}</p>{" "}
                {/* Display username */}
                <p className="text-sm text-gray-500">
                  {user?.email || user?.phone || "user@example.com"}{" "}
                  {/* Display email or phone */}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href
                        ? "bg-pink-50 text-pink-600 hover:bg-pink-50 hover:text-pink-600"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </nav>
          </Card>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
