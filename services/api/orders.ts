import axiosInstance from "@/utils/axios-instance";

export interface OrderDetailCreate {
  maSanPham: number;
  soLuong: number;
  donGia: number;
  tongTien: number;
}

export interface OrderCreate {
  maNguoiDung: number;
  diaChiChiTiet: string;
  tinhThanh: string;
  quanHuyen: string;
  phuongXa: string;
  maPhuongThuc: number;
  ghiChu?: string;
  tongTien: number;
  trangThai?: string;
}

export interface OrderCheckoutResponse {
  maDonHang: number;
  chiTietDonHang: any[] | null;
  payment_url?: string;
}

export const OrderService = {
  // Lấy tất cả đơn hàng (admin)
  async getAllOrdersAdmin(): Promise<any[]> {
    const response = await axiosInstance.get("/orders/admin/all");
    return response.data;
  },

  // Admin cập nhật trạng thái đơn hàng
  async adminUpdateOrderStatus(
    maDonHang: number,
    update_in: { trangThai?: string; ghiChu?: string }
  ): Promise<any> {
    const response = await axiosInstance.put(
      `/orders/admin/update-status/${maDonHang}`,
      update_in
    );
    return response.data;
  },

  async createOrder(
    order: OrderCreate,
    orderDetails: OrderDetailCreate[]
  ): Promise<OrderCheckoutResponse> {
    // Gửi đúng định dạng backend yêu cầu (order_data + order_details)
    const response = await axiosInstance.post("/orders/checkout", {
      order_data: order,
      order_details: orderDetails,
    });
    // Trả về response.data, có thể chứa payment_url
    return response.data;
  },

  async getOrderById(id: number | string): Promise<any> {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  async getOrdersByUser(userId: number | string): Promise<any[]> {
    const response = await axiosInstance.get(`/orders/history/${userId}`);
    return response.data;
  },
};
