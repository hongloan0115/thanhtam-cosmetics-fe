import axiosInstance from "@/utils/axios-instance";
import type { Product } from "./product";

export interface CartItem {
  maGioHang: number;
  maNguoiDung: number;
  maSanPham: number;
  soLuong: number;
  sanPham?: Product;
}

export const CartService = {
  async getItems(): Promise<CartItem[]> {
    const response = await axiosInstance.get("/cart/");
    return response.data;
  },

  async addItem(data: {
    maSanPham: number;
    soLuong?: number;
  }): Promise<CartItem> {
    const response = await axiosInstance.post("/cart/add", data);
    return response.data;
  },

  async updateItem(
    cartItemId: number,
    data: { soLuong: number }
  ): Promise<CartItem> {
    const response = await axiosInstance.put(`/cart/items/${cartItemId}`, data);
    return response.data;
  },

  async removeItem(cartItemId: number): Promise<void> {
    await axiosInstance.delete(`/cart/items/${cartItemId}`);
  },

  async clearCart(): Promise<void> {
    await axiosInstance.delete("/cart/clear");
  },
};
