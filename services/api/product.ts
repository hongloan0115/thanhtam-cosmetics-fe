import axiosInstance from "@/utils/axios-instance";

export interface Image {
  maHinhAnh: number; // sửa lại từ maAnh -> maHinhAnh
  duongDan: string;
  maAnhClound: string;
  moTa: string;
  laAnhChinh: number;
  maSanPham: number;
}

export interface Product {
  maSanPham: number;
  tenSanPham: string;
  moTa?: string;
  giaBan: number;
  soLuongTonKho: number;
  giamGia?: number;
  trangThai: boolean;
  maDanhMuc: number;
  maThuongHieu?: number;
  ngayTao: string;
  ngayCapNhat: string;
  hinhAnh: Image[];
}

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const response = await axiosInstance.get("/products");
    return response.data;
  },

  async getById(id: number | string): Promise<Product> {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Gửi multipart/form-data với nhiều ảnh (images)
  async create(product: {
    tenSanPham: string;
    moTa?: string;
    giaBan: number;
    soLuongTonKho: number;
    giamGia?: number;
    trangThai?: boolean;
    maDanhMuc: number;
    maThuongHieu?: number;
    images?: File[]; // Nhiều ảnh
  }): Promise<Product> {
    const formData = new FormData();
    formData.append("tenSanPham", product.tenSanPham);
    if (product.moTa !== undefined) formData.append("moTa", product.moTa);
    formData.append("giaBan", String(product.giaBan));
    formData.append("soLuongTonKho", String(product.soLuongTonKho));
    if (product.giamGia !== undefined)
      formData.append("giamGia", String(product.giamGia));
    // Không append trangThai khi tạo mới
    formData.append("maDanhMuc", String(product.maDanhMuc));
    if (product.maThuongHieu !== undefined)
      formData.append("maThuongHieu", String(product.maThuongHieu));
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        formData.append("images", img);
      });
    }

    const response = await axiosInstance.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async update(
    id: number | string,
    data: {
      tenSanPham?: string;
      moTa?: string;
      giaBan?: number;
      soLuongTonKho?: number;
      giamGia?: number;
      trangThai?: string; // sửa lại kiểu cho đúng là string
      maDanhMuc?: number | null;
      maThuongHieu?: number | null;
      keep_image_ids?: string;
      images?: File[];
    }
  ): Promise<Product> {
    const formData = new FormData();
    if (data.tenSanPham !== undefined)
      formData.append("tenSanPham", data.tenSanPham);
    if (data.moTa !== undefined) formData.append("moTa", data.moTa);
    if (data.giaBan !== undefined)
      formData.append("giaBan", String(data.giaBan));
    if (data.soLuongTonKho !== undefined)
      formData.append("soLuongTonKho", String(data.soLuongTonKho));
    if (data.giamGia !== undefined)
      formData.append("giamGia", String(data.giamGia));
    // Không append trangThai khi cập nhật, trạng thái do backend xác định
    // if (data.trangThai !== undefined)
    //   formData.append("trangThai", data.trangThai);
    if (data.maDanhMuc !== undefined && data.maDanhMuc !== null)
      formData.append("maDanhMuc", String(data.maDanhMuc));
    if (data.maThuongHieu !== undefined && data.maThuongHieu !== null)
      formData.append("maThuongHieu", String(data.maThuongHieu));
    if (data.keep_image_ids) {
      formData.append("keep_image_ids", data.keep_image_ids);
    }
    if (data.images && data.images.length > 0) {
      data.images.forEach((img) => {
        formData.append("images", img);
      });
    }

    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await axiosInstance.delete(`/products/${id}`);
  },

  // Tìm kiếm sản phẩm theo tên
  async search(q: string): Promise<Product[]> {
    const response = await axiosInstance.get("/products/search", {
      params: { q },
    });
    return response.data;
  },

  // Lọc sản phẩm theo các điều kiện
  async filter(params: {
    maDanhMuc?: number;
    giaMin?: number;
    giaMax?: number;
    trangThai?: boolean;
    thuongHieu?: string[]; // sửa lại thành mảng string
  }): Promise<Product[]> {
    const response = await axiosInstance.get("/products/filter", {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString();
      },
    });
    return response.data;
  },
};
