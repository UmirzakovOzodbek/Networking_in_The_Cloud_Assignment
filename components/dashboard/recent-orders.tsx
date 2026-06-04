"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getRecentOrders } from '@/lib/data/orders'
import { format } from 'date-fns'

export function RecentOrders() {
  const orders = getRecentOrders(5)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="outline" className="border-success/30 bg-success/10 text-success">{status}</Badge>
      case 'Shipped':
        return <Badge variant="outline" className="border-info/30 bg-info/10 text-info">{status}</Badge>
      case 'Processing':
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">{status}</Badge>
      case 'Pending':
        return <Badge variant="secondary">{status}</Badge>
      case 'Cancelled':
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">
                    {order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">${order.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.createdAt), 'MMM d')}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
