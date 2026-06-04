"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { getMonthlyRevenue } from '@/lib/data/orders'

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function RevenueChart() {
  const data = getMonthlyRevenue()
  
  const formattedData = data.map(item => ({
    ...item,
    monthLabel: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })
  }))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue trend for 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="monthLabel" 
              tickLine={false} 
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />} 
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="url(#fillRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const categoryData = [
  { category: 'Shirts', sales: 12500 },
  { category: 'Pants', sales: 9800 },
  { category: 'Dresses', sales: 8200 },
  { category: 'Jackets', sales: 7100 },
  { category: 'Accessories', sales: 4300 },
]

const categoryChartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SalesByCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
        <CardDescription>Revenue breakdown by product category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={categoryChartConfig} className="h-[300px] w-full">
          <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
            <XAxis 
              type="number" 
              tickLine={false} 
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              tickLine={false} 
              axisLine={false}
              fontSize={12}
              width={80}
            />
            <ChartTooltip 
              content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />} 
            />
            <Bar 
              dataKey="sales" 
              fill="var(--color-sales)" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
