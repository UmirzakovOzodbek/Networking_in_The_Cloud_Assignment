"use client"

import { StatsCard } from '@/components/dashboard/stats-card'
import { InventoryGrid } from '@/components/warehouse/inventory-grid'
import { warehouseStats, getLowStockInventory } from '@/lib/data/inventory'
import { Boxes, Package, AlertTriangle, MapPin } from 'lucide-react'

const stats = warehouseStats
const lowStock = getLowStockInventory()

export default function InventoryPage() {

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Track stock levels and warehouse locations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Items"
          value={stats.totalItems.toLocaleString()}
          icon={Boxes}
          trend="neutral"
        />
        <StatsCard
          title="Total Quantity"
          value={stats.totalQuantity.toLocaleString()}
          icon={Package}
          trend="neutral"
        />
        <StatsCard
          title="Reserved"
          value={stats.reservedQuantity.toLocaleString()}
          icon={MapPin}
          trend="neutral"
        />
        <StatsCard
          title="Low Stock"
          value={lowStock.length}
          change={lowStock.length}
          changeLabel="items below 30"
          icon={AlertTriangle}
          trend={lowStock.length > 50 ? 'down' : 'neutral'}
        />
      </div>

      <InventoryGrid />
    </div>
  )
}
