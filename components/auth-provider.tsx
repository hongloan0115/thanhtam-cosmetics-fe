"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/services/api/auth";

// Đồng bộ interface User với dữ liệu trả về từ API profile
interface User {
  maNguoiDung: number;
  tenNguoiDung: string | null;
  hoTen: string | null;
  soDienThoai: string | null;
  email: string;
  daXacThucEmail: boolean;
  trangThai: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
  vaiTro: {
    tenVaiTro: string;
    moTa: string;
    maVaiTro: number;
  }[];
  roles: string[];
  gioHang?: any[]; // Có thể định nghĩa rõ hơn nếu cần
  anhDaiDien?: string | null; // Thêm trường ảnh đại diện nếu có
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  // Wishlist methods có thể bỏ qua nếu không dùng với API mới
  addToWishlist?: (productId: number) => void;
  removeFromWishlist?: (productId: number) => void;
  isInWishlist?: (productId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  const setIsAuthenticated = (isAuthenticated: boolean) => {
    setIsAuthenticatedState(isAuthenticated);
  };

  // Check for token and fetch user info on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      AuthService.getCurrentUser()
        .then((userInfo) => {
          setUser(userInfo);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const { access_token } = await AuthService.login(email, password);

      localStorage.setItem("accessToken", access_token);

      const userInfo = await AuthService.getCurrentUser();

      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userInfo));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Đăng ký nên gọi API backend thực tế, không dùng localStorage nữa
      // Có thể cập nhật lại nếu backend đã hỗ trợ
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");

    // Redirect to home page
    router.push("/");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    // Không cập nhật localStorage users nữa, chỉ cập nhật state và currentUser
  };

  // Wishlist methods có thể bỏ qua hoặc để trống nếu không dùng
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
