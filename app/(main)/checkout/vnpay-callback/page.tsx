"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderService } from "@/services/api/orders";

export default function VnpayCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "fail">(
    "pending"
  );

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    if (vnp_ResponseCode && vnp_TxnRef) {
      OrderService.vnpayCallback(vnp_ResponseCode, vnp_TxnRef)
        .then(() => {
          setStatus("success");
          setTimeout(() => router.push("/checkout/confirmation"), 2000);
        })
        .catch(() => {
          setStatus("fail");
        });
    } else {
      setStatus("fail");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {status === "pending" && <div>Đang xác nhận thanh toán...</div>}
      {status === "success" && (
        <div className="text-green-600 font-bold text-lg">
          Thanh toán thành công! Đang chuyển hướng...
        </div>
      )}
      {status === "fail" && (
        <div className="text-red-600 font-bold text-lg">
          Thanh toán thất bại hoặc không hợp lệ.
        </div>
      )}
    </div>
  );
}
