import axios from "axios";

export interface Province {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
}

export interface District {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
}

export interface Ward {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  district_code: number;
}

export const AddressService = {
  // Lấy danh sách tỉnh/thành phố
  async getProvinces(): Promise<Province[]> {
    const response = await axios.get("https://provinces.open-api.vn/api/p/");
    return response.data;
  },

  // Lấy tất cả quận/huyện (provinceCode = 0)
  async getDistrictsByProvince(provinceCode: number): Promise<District[]> {
    if (provinceCode === 0) {
      const response = await axios.get("https://provinces.open-api.vn/api/d/");
      return response.data;
    }
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    return response.data.districts;
  },

  // Lấy tất cả phường/xã (districtCode = 0)
  async getWardsByDistrict(districtCode: number): Promise<Ward[]> {
    if (districtCode === 0) {
      const response = await axios.get("https://provinces.open-api.vn/api/w/");
      return response.data;
    }
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  },
};
