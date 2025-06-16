"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AuthService } from "@/services/api/auth";
import { useAuth } from "@/components/auth-provider";
import { NAVIGATION_PATHS } from "@/core/config/constants";
import axiosInstance from "@/utils/axios-instance";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuth();

  // Dữ liệu form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Trạng thái UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false); // Thêm biến riêng cho login thường

  // Validate input
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    }
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;

    setIsSubmitting(true);
    setIsLoginSubmitting(true); // Đánh dấu đang xử lý login thường

    try {
      // Sử dụng AuthService để xử lý toàn bộ quá trình đăng nhập và lấy user
      const userInfo = await AuthService.loginAndGetUser(email, password);
      setUser(userInfo);
      setIsAuthenticated(true);

      if (userInfo.roles && userInfo.roles.includes("ADMIN")) {
        router.push(NAVIGATION_PATHS.ADMIN_DASHBOARD);
      } else if (userInfo.roles && userInfo.roles.includes("CUSTOMER")) {
        router.push(NAVIGATION_PATHS.HOME);
      } else {
        router.push(NAVIGATION_PATHS.ACCOUNT);
      }
    } catch (error: any) {
      setGeneralError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
      setIsLoginSubmitting(false); // Kết thúc xử lý login thường
    }
  };

  // Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const res = await axiosInstance.get("/auth/google/login");
      const data = res.data;
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setGeneralError("Không thể kết nối Google. Vui lòng thử lại sau.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setGeneralError("Không thể kết nối Google. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  // Xử lý callback từ Google OAuth
  useEffect(() => {
    const url = new URL(window.location.href);
    const accessTokenFromUrl = url.searchParams.get("accessToken");
    const code = url.searchParams.get("code");
    const accessToken = url.searchParams.get("access_token");
    const email = url.searchParams.get("email");
    const name = url.searchParams.get("name");
    const avatar = url.searchParams.get("avatar");

    // Nếu có accessToken trên URL (Google callback dạng redirect)
    if (accessTokenFromUrl) {
      setIsSubmitting(true);
      setGeneralError("");
      localStorage.setItem("accessToken", accessTokenFromUrl);

      // Xóa accessToken khỏi URL để tránh lặp lại
      url.searchParams.delete("accessToken");
      window.history.replaceState({}, document.title, url.pathname);

      // Lấy user từ backend
      AuthService.getCurrentUser()
        .then((userInfo) => {
          setUser(userInfo);
          setIsAuthenticated(true);
          localStorage.setItem("currentUser", JSON.stringify(userInfo));
          router.replace(NAVIGATION_PATHS.HOME);
        })
        .catch(() => {
          setGeneralError("Không thể lấy thông tin người dùng từ Google.");
        })
        .finally(() => setIsSubmitting(false));
      return;
    }

    if (accessToken && email) {
      // Đăng nhập thành công từ Google, lưu token và user, chuyển hướng về trang chủ
      setIsSubmitting(true);
      setGeneralError("");
      localStorage.setItem("accessToken", accessToken);
      setUser({
        email,
        hoTen: name,
        anhDaiDien: avatar,
        roles: ["CUSTOMER"], // hoặc lấy roles từ backend nếu có
      });
      setIsAuthenticated(true);
      router.replace(NAVIGATION_PATHS.HOME);
      return;
    }

    if (code) {
      setIsSubmitting(true);
      setGeneralError("");
      axiosInstance
        .get(`/api/auth/google/callback?code=${code}`)
        .then((res) => res.data)
        .then(async (data) => {
          if (data.email && data.access_token) {
            // Lưu access_token vào localStorage
            localStorage.setItem("accessToken", data.access_token);

            // Gửi access_token lên backend để lấy thông tin user (nếu chưa có thì backend sẽ tạo)
            try {
              // Gọi API lấy user profile (đã xác thực bằng access_token)
              const userInfo = await AuthService.getCurrentUser();
              setUser(userInfo);
              setIsAuthenticated(true);
              localStorage.setItem("currentUser", JSON.stringify(userInfo));
            } catch (err) {
              // Nếu lỗi, vẫn lưu thông tin tạm từ Google
              setUser({
                email: data.email,
                hoTen: data.name,
                anhDaiDien: data.avatar,
                roles: data.roles || ["CUSTOMER"],
              });
              setIsAuthenticated(true);
              localStorage.setItem(
                "currentUser",
                JSON.stringify({
                  email: data.email,
                  hoTen: data.name,
                  anhDaiDien: data.avatar,
                  roles: data.roles || ["CUSTOMER"],
                })
              );
            }
            router.replace(NAVIGATION_PATHS.HOME);
          } else {
            setGeneralError("Đăng nhập Google thất bại.");
          }
        })
        .catch(() => setGeneralError("Đăng nhập Google thất bại."))
        .finally(() => setIsSubmitting(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center">
              Đăng nhập vào tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generalError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-pink-600 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isSubmitting}
                >
                  {isLoginSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
                <div className="flex items-center gap-2 my-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-400">hoặc</span>
                  <Separator className="flex-1" />
                </div>
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2"
                  variant="outline"
                  disabled={isSubmitting}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                  Đăng nhập với Google
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link
                href="/auth/register"
                className="text-pink-600 hover:underline font-medium"
              >
                Đăng ký
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
