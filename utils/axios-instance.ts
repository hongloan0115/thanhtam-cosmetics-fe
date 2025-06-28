import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl, // Ensure base URL is set correctly
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Thêm interceptor cho response để tự động refresh token khi access token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi 401 và chưa thử refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh-token`,
            {
              refresh_token: refreshToken,
            }
          );
          const { access_token } = res.data;
          if (access_token) {
            localStorage.setItem("accessToken", access_token);
            // Gán lại header Authorization cho request gốc
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Nếu refresh token cũng hết hạn, xóa token và reload/redirect
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        // Không có refresh token, chuyển hướng về login
        localStorage.removeItem("accessToken");
        // window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
