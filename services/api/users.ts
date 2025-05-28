import axiosInstance from "@/utils/axios-instance";

export interface Role {
  maVaiTro: number;
  tenVaiTro: string;
  moTa?: string;
}

export interface User {
  maNguoiDung: number;
  tenNguoiDung?: string;
  hoTen?: string;
  soDienThoai?: string;
  email: string;
  daXacThucEmail: boolean;
  trangThai: boolean;
  vaiTro: Role[];
}

export const UserService = {
  async getAll(skip = 0, limit = 100): Promise<User[]> {
    const response = await axiosInstance.get("/users", {
      params: { skip, limit },
    });
    return response.data;
  },

  async getById(id: number | string): Promise<User> {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  async create(user: {
    tenNguoiDung?: string;
    hoTen?: string;
    soDienThoai?: string;
    email: string;
    password: string;
    vaiTro?: number[];
  }): Promise<User> {
    const response = await axiosInstance.post("/users", user);
    return response.data;
  },

  async update(
    id: number | string,
    data: {
      tenNguoiDung?: string;
      hoTen?: string;
      soDienThoai?: string;
      email?: string;
      password?: string;
      vaiTro?: number[];
      trangThai?: boolean;
    }
  ): Promise<User> {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number | string): Promise<User> {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};
