import type { Order, Invoice } from '@/lib/types'
import { customers } from './customers'
import { products } from './products'

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function generateOrders(): Order[] {
  const orders: Order[] = []
  const random = seededRandom(456)
  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  const paymentStatuses: Order['paymentStatus'][] = ['Pending', 'Paid', 'Refunded']

  for (let i = 1; i <= 500; i++) {
    const customer = customers[Math.floor(random() * customers.length)]
    const itemCount = 1 + Math.floor(random() * 5)
    const items = []
    let subtotal = 0

    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(random() * products.length)]
      const quantity = 10 + Math.floor(random() * 90)
      const total = product.price * quantity
      subtotal += total

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total
      })
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const statusIndex = Math.floor(random() * statuses.length)
    const status = statuses[statusIndex]
    const paymentStatus = status === 'Cancelled' ? 'Refunded' : status === 'Delivered' ? 'Paid' : paymentStatuses[Math.floor(random() * 2)]

    const orderDate = new Date(2024, Math.floor(random() * 6), Math.floor(1 + random() * 28))

    orders.push({
      id: `ORD-${String(i).padStart(5, '0')}`,
      customerId: customer.id,
      customerName: customer.companyName,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      total: Math.round((subtotal + tax) * 100) / 100,
      status,
      paymentStatus,
      shippingAddress: `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}`,
      createdAt: orderDate.toISOString(),
      updatedAt: new Date(orderDate.getTime() + random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return orders
}

function generateInvoices(orders: Order[]): Invoice[] {
  const random = seededRandom(789)
  
  return orders
    .filter(order => order.status !== 'Cancelled')
    .map((order, index) => {
      const invoiceDate = new Date(order.createdAt)
      const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      const isPaid = order.paymentStatus === 'Paid'
      const isOverdue = !isPaid && new Date() > dueDate

      return {
        id: `INV-${String(index + 1).padStart(5, '0')}`,
        orderId: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        amount: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: isPaid ? 'Paid' : isOverdue ? 'Overdue' : random() < 0.1 ? 'Draft' : 'Sent',
        dueDate: dueDate.toISOString().split('T')[0],
        paidDate: isPaid ? new Date(invoiceDate.getTime() + random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        createdAt: invoiceDate.toISOString()
      }
    })
}

export const orders = generateOrders()
export const invoices = generateInvoices(orders)

export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id)
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return orders.filter(o => o.customerId === customerId)
}

export function getOrdersByStatus(status: Order['status']): Order[] {
  return orders.filter(o => o.status === status)
}

export function getRecentOrders(limit: number = 10): Order[] {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)
}

export function getOrderStats() {
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const processingOrders = orders.filter(o => o.status === 'Processing').length
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    averageOrderValue: totalRevenue / (totalOrders - cancelledOrders)
  }
}

export function getMonthlyRevenue(): { month: string; revenue: number; orders: number }[] {
  const monthlyData: Record<string, { revenue: number; orders: number }> = {}
  
  orders.forEach(order => {
    if (order.status !== 'Cancelled') {
      const date = new Date(order.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, orders: 0 }
      }
      monthlyData[monthKey].revenue += order.total
      monthlyData[monthKey].orders++
    }
  })

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue),
      orders: data.orders
    }))
}
