"use client";

import type { Metadata } from "next";
import { StatsCard } from "@/components/admin/stats-card";
import { SalesChart } from "@/components/admin/charts/sales-chart";
import { CategoryChart } from "@/components/admin/charts/category-chart";
import { TopProductsChart } from "@/components/admin/charts/top-products-chart";
import { RecentOrders } from "@/components/admin/recent-orders";
import { DollarSign, ShoppingBag, Users, CreditCard } from "lucide-react";

export default function AdminDashboard() {
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
          value="25,500,000đ"
          description="Tổng doanh thu tháng này"
          icon={DollarSign}
          trend="up"
          trendValue="12% so với tháng trước"
        />
        <StatsCard
          title="Đơn hàng"
          value="120"
          description="Tổng số đơn hàng tháng này"
          icon={ShoppingBag}
          trend="up"
          trendValue="8% so với tháng trước"
        />
        <StatsCard
          title="Khách hàng"
          value="45"
          description="Khách hàng mới tháng này"
          icon={Users}
          trend="down"
          trendValue="3% so với tháng trước"
        />
        <StatsCard
          title="Giá trị đơn hàng"
          value="212,500đ"
          description="Giá trị trung bình mỗi đơn hàng"
          icon={CreditCard}
          trend="up"
          trendValue="5% so với tháng trước"
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
