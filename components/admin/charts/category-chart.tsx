"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getRevenueByCategoryByMonth } from "@/services/api/statistics";

const COLORS = ["#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d"];

export function CategoryChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRevenueByCategoryByMonth()
      .then((res) => {
        setData(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Doanh thu theo danh mục
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          {loading ? (
            <span>Đang tải...</span>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Tỷ lệ doanh thu"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
