import { StatsCard } from '@/components/dashboard/stats-card'
import { InvoiceTable } from '@/components/erp/invoice-table'
import { invoices } from '@/lib/data/orders'
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function InvoicesPage() {
  const totalAmount = invoices.reduce((sum, i) => sum + i.total, 0)
  const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0)
  const pendingAmount = invoices.filter(i => i.status === 'Sent').reduce((sum, i) => sum + i.total, 0)
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoice Management</h1>
        <p className="text-muted-foreground">Create and track invoices.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Invoiced"
          value={`$${(totalAmount / 1000).toFixed(0)}k`}
          icon={FileText}
          trend="neutral"
        />
        <StatsCard
          title="Paid"
          value={`$${(paidAmount / 1000).toFixed(0)}k`}
          change={Math.round((paidAmount / totalAmount) * 100)}
          changeLabel="collected"
          icon={CheckCircle}
          trend="up"
        />
        <StatsCard
          title="Pending"
          value={`$${(pendingAmount / 1000).toFixed(0)}k`}
          icon={Clock}
          trend="neutral"
        />
        <StatsCard
          title="Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          trend={overdueCount > 10 ? 'down' : 'neutral'}
        />
      </div>

      <InvoiceTable />
    </div>
  )
}
