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
      if (error.response && error.response.status === 400) {
        if (error.response.data?.detail === "Người dùng không tồn tại.") {
          throw { message: "Người dùng không tồn tại." };
        }
        if (error.response.data?.detail === "Tài khoản đã bị khóa") {
          throw { message: "Tài khoản đã bị khóa." };
        }
        throw { message: "Tên đăng nhập hoặc mật khẩu không đúng." };
      }
      // Bổ sung xử lý status 403 (backend trả về khi tài khoản bị khóa)
      if (error.response && error.response.status === 403) {
        if (error.response.data?.detail === "Tài khoản đã bị khóa") {
          throw { message: "Tài khoản đã bị khóa." };
        }
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
    // Trả về message thành công
    return {
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
      ...response.data,
    };
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
    const payload: any = {
      hoTen: fullName,
      soDienThoai: phone,
    };
    const response = await axiosInstance.put("/auth/profile", payload);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    // Gửi đúng tên biến cho backend: old_password và new_password
    const response = await axiosInstance.post("/auth/change-password", {
      old_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  async loginAndGetUser(email: string, password: string) {
    // Đăng nhập và lấy access_token
    const { access_token } = await this.login(email, password);
    localStorage.setItem("accessToken", access_token);
    // Lấy thông tin user
    const userInfo = await this.getCurrentUser();
    return userInfo;
  },
};
