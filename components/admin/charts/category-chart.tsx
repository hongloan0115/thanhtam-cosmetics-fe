"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dữ liệu mẫu
const data = [
  { name: "Chăm sóc da", value: 45 },
  { name: "Trang điểm", value: 25 },
  { name: "Nước hoa", value: 15 },
  { name: "Chăm sóc tóc", value: 10 },
  { name: "Khác", value: 5 },
]

const COLORS = ["#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d"]

export function CategoryChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Doanh thu theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ doanh thu"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
