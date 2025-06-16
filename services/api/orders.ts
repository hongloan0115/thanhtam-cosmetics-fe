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
  // Lấy chi tiết đơn hàng theo mã đơn hàng (cho admin hoặc user)
  async getOrderById(orderId: number | string): Promise<any> {
    const response = await axiosInstance.get(`/orders/admin/order/${orderId}`);
    return response.data;
  },

  // Lấy tất cả đơn hàng (cho admin)
  async getAllOrdersForAdmin(): Promise<any[]> {
    const response = await axiosInstance.get(`/orders/admin/all`);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng (cho admin)
  async updateOrderStatus(
    orderId: number | string,
    trangThai: string
  ): Promise<any> {
    const response = await axiosInstance.patch(
      `/orders/admin/order/update-status/${orderId}`,
      { trangThai }
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

  async getOrdersByUser(userId: number | string): Promise<any[]> {
    const response = await axiosInstance.get(`/orders/history/${userId}`);
    return response.data;
  },
};
