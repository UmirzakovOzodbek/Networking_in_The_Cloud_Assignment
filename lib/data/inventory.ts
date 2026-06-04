import type { InventoryItem, Shipment } from '@/lib/types'
import { products } from './products'
import { orders } from './orders'

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

const warehouseZones = ['A', 'B', 'C', 'D', 'E']
const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics']

function generateInventory(): InventoryItem[] {
  const random = seededRandom(111)
  
  return products.slice(0, 500).map((product, index) => {
    const zone = warehouseZones[Math.floor(random() * warehouseZones.length)]
    const row = Math.floor(1 + random() * 20)
    const shelf = Math.floor(1 + random() * 10)
    const reservedQuantity = Math.floor(product.stockQuantity * random() * 0.2)
    
    return {
      id: `INV-${String(index + 1).padStart(5, '0')}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      location: `${zone}${String(row).padStart(2, '0')}-${String(shelf).padStart(2, '0')}`,
      quantity: product.stockQuantity,
      reservedQuantity,
      availableQuantity: product.stockQuantity - reservedQuantity,
      lastUpdated: new Date(2024, Math.floor(random() * 6), Math.floor(1 + random() * 28)).toISOString()
    }
  })
}

function generateShipments(): Shipment[] {
  const random = seededRandom(222)
  const shipments: Shipment[] = []
  const shippedOrders = orders.filter(o => ['Shipped', 'Delivered'].includes(o.status))
  const statusFlow: Shipment['status'][] = ['Preparing', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
  const locations = ['Distribution Center', 'Regional Hub', 'Local Facility', 'On Vehicle', 'Destination']

  shippedOrders.slice(0, 200).forEach((order, index) => {
    const carrier = carriers[Math.floor(random() * carriers.length)]
    const isDelivered = order.status === 'Delivered'
    const statusIndex = isDelivered ? 4 : Math.floor(1 + random() * 3)
    const status = statusFlow[statusIndex]
    
    const createdDate = new Date(order.updatedAt)
    const estimatedDelivery = new Date(createdDate.getTime() + (3 + Math.floor(random() * 5)) * 24 * 60 * 60 * 1000)
    
    const updates = []
    for (let i = 0; i <= statusIndex; i++) {
      const updateTime = new Date(createdDate.getTime() + i * (random() * 24 * 60 * 60 * 1000))
      updates.push({
        timestamp: updateTime.toISOString(),
        status: statusFlow[i],
        location: locations[i]
      })
    }

    shipments.push({
      id: `SHP-${String(index + 1).padStart(5, '0')}`,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      carrier,
      trackingNumber: `${carrier.substring(0, 3).toUpperCase()}${Math.floor(100000000 + random() * 900000000)}`,
      status,
      estimatedDelivery: estimatedDelivery.toISOString().split('T')[0],
      actualDelivery: isDelivered ? estimatedDelivery.toISOString().split('T')[0] : undefined,
      createdAt: createdDate.toISOString(),
      updates
    })
  })

  return shipments
}

export const inventory = generateInventory()
export const shipments = generateShipments()

export function getInventoryByLocation(zone: string): InventoryItem[] {
  return inventory.filter(item => item.location.startsWith(zone))
}

export function getLowStockInventory(): InventoryItem[] {
  return inventory.filter(item => item.availableQuantity < 30)
}

export function getWarehouseStats() {
  const totalItems = inventory.length
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockItems = inventory.filter(item => item.availableQuantity < 30).length
  const reservedQuantity = inventory.reduce((sum, item) => sum + item.reservedQuantity, 0)
  
  const zoneStats = warehouseZones.map(zone => {
    const zoneItems = inventory.filter(item => item.location.startsWith(zone))
    return {
      zone,
      items: zoneItems.length,
      quantity: zoneItems.reduce((sum, item) => sum + item.quantity, 0),
      utilization: Math.round(zoneItems.length / (totalItems / 5) * 100)
    }
  })

  return {
    totalItems,
    totalQuantity,
    lowStockItems,
    reservedQuantity,
    availableQuantity: totalQuantity - reservedQuantity,
    zoneStats
  }
}

export function getShipmentsByStatus(status: Shipment['status']): Shipment[] {
  return shipments.filter(s => s.status === status)
}

export function getRecentShipments(limit: number = 10): Shipment[] {
  return [...shipments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

export function getShipmentStats() {
  return {
    total: shipments.length,
    preparing: shipments.filter(s => s.status === 'Preparing').length,
    pickedUp: shipments.filter(s => s.status === 'Picked Up').length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    outForDelivery: shipments.filter(s => s.status === 'Out for Delivery').length,
    delivered: shipments.filter(s => s.status === 'Delivered').length
  }
}
