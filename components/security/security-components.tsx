"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { securityGroups, iamRoles, securityAlerts } from '@/lib/data/metrics'
import { Shield, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

export function SecurityGroups() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {securityGroups.map((sg) => (
            <div key={sg.id} className="rounded-lg border">
              <div className="flex items-center justify-between border-b p-3">
                <div className="flex items-center gap-3">
                  <Shield className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{sg.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{sg.id}</p>
                  </div>
                </div>
                <Badge variant="outline">{sg.inboundRules.length} inbound</Badge>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Inbound Rules</p>
                <div className="rounded border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Protocol</TableHead>
                        <TableHead className="text-xs">Port</TableHead>
                        <TableHead className="text-xs">Source</TableHead>
                        <TableHead className="text-xs">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sg.inboundRules.map((rule, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs font-mono">{rule.protocol}</TableCell>
                          <TableCell className="text-xs font-mono">{rule.portRange}</TableCell>
                          <TableCell className="text-xs font-mono">{rule.source}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{rule.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function IAMRoles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IAM Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {iamRoles.map((role) => (
            <div key={role.id} className="rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.policies.map((policy, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {policy}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SecurityAlerts() {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="destructive">{severity}</Badge>
      case 'High':
        return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">{severity}</Badge>
      case 'Medium':
        return <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">{severity}</Badge>
      case 'Low':
        return <Badge variant="secondary">{severity}</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Security Alerts</CardTitle>
          <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
            {securityAlerts.filter(a => !a.resolved).length} Unresolved
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {securityAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${!alert.resolved ? 'border-warning/30 bg-warning/5' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`size-4 ${!alert.resolved ? 'text-warning' : 'text-muted-foreground'}`} />
                  <span className="font-medium">{alert.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(alert.severity)}
                  {alert.resolved && (
                    <CheckCircle className="size-4 text-success" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Source: {alert.source}</span>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {format(new Date(alert.timestamp), 'MMM d, HH:mm')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
