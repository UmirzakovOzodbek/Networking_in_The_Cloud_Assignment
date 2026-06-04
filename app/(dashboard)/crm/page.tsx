"use client"

import { StatsCard } from '@/components/dashboard/stats-card'
import { CustomerTable } from '@/components/crm/customer-table'
import { customers, getCustomersBySegment, getTopCustomers } from '@/lib/data/customers'
import { Users, Crown, UserCheck, UserPlus } from 'lucide-react'

const premiumCustomers = getCustomersBySegment('Premium')
const regularCustomers = getCustomersBySegment('Regular')
const newCustomers = getCustomersBySegment('New')

export default function CRMPage() {
  const topCustomers = getTopCustomers(10)
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Relationship Management</h1>
        <p className="text-muted-foreground">Manage and track your wholesale customers.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Customers"
          value={customers.length}
          change={5.2}
          changeLabel="this month"
          icon={Users}
          trend="up"
        />
        <StatsCard
          title="Premium Customers"
          value={premiumCustomers.length}
          change={8.1}
          changeLabel="conversion"
          icon={Crown}
          trend="up"
        />
        <StatsCard
          title="Regular Customers"
          value={regularCustomers.length}
          icon={UserCheck}
          trend="neutral"
        />
        <StatsCard
          title="New Customers"
          value={newCustomers.length}
          change={12.5}
          changeLabel="this month"
          icon={UserPlus}
          trend="up"
        />
      </div>

      <CustomerTable />
    </div>
  )
}
