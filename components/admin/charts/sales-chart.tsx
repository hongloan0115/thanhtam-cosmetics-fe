"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dữ liệu mẫu
const dailyData = [
  { name: "01/05", sales: 4000 },
  { name: "02/05", sales: 3000 },
  { name: "03/05", sales: 5000 },
  { name: "04/05", sales: 2780 },
  { name: "05/05", sales: 1890 },
  { name: "06/05", sales: 2390 },
  { name: "07/05", sales: 3490 },
]

const weeklyData = [
  { name: "Tuần 1", sales: 15000 },
  { name: "Tuần 2", sales: 18000 },
  { name: "Tuần 3", sales: 12000 },
  { name: "Tuần 4", sales: 20000 },
]

const monthlyData = [
  { name: "T1", sales: 65000 },
  { name: "T2", sales: 58000 },
  { name: "T3", sales: 90000 },
  { name: "T4", sales: 81000 },
  { name: "T5", sales: 56000 },
  { name: "T6", sales: 55000 },
  { name: "T7", sales: 40000 },
  { name: "T8", sales: 73000 },
  { name: "T9", sales: 90000 },
  { name: "T10", sales: 65000 },
  { name: "T11", sales: 88000 },
  { name: "T12", sales: 120000 },
]

export function SalesChart() {
  const [timeRange, setTimeRange] = useState("daily")

  const data = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }[timeRange]

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Doanh số bán hàng</CardTitle>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
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
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()}đ`} />
              <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, "Doanh số"]} />
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
        </div>
      </CardContent>
    </Card>
  )
}
