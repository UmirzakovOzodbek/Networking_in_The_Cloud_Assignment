"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { shipments } from '@/lib/data/inventory'
import type { Shipment } from '@/lib/types'
import { Search, ChevronLeft, ChevronRight, Package, Truck, MapPin, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

const ITEMS_PER_PAGE = 10

export function ShipmentTracker() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const statuses: Shipment['status'][] = ['Preparing', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredShipments.length / ITEMS_PER_PAGE)
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getStatusBadge = (status: Shipment['status']) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="outline" className="border-success/30 bg-success/10 text-success">{status}</Badge>
      case 'Out for Delivery':
        return <Badge variant="outline" className="border-info/30 bg-info/10 text-info">{status}</Badge>
      case 'In Transit':
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">{status}</Badge>
      case 'Picked Up':
        return <Badge variant="secondary">{status}</Badge>
      case 'Preparing':
        return <Badge variant="outline">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Preparing':
        return <Package className="size-4" />
      case 'Picked Up':
        return <Truck className="size-4" />
      case 'In Transit':
        return <Truck className="size-4" />
      case 'Out for Delivery':
        return <MapPin className="size-4" />
      case 'Delivered':
        return <CheckCircle className="size-4" />
      default:
        return <Package className="size-4" />
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, tracking, or customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            {paginatedShipments.map((shipment) => (
              <div
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                  selectedShipment?.id === shipment.id ? 'border-primary bg-muted/50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{shipment.id}</p>
                    <p className="text-sm text-muted-foreground">{shipment.customerName}</p>
                  </div>
                  {getStatusBadge(shipment.status)}
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{shipment.carrier}</span>
                  <span className="font-mono">{shipment.trackingNumber}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {filteredShipments.length} shipments
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedShipment ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Shipment ID</p>
                <p className="font-medium">{selectedShipment.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium">{selectedShipment.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedShipment.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carrier</p>
                <p className="font-medium">{selectedShipment.carrier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono text-sm">{selectedShipment.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                <p className="font-medium">
                  {format(new Date(selectedShipment.estimatedDelivery), 'MMM d, yyyy')}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-4">Tracking History</p>
                <ScrollArea className="h-[200px]">
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                    {selectedShipment.updates.map((update, index) => (
                      <div key={index} className="relative pb-4">
                        <div className="absolute -left-4 flex size-4 items-center justify-center rounded-full bg-background border border-border">
                          <div className="size-2 rounded-full bg-primary" />
                        </div>
                        <div className="ml-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(update.status)}
                            <span className="text-sm font-medium">{update.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{update.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(update.timestamp), 'MMM d, HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Select a shipment to view details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
