"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentResultPage = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const status = searchParams.get("status");
  const error = searchParams.get("error");
  const error_code = searchParams.get("error_code");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!status) return;
    if (status === "success") {
      setMessage("Thanh toán thành công! Cảm ơn bạn đã đặt hàng.");
    } else if (status === "fail") {
      if (error === "invalid_signature") {
        setMessage(
          "Có lỗi xác thực chữ ký thanh toán. Vui lòng liên hệ hỗ trợ."
        );
      } else if (error_code) {
        setMessage(`Thanh toán thất bại. Mã lỗi: ${error_code}`);
      } else {
        setMessage(
          "Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ."
        );
      }
    }
  }, [status, error, error_code]);

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Kết quả thanh toán</h1>
      <p>{message}</p>
      {order_id && (
        <p>
          Mã đơn hàng: <b>{order_id}</b>
        </p>
      )}
      <a href="/">Quay về trang chủ</a>
    </div>
  );
};

export default PaymentResultPage;
