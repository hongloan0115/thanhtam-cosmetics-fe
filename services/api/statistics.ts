import axiosInstance from "@/utils/axios-instance";

// Lấy doanh thu theo từng ngày trong tháng
export const getRevenueByDay = (year?: number, month?: number) => {
  return axiosInstance.get("/statistics/revenue/day", {
    params: { year, month },
  });
};

// Lấy doanh thu theo từng tháng trong năm
export const getRevenueByMonth = (year?: number) => {
  return axiosInstance.get("/statistics/revenue/month", { params: { year } });
};

// Lấy doanh thu theo từng năm
export const getRevenueByYear = () => {
  return axiosInstance.get("/statistics/revenue/year");
};

// Lấy top sản phẩm bán chạy nhất (top N theo tổng số lượng bán ra)
export const getBestSellers = (limit = 10) => {
  return axiosInstance.get("/statistics/bestsellers", { params: { limit } });
};

// Lấy dữ liệu sản phẩm bán chạy cho biểu đồ (dùng cho dashboard)
export const getBestSellersChart = (limit = 5) => {
  return axiosInstance.get("/statistics/bestsellers/chart", {
    params: { limit },
  });
};

// Lấy thống kê số lượng đơn hàng theo trạng thái
export const getOrdersByStatus = () => {
  return axiosInstance.get("/statistics/orders-by-status");
};

// Lấy dữ liệu tổng hợp cho dashboard: tổng doanh thu, đơn hàng, khách hàng, giá trị đơn hàng trung bình, tỉ lệ tăng so với tháng trước
export const getDashboardSummary = (year?: number, month?: number) => {
  return axiosInstance.get("/statistics/dashboard/summary", {
    params: { year, month },
  });
};

// Lấy doanh thu theo danh mục trong tháng (dùng cho dashboard)
export const getRevenueByCategoryByMonth = (year?: number, month?: number) => {
  return axiosInstance.get("/statistics/revenue/category-by-month", {
    params: { year, month },
  });
};

// Lấy dữ liệu cho biểu đồ doanh số bán hàng (daily, weekly, monthly)
export const getSalesChart = (
  time_range: "daily" | "weekly" | "monthly" = "daily"
) => {
  return axiosInstance.get("/statistics/sales-chart", {
    params: { time_range },
  });
};
