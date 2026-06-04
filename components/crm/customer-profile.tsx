"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Customer } from '@/lib/types'
import { getOrdersByCustomer } from '@/lib/data/orders'
import { Mail, Phone, MapPin, Calendar, ShoppingCart, DollarSign, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface CustomerProfileProps {
  customer: Customer
}

export function CustomerProfile({ customer }: CustomerProfileProps) {
  const orders = getOrdersByCustomer(customer.id)
  
  const getSegmentBadge = (segment: Customer['segment']) => {
    switch (segment) {
      case 'Premium':
        return <Badge className="bg-chart-1/20 text-chart-1">Premium</Badge>
      case 'Regular':
        return <Badge variant="secondary">Regular</Badge>
      case 'New':
        return <Badge variant="outline">New</Badge>
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Profile</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Edit className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center">
            <Avatar className="size-20">
              <AvatarFallback className="text-xl">
                {customer.companyName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-lg font-semibold">{customer.companyName}</h3>
            <p className="text-sm text-muted-foreground">{customer.contactName}</p>
            <div className="mt-2">{getSegmentBadge(customer.segment)}</div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-4 text-muted-foreground" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">
                {customer.address.street}<br />
                {customer.address.city}, {customer.address.state} {customer.address.zipCode}<br />
                {customer.address.country}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm">
                Customer since {format(new Date(customer.createdAt), 'MMM yyyy')}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-3 text-center">
              <DollarSign className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold">${customer.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <ShoppingCart className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-1 text-lg font-semibold">{customer.ordersCount}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders found</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')} • {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toLocaleString()}</p>
                    <Badge
                      variant="outline"
                      className={
                        order.status === 'Delivered'
                          ? 'border-success/30 bg-success/10 text-success'
                          : order.status === 'Cancelled'
                          ? 'border-destructive/30 bg-destructive/10 text-destructive'
                          : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
