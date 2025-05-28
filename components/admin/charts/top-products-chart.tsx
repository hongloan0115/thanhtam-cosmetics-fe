"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dữ liệu mẫu
const data = [
  { name: "Kem chống nắng", sales: 120 },
  { name: "Serum Vitamin C", sales: 98 },
  { name: "Sữa rửa mặt", sales: 86 },
  { name: "Kem dưỡng ẩm", sales: 75 },
  { name: "Mặt nạ dưỡng da", sales: 65 },
]

export function TopProductsChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" scale="band" width={100} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`${value} sản phẩm`, "Đã bán"]} />
              <Bar dataKey="sales" fill="#f472b6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
