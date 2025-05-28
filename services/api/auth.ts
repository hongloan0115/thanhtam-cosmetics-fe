import axiosInstance from "@/utils/axios-instance";

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw { message: "Tên đăng nhập hoặc mật khẩu không đúng." };
      }
      throw {
        message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      };
    }
  },

  async register(email: string, password: string, role: string = "customer") {
    const response = await axiosInstance.post("/auth/register", {
      email,
      password,
      role,
    });
    return response.data;
  },

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get("/auth/profile");
      const user = response.data;
      const roles = Array.isArray(user.vaiTro)
        ? user.vaiTro.map((role: any) => role.tenVaiTro)
        : [];
      return {
        ...user,
        roles,
      };
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("accessToken");
        throw {
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      throw {
        message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      };
    }
  },

  async updateProfile(fullName: string, phone: string) {
    const response = await axiosInstance.put("/user/profile", {
      hoTen: fullName,
      soDienThoai: phone,
    });
    return response.data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const response = await axiosInstance.post("/user/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
