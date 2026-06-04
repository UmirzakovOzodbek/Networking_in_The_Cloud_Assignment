// Customer Types
export interface Customer {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  segment: 'Premium' | 'Regular' | 'New'
  totalSpent: number
  ordersCount: number
  lastOrderDate: string
  createdAt: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
}

// Product Types
export interface Product {
  id: string
  sku: string
  name: string
  category: 'Shirts' | 'Pants' | 'Dresses' | 'Jackets' | 'Accessories'
  price: number
  costPrice: number
  stockQuantity: number
  reorderLevel: number
  supplier: string
  imageUrl: string
  createdAt: string
}

// Order Types
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentStatus: 'Pending' | 'Paid' | 'Refunded'
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

// Invoice Types
export interface Invoice {
  id: string
  orderId: string
  customerId: string
  customerName: string
  amount: number
  tax: number
  total: number
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
  dueDate: string
  paidDate?: string
  createdAt: string
}

// Inventory Types
export interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  location: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  lastUpdated: string
}

// Shipment Types
export interface Shipment {
  id: string
  orderId: string
  customerId: string
  customerName: string
  carrier: string
  trackingNumber: string
  status: 'Preparing' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered'
  estimatedDelivery: string
  actualDelivery?: string
  createdAt: string
  updates: ShipmentUpdate[]
}

export interface ShipmentUpdate {
  timestamp: string
  status: string
  location: string
}

// Cloud Infrastructure Types
export interface AWSService {
  id: string
  name: string
  type: string
  status: 'Operational' | 'Degraded' | 'Outage'
  region: string
  details: Record<string, string | number>
}

export interface EC2Instance {
  id: string
  name: string
  type: string
  status: 'Running' | 'Stopped' | 'Pending'
  az: string
  privateIp: string
  publicIp?: string
  cpuUsage: number
  memoryUsage: number
}

export interface SecurityGroup {
  id: string
  name: string
  description: string
  vpcId: string
  inboundRules: SecurityRule[]
  outboundRules: SecurityRule[]
}

export interface SecurityRule {
  protocol: string
  portRange: string
  source: string
  description: string
}

// Network Monitoring Types
export interface MetricDataPoint {
  timestamp: string
  value: number
}

export interface NetworkMetrics {
  cpuUsage: MetricDataPoint[]
  memoryUsage: MetricDataPoint[]
  networkIn: MetricDataPoint[]
  networkOut: MetricDataPoint[]
  requestCount: MetricDataPoint[]
  responseTime: MetricDataPoint[]
}

export interface HealthCheck {
  id: string
  target: string
  type: 'HTTP' | 'HTTPS' | 'TCP'
  status: 'Healthy' | 'Unhealthy' | 'Unknown'
  latency: number
  lastCheck: string
}

export interface ScalingEvent {
  id: string
  timestamp: string
  type: 'Scale Out' | 'Scale In'
  reason: string
  previousCapacity: number
  newCapacity: number
}

// Security Types
export interface IAMRole {
  id: string
  name: string
  arn: string
  description: string
  policies: string[]
  createdAt: string
}

export interface SecurityAlert {
  id: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  type: string
  message: string
  source: string
  timestamp: string
  resolved: boolean
}

// Activity Log
export interface ActivityLogEntry {
  id: string
  type: 'order' | 'customer' | 'inventory' | 'system' | 'security'
  action: string
  description: string
  userId?: string
  timestamp: string
  metadata?: Record<string, unknown>
}
