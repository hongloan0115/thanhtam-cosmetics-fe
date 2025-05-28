"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import axiosInstance from "@/utils/axios-instance";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setErrorMessage("Token không hợp lệ hoặc đã hết hạn.");
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/auth/verify-email?token=${token}`
        );
        if (response.status === 200) {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("error");
          setErrorMessage("Xác minh email thất bại. Vui lòng thử lại.");
        }
      } catch (error: any) {
        setVerificationStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        {isVerifying ? (
          <div className="space-y-4">
            <p className="text-lg font-medium">Đang xác minh email...</p>
          </div>
        ) : verificationStatus === "success" ? (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-lg font-medium text-green-600">
              Xác minh email thành công!
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Đăng nhập
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/auth/register")}
              className="bg-pink-600 hover:bg-pink-700"
            >
              Đăng ký lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
