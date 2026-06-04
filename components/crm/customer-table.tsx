"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { customers } from '@/lib/data/customers'
import type { Customer } from '@/lib/types'
import { Search, Download, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const ITEMS_PER_PAGE = 15

export function CustomerTable() {
  const [searchQuery, setSearchQuery] = useState('')
  const [segmentFilter, setSegmentFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter
    
    return matchesSearch && matchesSegment
  })

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getSegmentBadge = (segment: Customer['segment']) => {
    switch (segment) {
      case 'Premium':
        return <Badge className="bg-chart-1/20 text-chart-1 hover:bg-chart-1/30">Premium</Badge>
      case 'Regular':
        return <Badge variant="secondary">Regular</Badge>
      case 'New':
        return <Badge variant="outline">New</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Customer Directory</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="size-4" data-icon="inline-start" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="size-4" data-icon="inline-start" />
              Add Customer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={segmentFilter}
            onValueChange={(value) => {
              setSegmentFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
              <SelectItem value="New">New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link 
                      href={`/crm/${customer.id}`}
                      className="font-medium hover:underline"
                    >
                      {customer.companyName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{customer.contactName}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getSegmentBadge(customer.segment)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">{customer.ordersCount}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} customers
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
              Page {currentPage} of {totalPages}
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
  )
}
