import { StatsCard } from '@/components/dashboard/stats-card'
import { OrderTable } from '@/components/erp/order-table'
import { getOrderStats } from '@/lib/data/orders'
import { ShoppingCart, Clock, Truck, CheckCircle } from 'lucide-react'

export default function OrdersPage() {
  const stats = getOrderStats()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">Track and manage customer orders.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend="neutral"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingOrders}
          icon={Clock}
          trend="neutral"
        />
        <StatsCard
          title="In Transit"
          value={stats.shippedOrders}
          icon={Truck}
          trend="neutral"
        />
        <StatsCard
          title="Delivered"
          value={stats.deliveredOrders}
          change={Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}
          changeLabel="completion rate"
          icon={CheckCircle}
          trend="up"
        />
      </div>

      <OrderTable />
    </div>
  )
}
