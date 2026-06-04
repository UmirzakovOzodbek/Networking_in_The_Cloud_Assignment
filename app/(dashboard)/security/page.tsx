"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Shield, Key, Users, CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react'
import { SecurityGroups, SecurityAlerts, IAMRoles } from '@/components/security/security-components'
import { securityGroups, securityAlerts, iamRoles } from '@/lib/data/metrics'

export default function SecurityCenterPage() {
  const criticalAlerts = securityAlerts.filter(a => a.severity === 'Critical' && !a.resolved).length
  const unresolvedAlerts = securityAlerts.filter(a => !a.resolved).length
  const resolvedRate = Math.round((securityAlerts.filter(a => a.resolved).length / securityAlerts.length) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Center</h1>
        <p className="text-muted-foreground">Security monitoring, alerts, and compliance management</p>
      </div>

      {/* Security Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="size-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
            <AlertCircle className="size-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unresolvedAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle2 className="size-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedRate}%</div>
            <p className="text-xs text-muted-foreground">Alerts resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Groups</CardTitle>
            <Shield className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityGroups.length}</div>
            <p className="text-xs text-muted-foreground">Active configurations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="groups">Security Groups</TabsTrigger>
          <TabsTrigger value="iam">IAM Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-2">
            <SecurityAlerts />
            <SecurityGroups />
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <SecurityAlerts />
        </TabsContent>

        <TabsContent value="groups">
          <SecurityGroups />
        </TabsContent>

        <TabsContent value="iam">
          <IAMRoles />
        </TabsContent>
      </Tabs>
    </div>
  )
}
