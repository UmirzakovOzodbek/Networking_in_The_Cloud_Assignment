"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { awsServices, ec2Instances } from '@/lib/data/metrics'
import { cn } from '@/lib/utils'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Server,
  Database,
  Globe,
  Shield,
  Network,
  Activity,
  Cloud,
  Gauge
} from 'lucide-react'

const getServiceIcon = (type: string) => {
  switch (type) {
    case 'VPC': return Shield
    case 'Internet Gateway': return Globe
    case 'NAT Gateway': return Network
    case 'Application Load Balancer': return Network
    case 'Auto Scaling Group': return Server
    case 'RDS PostgreSQL': return Database
    case 'Route 53': return Globe
    case 'CloudWatch': return Activity
    default: return Cloud
  }
}

export function ServiceStatus() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operational':
        return <CheckCircle className="size-4 text-success" />
      case 'Degraded':
        return <AlertTriangle className="size-4 text-warning" />
      case 'Outage':
        return <XCircle className="size-4 text-destructive" />
      default:
        return <CheckCircle className="size-4 text-success" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Operational':
        return <Badge variant="outline" className="border-success/30 bg-success/10 text-success">{status}</Badge>
      case 'Degraded':
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">{status}</Badge>
      case 'Outage':
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AWS Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {awsServices.map((service) => {
            const Icon = getServiceIcon(service.type)
            return (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.type}</p>
                  </div>
                </div>
                {getStatusIcon(service.status)}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function EC2InstanceStatus() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <Badge variant="outline" className="border-success/30 bg-success/10 text-success">{status}</Badge>
      case 'Stopped':
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">{status}</Badge>
      case 'Pending':
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>EC2 Instances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {ec2Instances.map((instance) => (
            <div key={instance.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Server className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{instance.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{instance.id}</p>
                  </div>
                </div>
                {getStatusBadge(instance.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-mono">{instance.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">AZ</p>
                  <p className="font-mono">{instance.az}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Private IP</p>
                  <p className="font-mono">{instance.privateIp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Public IP</p>
                  <p className="font-mono">{instance.publicIp || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">CPU</span>
                    <span className="text-xs font-medium">{instance.cpuUsage}%</span>
                  </div>
                  <Progress 
                    value={instance.cpuUsage} 
                    className={cn(
                      "h-2",
                      instance.cpuUsage > 80 ? "[&>div]:bg-destructive" : 
                      instance.cpuUsage > 60 ? "[&>div]:bg-warning" : "[&>div]:bg-success"
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Memory</span>
                    <span className="text-xs font-medium">{instance.memoryUsage}%</span>
                  </div>
                  <Progress 
                    value={instance.memoryUsage} 
                    className={cn(
                      "h-2",
                      instance.memoryUsage > 80 ? "[&>div]:bg-destructive" : 
                      instance.memoryUsage > 60 ? "[&>div]:bg-warning" : "[&>div]:bg-success"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
