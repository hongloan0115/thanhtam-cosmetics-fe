import axiosInstance from "@/utils/axios-instance";

export interface Image {
  maAnh: number;
  duongDanAnh: string;
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
  trangThai: boolean;
  maDanhMuc: number;
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
    trangThai?: boolean;
    maDanhMuc: number;
    images?: File[]; // Nhiều ảnh
  }): Promise<Product> {
    const formData = new FormData();
    formData.append("tenSanPham", product.tenSanPham);
    if (product.moTa !== undefined) formData.append("moTa", product.moTa);
    formData.append("giaBan", String(product.giaBan));
    formData.append("soLuongTonKho", String(product.soLuongTonKho));
    formData.append("trangThai", String(product.trangThai ?? true));
    formData.append("maDanhMuc", String(product.maDanhMuc));
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
      trangThai?: boolean;
      maDanhMuc?: number | null;
      keep_image_ids?: string; // Sửa: truyền chuỗi id, ví dụ "1,2,3"
      images?: File[]; // Ảnh mới muốn upload
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
    if (data.trangThai !== undefined)
      formData.append("trangThai", String(data.trangThai));
    if (data.maDanhMuc !== undefined && data.maDanhMuc !== null)
      formData.append("maDanhMuc", String(data.maDanhMuc));
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
};
