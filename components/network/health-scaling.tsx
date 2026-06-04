"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { healthChecks, scalingEvents } from '@/lib/data/metrics'
import { CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown, Clock } from 'lucide-react'
import { format } from 'date-fns'

export function HealthChecks() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle className="size-4 text-success" />
      case 'Unhealthy':
        return <XCircle className="size-4 text-destructive" />
      default:
        return <AlertTriangle className="size-4 text-warning" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <Badge variant="outline" className="border-success/30 bg-success/10 text-success">{status}</Badge>
      case 'Unhealthy':
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">{status}</Badge>
      default:
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Health Checks</CardTitle>
          <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
            {healthChecks.filter(h => h.status === 'Healthy').length}/{healthChecks.length} Healthy
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {healthChecks.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium">{check.target}</p>
                  <p className="text-xs text-muted-foreground">{check.type} • {check.latency}ms</p>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ScalingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto Scaling Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {scalingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div className={`mt-0.5 flex size-8 items-center justify-center rounded-full ${
                event.type === 'Scale Out' ? 'bg-success/10' : 'bg-warning/10'
              }`}>
                {event.type === 'Scale Out' ? (
                  <ArrowUp className="size-4 text-success" />
                ) : (
                  <ArrowDown className="size-4 text-warning" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{event.type}</p>
                  <Badge variant="secondary">
                    {event.previousCapacity} → {event.newCapacity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.reason}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {format(new Date(event.timestamp), 'MMM d, HH:mm')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
