"use client"

import { StatsCard } from '@/components/dashboard/stats-card'
import { ProductCatalog } from '@/components/erp/product-catalog'
import { products, getProductCategories, getLowStockProducts } from '@/lib/data/products'
import { Package, DollarSign, AlertTriangle, Layers } from 'lucide-react'

const categories = getProductCategories()
const lowStock = getLowStockProducts()
const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0)
const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0)

export default function ProductsPage() {

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
        <p className="text-muted-foreground">Manage your product catalog and inventory.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={products.length.toLocaleString()}
          icon={Package}
          trend="neutral"
        />
        <StatsCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          icon={Layers}
          trend="neutral"
        />
        <StatsCard
          title="Inventory Value"
          value={`$${(totalValue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend="neutral"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStock.length}
          change={lowStock.length}
          changeLabel="need reorder"
          icon={AlertTriangle}
          trend="down"
        />
      </div>

      <ProductCatalog />
    </div>
  )
}
