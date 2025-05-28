import axiosInstance from "@/utils/axios-instance";

export interface Category {
  maDanhMuc: number;
  tenDanhMuc: string;
  moTa: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },

  async getById(id: number | string): Promise<Category> {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  async create(data: { tenDanhMuc: string; moTa: string }): Promise<Category> {
    const response = await axiosInstance.post("/categories", data);
    return response.data;
  },

  async update(
    id: number | string,
    data: { tenDanhMuc?: string; moTa?: string }
  ): Promise<Category> {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
