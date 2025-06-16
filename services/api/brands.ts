import axiosInstance from "@/utils/axios-instance";

export interface Brand {
  maThuongHieu: number;
  tenThuongHieu: string;
  moTa: string;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
  daXoa: boolean;
  soLuongSanPham: number;
}

export const BrandService = {
  async getAll(): Promise<Brand[]> {
    const response = await axiosInstance.get("/brands");
    return response.data;
  },

  async getById(id: number): Promise<Brand> {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data;
  },

  async create(data: {
    tenThuongHieu: string;
    moTa?: string;
    trangThai?: boolean;
    daXoa?: boolean;
  }): Promise<Brand> {
    const payload = {
      tenThuongHieu: data.tenThuongHieu,
      moTa: data.moTa ?? "",
      trangThai: typeof data.trangThai === "boolean" ? data.trangThai : true,
      daXoa: typeof data.daXoa === "boolean" ? data.daXoa : false,
    };
    const response = await axiosInstance.post("/brands", payload);
    return response.data;
  },

  async update(
    id: number,
    data: {
      tenThuongHieu?: string;
      moTa?: string;
      trangThai?: boolean;
      daXoa?: boolean;
    }
  ): Promise<Brand> {
    const response = await axiosInstance.put(`/brands/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/brands/${id}`);
  },

  async getAllWithPaging(
    page = 1,
    limit = 10
  ): Promise<{ data: Brand[]; total: number }> {
    const response = await axiosInstance.get("/brands", {
      params: { page, limit },
    });
    // Đảm bảo trả về đúng cấu trúc dữ liệu
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
      };
    } else if (response.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        total: response.data.total ?? response.data.data.length ?? 0,
      };
    } else {
      return {
        data: [],
        total: 0,
      };
    }
  },
};
