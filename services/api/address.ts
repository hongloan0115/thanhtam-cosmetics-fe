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

  // Lấy danh sách quận/huyện theo tỉnh
  async getDistrictsByProvince(provinceCode: number): Promise<District[]> {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    return response.data.districts;
  },

  // Lấy danh sách phường/xã theo quận
  async getWardsByDistrict(districtCode: number): Promise<Ward[]> {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  },
};
