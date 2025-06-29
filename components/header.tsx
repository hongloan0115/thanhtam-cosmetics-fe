"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Heart,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartService } from "@/services/api/carts";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  console.log(user);
  console.log(isAuthenticated);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Sản phẩm", path: "/products" },
    // { name: "Khuyến mãi", path: "/promotions" },
    { name: "Về chúng tôi", path: "/about" },
    { name: "Liên hệ", path: "/contact" },
  ];

  // Lấy số lượng sản phẩm khác nhau trong giỏ hàng khi load trang và khi có sự kiện thêm vào giỏ hàng
  useEffect(() => {
    async function fetchCartCount() {
      try {
        const items = await CartService.getItems();
        setCartCount(items.length);
      } catch {
        setCartCount(0);
      }
    }
    fetchCartCount();

    const handleCartAdd = () => {
      fetchCartCount(); // Cập nhật lại số lượng thực tế từ API thay vì tăng lên 1
    };
    const handleCartClear = () => {
      setCartCount(0);
    };

    window.addEventListener("cart:add", handleCartAdd);
    window.addEventListener("cart:clear", handleCartClear);
    window.addEventListener("cart:remove", handleCartAdd); // Thêm lắng nghe sự kiện xóa

    return () => {
      window.removeEventListener("cart:add", handleCartAdd);
      window.removeEventListener("cart:clear", handleCartClear);
      window.removeEventListener("cart:remove", handleCartAdd); // Xóa lắng nghe khi unmount
    };
  }, []);

  const handleSearch = () => {};

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-pink-600">Thanh Tâm</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-pink-600",
                  isActive(item.path) ? "text-pink-600" : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-8 w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] text-white">
                {cartCount}
              </span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        user?.anhDaiDien ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt={user?.username || "User"}
                    />
                    <AvatarFallback>
                      {user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        user?.avatar_url ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={user?.username || "User"}
                    />
                    <AvatarFallback>
                      {user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.username || "User"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email || user?.phone || "user@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="cursor-pointer flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Tài khoản của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account/orders"
                    className="cursor-pointer flex items-center"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <Link
                    href="/account/wishlist"
                    className="cursor-pointer flex items-center"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Sản phẩm yêu thích
                  </Link>
                </DropdownMenuItem> */}
                {user?.role === "Admin" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/dashboard"
                      className="cursor-pointer flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 9h.01" />
                        <path d="M15 9h.01" />
                        <path d="M9 15h.01" />
                        <path d="M15 15h.01" />
                      </svg>
                      Quản trị viên
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="hidden md:flex bg-pink-600 hover:bg-pink-700"
                >
                  Đăng ký
                </Button>
              </Link>
              <Link href="/auth/login" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-8 w-full"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-pink-600 p-2",
                  isActive(item.path)
                    ? "text-pink-600 bg-pink-50"
                    : "text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex gap-2 pt-2 border-t">
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Giỏ hàng
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link href="/account" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Tài khoản
                  </Button>
                </Link>
              ) : (
                <div className="flex gap-2 w-full">
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
