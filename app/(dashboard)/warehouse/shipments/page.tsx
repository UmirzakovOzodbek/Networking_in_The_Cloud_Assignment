import { StatsCard } from '@/components/dashboard/stats-card'
import { ShipmentTracker } from '@/components/warehouse/shipment-tracker'
import { getShipmentStats } from '@/lib/data/inventory'
import { Truck, Package, MapPin, CheckCircle } from 'lucide-react'

export default function ShipmentsPage() {
  const stats = getShipmentStats()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shipment Tracking</h1>
        <p className="text-muted-foreground">Monitor and track all shipments.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Shipments"
          value={stats.total}
          icon={Package}
          trend="neutral"
        />
        <StatsCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          trend="neutral"
        />
        <StatsCard
          title="Out for Delivery"
          value={stats.outForDelivery}
          icon={MapPin}
          trend="neutral"
        />
        <StatsCard
          title="Delivered"
          value={stats.delivered}
          change={Math.round((stats.delivered / stats.total) * 100)}
          changeLabel="delivery rate"
          icon={CheckCircle}
          trend="up"
        />
      </div>

      <ShipmentTracker />
    </div>
  )
}
