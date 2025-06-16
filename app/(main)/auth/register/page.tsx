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
import { Eye, EyeOff, AlertCircle, User, Lock, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/utils/axios-instance"; // Import axiosInstance

export default function RegisterPage() {
  const router = useRouter();
  const { register, setUser, setIsAuthenticated } = useAuth();

  // Các bước đăng ký
  const [step, setStep] = useState<"method" | "complete">("method");

  // Dữ liệu form
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Trạng thái UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false); // Thêm biến cho nút Đăng ký thường
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false); // Thêm biến cho nút Google
  const [isCompleteSubmitting, setIsCompleteSubmitting] = useState(false); // Cho nút hoàn thành đăng ký
  const [generalError, setGeneralError] = useState("");

  // Xác thực email
  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: "Vui lòng nhập email" });
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Email không hợp lệ" });
      return false;
    }
    setErrors({});
    return true;
  };

  // Xác thực thông tin cá nhân
  const validatePersonalInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Đăng ký trực tiếp bằng email
  const registerWithEmail = () => {
    if (!validateEmail()) return;
    if (!password || password.length < 6 || password !== confirmPassword)
      return;

    setIsSubmitting(true);
    setIsEmailSubmitting(true);
    setGeneralError("");

    axiosInstance
      .post("/auth/register", {
        email: email,
        password: password,
      })
      .catch((error) => {
        // Sử dụng dữ liệu trả về từ API nếu có
        if (
          error.response &&
          error.response.data &&
          typeof error.response.data.detail === "string"
        ) {
          setGeneralError(error.response.data.detail);
        } else {
          setGeneralError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
        console.error("Registration error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsEmailSubmitting(false);
      });
  };

  // Hoàn thành đăng ký
  const completeRegistration = async () => {
    if (!validatePersonalInfo()) return;

    setIsSubmitting(true);
    setIsCompleteSubmitting(true);
    setGeneralError("");

    try {
      // Đăng ký người dùng
      const success = await register({
        fullName: fullName,
        email: email,
        password: password,
        role: "Khách hàng",
      });

      if (success) {
        router.push("/account");
      } else {
        setGeneralError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
      }
    } catch (error) {
      setGeneralError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
      setIsCompleteSubmitting(false);
    }
  };

  // Đăng ký bằng Google (giống login)
  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    setIsGoogleSubmitting(true);
    setGeneralError("");
    try {
      const res = await axiosInstance.get("/auth/google/login");
      const data = res.data;
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        setGeneralError("Không thể kết nối Google. Vui lòng thử lại sau.");
        setIsSubmitting(false);
        setIsGoogleSubmitting(false);
      }
    } catch (err) {
      setGeneralError("Không thể kết nối Google. Vui lòng thử lại sau.");
      setIsSubmitting(false);
      setIsGoogleSubmitting(false);
    }
  };

  // Xử lý callback từ Google OAuth (giống login)
  useEffect(() => {
    const url = new URL(window.location.href);
    const accessTokenFromUrl = url.searchParams.get("accessToken");
    const code = url.searchParams.get("code");
    const accessToken = url.searchParams.get("access_token");
    const email = url.searchParams.get("email");
    const name = url.searchParams.get("name");
    const avatar = url.searchParams.get("avatar");

    if (accessTokenFromUrl) {
      setIsSubmitting(true);
      setGeneralError("");
      localStorage.setItem("accessToken", accessTokenFromUrl);

      url.searchParams.delete("accessToken");
      window.history.replaceState({}, document.title, url.pathname);

      // Lấy user từ backend
      axiosInstance
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
          setIsAuthenticated(true);
          localStorage.setItem("currentUser", JSON.stringify(res.data));
          router.replace("/");
        })
        .catch(() => {
          setGeneralError("Không thể lấy thông tin người dùng từ Google.");
        })
        .finally(() => setIsSubmitting(false));
      return;
    }

    if (accessToken && email) {
      setIsSubmitting(true);
      setGeneralError("");
      localStorage.setItem("accessToken", accessToken);
      setUser({
        email,
        hoTen: name,
        anhDaiDien: avatar,
        roles: ["CUSTOMER"],
      });
      setIsAuthenticated(true);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email,
          hoTen: name,
          anhDaiDien: avatar,
          roles: ["CUSTOMER"],
        })
      );
      router.replace("/");
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
            localStorage.setItem("accessToken", data.access_token);
            try {
              const userRes = await axiosInstance.get("/auth/me");
              setUser(userRes.data);
              setIsAuthenticated(true);
              localStorage.setItem("currentUser", JSON.stringify(userRes.data));
            } catch (err) {
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
            router.replace("/");
          } else {
            setGeneralError("Đăng ký Google thất bại.");
          }
        })
        .catch(() => setGeneralError("Đăng ký Google thất bại."))
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
              Đăng ký tài khoản
            </CardTitle>
            <CardDescription className="text-center">
              {step === "method" && "Đăng ký tài khoản mới"}
              {step === "complete" && "Hoàn thành thông tin tài khoản của bạn"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generalError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            {step === "method" && (
              <div className="space-y-4">
                {/* Gộp form đăng ký email và nút Google vào cùng một khối */}
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
                    <Label htmlFor="password">Mật khẩu</Label>
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
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={registerWithEmail}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={isSubmitting}
                  >
                    {isEmailSubmitting ? "Đang xử lý..." : "Đăng ký"}
                  </Button>
                  <div className="flex items-center gap-2 my-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-gray-400">hoặc</span>
                    <Separator className="flex-1" />
                  </div>
                  <Button
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                    disabled={isSubmitting}
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
                    {isGoogleSubmitting
                      ? "Đang xử lý..."
                      : "Đăng ký với Google"}
                  </Button>
                </div>
              </div>
            )}

            {step === "complete" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`pl-10 ${
                        errors.fullName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 pr-10 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  onClick={completeRegistration}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isSubmitting}
                >
                  {isCompleteSubmitting
                    ? "Đang xử lý..."
                    : "Hoàn thành đăng ký"}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link href="/terms" className="text-pink-600 hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-pink-600 hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </div>
            <Separator />
            <div className="text-center text-sm">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-pink-600 hover:underline font-medium"
              >
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
