"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, XCircle, Server, Database, Globe, Shield } from 'lucide-react'

interface SystemService {
  name: string
  status: 'operational' | 'degraded' | 'outage'
  icon: typeof Server
  latency?: number
}

const services: SystemService[] = [
  { name: 'Web Servers', status: 'operational', icon: Server, latency: 45 },
  { name: 'Database', status: 'operational', icon: Database, latency: 12 },
  { name: 'CDN', status: 'operational', icon: Globe, latency: 23 },
  { name: 'Security', status: 'operational', icon: Shield, latency: 8 },
]

export function SystemStatus() {
  const getStatusIcon = (status: SystemService['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="size-4 text-success" />
      case 'degraded':
        return <AlertTriangle className="size-4 text-warning" />
      case 'outage':
        return <XCircle className="size-4 text-destructive" />
    }
  }

  const getStatusBadge = (status: SystemService['status']) => {
    switch (status) {
      case 'operational':
        return <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Operational</Badge>
      case 'degraded':
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">Degraded</Badge>
      case 'outage':
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Outage</Badge>
    }
  }

  const operationalCount = services.filter(s => s.status === 'operational').length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Status</CardTitle>
        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
          {operationalCount}/{services.length} Operational
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    {service.latency && (
                      <p className="text-xs text-muted-foreground">{service.latency}ms latency</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
