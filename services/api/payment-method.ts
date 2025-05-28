import axiosInstance from "@/utils/axios-instance";

export interface PaymentMethod {
  maPhuongThuc: number;
  tenPhuongThuc: string;
  moTa?: string;
  daKichHoat: boolean;
}

export const PaymentMethodService = {
  async getAll(): Promise<PaymentMethod[]> {
    const response = await axiosInstance.get("/payment-methods");
    return response.data;
  },
  async getById(id: number | string): Promise<PaymentMethod> {
    const response = await axiosInstance.get(`/payment-methods/${id}`);
    return response.data;
  },
  async create(
    data: Omit<PaymentMethod, "maPhuongThuc">
  ): Promise<PaymentMethod> {
    const response = await axiosInstance.post("/payment-methods", data);
    return response.data;
  },
  async update(
    id: number | string,
    data: Partial<Omit<PaymentMethod, "maPhuongThuc">>
  ): Promise<PaymentMethod> {
    const response = await axiosInstance.put(`/payment-methods/${id}`, data);
    return response.data;
  },
  async delete(id: number | string): Promise<void> {
    await axiosInstance.delete(`/payment-methods/${id}`);
  },
};
