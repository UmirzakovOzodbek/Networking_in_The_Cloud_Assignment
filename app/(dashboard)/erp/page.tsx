"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/stats-card'
import { orderStats, invoices } from '@/lib/data/orders'
import { products, getProductCategories, getLowStockProducts } from '@/lib/data/products'
import { DollarSign, Package, ShoppingCart, FileText, AlertTriangle, TrendingUp } from 'lucide-react'

const categories = getProductCategories()
const lowStock = getLowStockProducts()
const paidInvoices = invoices.filter(i => i.status === 'Paid')
const overdueInvoices = invoices.filter(i => i.status === 'Overdue')

export default function ERPPage() {
  const modules = [
    {
      title: 'Product Management',
      description: 'Manage your product catalog, pricing, and inventory levels',
      href: '/erp/products',
      icon: Package,
      stats: `${products.length} products`
    },
    {
      title: 'Order Management',
      description: 'Track and process customer orders from placement to delivery',
      href: '/erp/orders',
      icon: ShoppingCart,
      stats: `${orderStats.totalOrders} orders`
    },
    {
      title: 'Invoice Management',
      description: 'Create, send, and track invoices and payments',
      href: '/erp/invoices',
      icon: FileText,
      stats: `${invoices.length} invoices`
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enterprise Resource Planning</h1>
        <p className="text-muted-foreground">Manage products, orders, and invoices.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${(orderStats.totalRevenue / 1000).toFixed(0)}k`}
          change={12.5}
          changeLabel="this month"
          icon={DollarSign}
          trend="up"
        />
        <StatsCard
          title="Avg Order Value"
          value={`$${orderStats.averageOrderValue.toFixed(0)}`}
          change={5.2}
          changeLabel="increase"
          icon={TrendingUp}
          trend="up"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStock.length}
          icon={AlertTriangle}
          trend={lowStock.length > 50 ? 'down' : 'neutral'}
        />
        <StatsCard
          title="Overdue Invoices"
          value={overdueInvoices.length}
          icon={FileText}
          trend={overdueInvoices.length > 10 ? 'down' : 'neutral'}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Products and inventory value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cat.category}</p>
                    <p className="text-sm text-muted-foreground">{cat.count} products</p>
                  </div>
                  <p className="font-medium">${(cat.totalValue / 1000).toFixed(0)}k</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Pending', value: orderStats.pendingOrders, color: 'bg-muted' },
                { label: 'Processing', value: orderStats.processingOrders, color: 'bg-warning/20' },
                { label: 'Shipped', value: orderStats.shippedOrders, color: 'bg-info/20' },
                { label: 'Delivered', value: orderStats.deliveredOrders, color: 'bg-success/20' },
                { label: 'Cancelled', value: orderStats.cancelledOrders, color: 'bg-destructive/20' }
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
