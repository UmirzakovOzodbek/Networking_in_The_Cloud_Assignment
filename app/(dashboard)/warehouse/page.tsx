"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import { warehouseStats, getShipmentStats } from '@/lib/data/inventory'
import { Warehouse, Boxes, Truck, AlertTriangle, Package, MapPin } from 'lucide-react'

const shipmentStats = getShipmentStats()

export default function WarehousePage() {
  const modules = [
    {
      title: 'Inventory Management',
      description: 'Track stock levels, locations, and manage warehouse zones',
      href: '/warehouse/inventory',
      icon: Boxes,
      stats: `${warehouseStats.totalItems} items`
    },
    {
      title: 'Shipment Tracking',
      description: 'Monitor shipments from warehouse to customer delivery',
      href: '/warehouse/shipments',
      icon: Truck,
      stats: `${shipmentStats.total} shipments`
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Warehouse Management System</h1>
        <p className="text-muted-foreground">Manage inventory and track shipments.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Inventory"
          value={warehouseStats.totalQuantity.toLocaleString()}
          icon={Package}
          trend="neutral"
        />
        <StatsCard
          title="Low Stock Items"
          value={warehouseStats.lowStockItems}
          icon={AlertTriangle}
          trend={warehouseStats.lowStockItems > 30 ? 'down' : 'neutral'}
        />
        <StatsCard
          title="In Transit"
          value={shipmentStats.inTransit}
          icon={Truck}
          trend="neutral"
        />
        <StatsCard
          title="Delivered Today"
          value={shipmentStats.delivered}
          change={Math.round((shipmentStats.delivered / shipmentStats.total) * 100)}
          changeLabel="delivery rate"
          icon={MapPin}
          trend="up"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.href} href={module.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{module.stats}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Zone Utilization</CardTitle>
            <CardDescription>Storage capacity by warehouse zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {warehouseStats.zoneStats.map((zone) => (
                <div key={zone.zone} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted font-bold">
                      {zone.zone}
                    </div>
                    <div>
                      <p className="font-medium">Zone {zone.zone}</p>
                      <p className="text-sm text-muted-foreground">{zone.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{zone.utilization}%</p>
                    <p className="text-sm text-muted-foreground">{zone.quantity.toLocaleString()} units</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Status</CardTitle>
            <CardDescription>Current shipment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Preparing', value: shipmentStats.preparing, color: 'bg-muted' },
                { label: 'Picked Up', value: shipmentStats.pickedUp, color: 'bg-secondary' },
                { label: 'In Transit', value: shipmentStats.inTransit, color: 'bg-warning/20' },
                { label: 'Out for Delivery', value: shipmentStats.outForDelivery, color: 'bg-info/20' },
                { label: 'Delivered', value: shipmentStats.delivered, color: 'bg-success/20' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-3 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
