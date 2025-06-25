"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBestSellersChart } from "@/services/api/statistics";

export function TopProductsChart() {
  const [data, setData] = useState<{ name: string; sales: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBestSellersChart(5)
      .then((res: any) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Sản phẩm bán chạy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Đang tải...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  domain={[0, "dataMax + 1"]}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  scale="band"
                  width={0}
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value} sản phẩm`, "Đã bán"]}
                />
                <Bar dataKey="sales" fill="#f472b6" radius={[0, 4, 4, 0]}>
                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    style={{
                      fill: "#fff",
                      fontWeight: 500,
                      fontSize: 12,
                      textAnchor: "start",
                    }}
                    offset={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
