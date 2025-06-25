"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSalesChart } from "@/services/api/statistics";

export function SalesChart() {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [data, setData] = useState<{ name: string; sales: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSalesChart(timeRange)
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [timeRange]);

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          Doanh số bán hàng
        </CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as any)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">7 ngày qua</SelectItem>
            <SelectItem value="weekly">4 tuần qua</SelectItem>
            <SelectItem value="monthly">12 tháng qua</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={loading ? [] : data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toLocaleString()}đ`}
                width={90}
              />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()}đ`,
                  "Doanh số",
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#f472b6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {loading && (
            <div className="text-center text-gray-400 mt-4">
              Đang tải dữ liệu...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
