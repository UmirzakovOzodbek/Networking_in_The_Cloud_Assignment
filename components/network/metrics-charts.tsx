"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts'
import { networkMetrics } from '@/lib/data/metrics'

const cpuChartConfig = {
  value: {
    label: "CPU %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const memoryChartConfig = {
  value: {
    label: "Memory %",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const networkChartConfig = {
  networkIn: {
    label: "Network In",
    color: "var(--chart-1)",
  },
  networkOut: {
    label: "Network Out",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function MetricsCharts() {
  const cpuData = networkMetrics.cpuUsage.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }))

  const memoryData = networkMetrics.memoryUsage.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }))

  const networkData = networkMetrics.networkIn.map((d, i) => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    networkIn: d.value,
    networkOut: networkMetrics.networkOut[i]?.value || 0
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">CPU Utilization</CardTitle>
          <CardDescription>Average across all instances (24h)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cpuChartConfig} className="h-[200px] w-full">
            <LineChart data={cpuData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false}
                fontSize={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                fontSize={10}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Memory Utilization</CardTitle>
          <CardDescription>Average across all instances (24h)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={memoryChartConfig} className="h-[200px] w-full">
            <LineChart data={memoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false}
                fontSize={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                fontSize={10}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Network Throughput</CardTitle>
          <CardDescription>Inbound and outbound traffic (MB/s)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={networkChartConfig} className="h-[200px] w-full">
            <AreaChart data={networkData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillNetworkIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-networkIn)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-networkIn)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillNetworkOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-networkOut)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-networkOut)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false}
                fontSize={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                fontSize={10}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="networkIn"
                stroke="var(--color-networkIn)"
                strokeWidth={2}
                fill="url(#fillNetworkIn)"
              />
              <Area
                type="monotone"
                dataKey="networkOut"
                stroke="var(--color-networkOut)"
                strokeWidth={2}
                fill="url(#fillNetworkOut)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
