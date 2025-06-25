"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/stats-card";
import { SalesChart } from "@/components/admin/charts/sales-chart";
import { CategoryChart } from "@/components/admin/charts/category-chart";
import { TopProductsChart } from "@/components/admin/charts/top-products-chart";
import { RecentOrders } from "@/components/admin/recent-orders";
import { DollarSign, ShoppingBag, Users, CreditCard } from "lucide-react";
import { getDashboardSummary } from "@/services/api/statistics";

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pt-6 px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">
          Tổng quan về hoạt động kinh doanh của cửa hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Doanh thu"
          value={
            loading || !summary ? "..." : formatCurrency(summary.revenue.total)
          }
          description="Tổng doanh thu tháng này"
          icon={DollarSign}
          trend={summary?.revenue?.rate >= 0 ? "up" : "down"}
          trendValue={
            loading || !summary
              ? ""
              : `${Math.abs(summary.revenue.rate)}% so với tháng trước`
          }
        />
        <StatsCard
          title="Đơn hàng"
          value={loading || !summary ? "..." : summary.orders.total}
          description="Tổng số đơn hàng tháng này"
          icon={ShoppingBag}
          trend={summary?.orders?.rate >= 0 ? "up" : "down"}
          trendValue={
            loading || !summary
              ? ""
              : `${Math.abs(summary.orders.rate)}% so với tháng trước`
          }
        />
        <StatsCard
          title="Khách hàng"
          value={loading || !summary ? "..." : summary.customers.total}
          description="Khách hàng mới tháng này"
          icon={Users}
          trend={summary?.customers?.rate >= 0 ? "up" : "down"}
          trendValue={
            loading || !summary
              ? ""
              : `${Math.abs(summary.customers.rate)}% so với tháng trước`
          }
        />
        <StatsCard
          title="Giá trị đơn hàng"
          value={
            loading || !summary
              ? "..."
              : formatCurrency(summary.average_order_value.value)
          }
          description="Giá trị trung bình mỗi đơn hàng"
          icon={CreditCard}
          trend={summary?.average_order_value?.rate >= 0 ? "up" : "down"}
          trendValue={
            loading || !summary
              ? ""
              : `${Math.abs(
                  summary.average_order_value.rate
                )}% so với tháng trước`
          }
        />
      </div>

      {/* Sales Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Doanh số bán hàng</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SalesChart />
        </div>
      </div>

      {/* Category & Top Products Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CategoryChart />
        <TopProductsChart />
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Đơn hàng gần đây</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
