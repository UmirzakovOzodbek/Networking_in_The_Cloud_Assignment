"use client"

import { StatsCard } from '@/components/dashboard/stats-card'
import { RevenueChart, SalesByCategoryChart } from '@/components/dashboard/charts'
import { SystemStatus } from '@/components/dashboard/system-status'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { orderStats } from '@/lib/data/orders'
import { customers } from '@/lib/data/customers'
import { warehouseStats } from '@/lib/data/inventory'
import { cloudStats } from '@/lib/data/metrics'
import { DollarSign, ShoppingCart, Users, Package, Server, Activity } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s an overview of your business.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Revenue"
          value={`$${(orderStats.totalRevenue / 1000).toFixed(0)}k`}
          change={12.5}
          changeLabel="from last month"
          icon={DollarSign}
          trend="up"
        />
        <StatsCard
          title="Orders"
          value={orderStats.totalOrders}
          change={8.2}
          changeLabel="from last month"
          icon={ShoppingCart}
          trend="up"
        />
        <StatsCard
          title="Customers"
          value={customers.length}
          change={5.1}
          changeLabel="new this month"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Inventory Items"
          value={warehouseStats.totalItems.toLocaleString()}
          change={-2.3}
          changeLabel="low stock items"
          icon={Package}
          trend="down"
        />
        <StatsCard
          title="EC2 Instances"
          value={`${cloudStats.runningInstances}/${cloudStats.totalInstances}`}
          change={cloudStats.avgCpuUsage}
          changeLabel="avg CPU"
          icon={Server}
          trend="neutral"
        />
        <StatsCard
          title="Health Checks"
          value={`${cloudStats.healthyChecks}/${cloudStats.totalChecks}`}
          change={100}
          changeLabel="uptime"
          icon={Activity}
          trend="up"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <SalesByCategoryChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentOrders />
        <SystemStatus />
      </div>
    </div>
  )
}
