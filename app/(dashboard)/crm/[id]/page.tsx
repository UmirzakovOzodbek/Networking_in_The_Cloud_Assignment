import { notFound } from 'next/navigation'
import { CustomerProfile } from '@/components/crm/customer-profile'
import { getCustomerById } from '@/lib/data/customers'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CustomerDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const customer = getCustomerById(id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/crm">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{customer.companyName}</h1>
          <p className="text-muted-foreground">Customer ID: {customer.id}</p>
        </div>
      </div>

      <CustomerProfile customer={customer} />
    </div>
  )
}
