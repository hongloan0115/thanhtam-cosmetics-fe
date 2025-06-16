"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { AuthService } from "@/services/api/auth"; // Thêm dòng này để gọi API update
import AccountLayout from "@/components/account-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountPage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [personalInfoErrors, setPersonalInfoErrors] = useState<
    Record<string, string>
  >({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  const [personalInfoSuccess, setPersonalInfoSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [isSubmittingPersonal, setIsSubmittingPersonal] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    // Cập nhật form dựa trên dữ liệu user từ API (đã đồng bộ trường: hoTen, soDienThoai)
    if (user) {
      setPersonalInfo({
        fullName: user.hoTen ?? "",
        email: user.email ?? "",
        phone: user.soDienThoai ?? "",
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (personalInfoErrors[name]) {
      setPersonalInfoErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear success message when user makes changes
    if (personalInfoSuccess) {
      setPersonalInfoSuccess(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear success message when user makes changes
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  const validatePersonalInfo = () => {
    const errors: Record<string, string> = {};

    if (!personalInfo.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên";
    }

    // Không bắt buộc nhập số điện thoại, chỉ kiểm tra nếu có nhập
    if (personalInfo.phone.trim()) {
      if (!/^[0-9]{10,11}$/.test(personalInfo.phone.replace(/\s/g, ""))) {
        errors.phone = "Số điện thoại không hợp lệ";
      }
    }

    setPersonalInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordInfo = () => {
    const errors: Record<string, string> = {};

    if (!passwordInfo.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordInfo.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordInfo.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    }

    if (!passwordInfo.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdatePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePersonalInfo()) return;

    setIsSubmittingPersonal(true);

    try {
      // Gọi API update profile thực tế (trường: hoTen, soDienThoai)
      await AuthService.updateProfile(
        personalInfo.fullName,
        personalInfo.phone
      );

      // Cập nhật lại user trong context (trường: hoTen, soDienThoai)
      updateUser({
        hoTen: personalInfo.fullName,
        soDienThoai: personalInfo.phone,
      });

      setPersonalInfoSuccess(true);
    } catch (error) {
      console.error("Error updating personal info:", error);
      setPersonalInfoErrors({
        general: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmittingPersonal(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordInfo()) return;

    setIsSubmittingPassword(true);

    try {
      // Chỉ gửi currentPassword và newPassword về backend
      await AuthService.changePassword(
        passwordInfo.currentPassword,
        passwordInfo.newPassword
      );

      setPasswordSuccess(true);
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordErrors({
        general: error?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (isLoading || !user) {
    return <div className="container py-8">Đang tải...</div>;
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tài khoản của tôi
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và mật khẩu của bạn
          </p>
        </div>

        <Tabs defaultValue="personal-info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal-info">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {personalInfoSuccess && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>
                      Thông tin cá nhân đã được cập nhật thành công!
                    </AlertDescription>
                  </Alert>
                )}

                {personalInfoErrors.general && (
                  <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                    <AlertDescription>
                      {personalInfoErrors.general}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Nhập họ và tên"
                      className={
                        personalInfoErrors.fullName ? "border-red-500" : ""
                      }
                    />
                    {personalInfoErrors.fullName && (
                      <p className="text-sm text-red-500">
                        {personalInfoErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={personalInfo.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email không thể thay đổi
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="Nhập số điện thoại"
                      className={
                        personalInfoErrors.phone ? "border-red-500" : ""
                      }
                    />
                    {personalInfoErrors.phone && (
                      <p className="text-sm text-red-500">
                        {personalInfoErrors.phone}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={isSubmittingPersonal}
                  >
                    {isSubmittingPersonal ? (
                      "Đang cập nhật..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu của bạn để bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                {passwordSuccess && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>
                      Mật khẩu đã được cập nhật thành công!
                    </AlertDescription>
                  </Alert>
                )}

                {passwordErrors.general && (
                  <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                    <AlertDescription>
                      {passwordErrors.general}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordInfo.currentPassword}
                        onChange={handlePasswordChange}
                        className={
                          passwordErrors.currentPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-500">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordInfo.newPassword}
                        onChange={handlePasswordChange}
                        className={
                          passwordErrors.newPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-500">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordInfo.confirmPassword}
                        onChange={handlePasswordChange}
                        className={
                          passwordErrors.confirmPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
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
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={isSubmittingPassword}
                  >
                    {isSubmittingPassword
                      ? "Đang cập nhật..."
                      : "Cập nhật mật khẩu"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AccountLayout>
  );
}
