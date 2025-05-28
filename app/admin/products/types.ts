export interface Product {
  maSanPham: number;
  tenSanPham: string;
  moTa?: string;
  giaBan: number;
  soLuongTonKho: number;
  trangThai: boolean;
  maDanhMuc: number | null;
  ngayTao: string;
  ngayCapNhat: string;
  hinhAnh: {
    maAnh: number;
    duongDanAnh: string;
    maAnhClound: string;
    moTa: string;
    laAnhChinh: number;
    maSanPham: number;
  }[];
}

export interface ProductForm {
  maSanPham?: number;
  tenSanPham: string;
  moTa?: string;
  giaBan: number;
  soLuongTonKho: number;
  trangThai?: boolean;
  maDanhMuc: number | null;
  images: (File | string)[]; // dùng cho preview phía frontend
  featured: boolean;
}
