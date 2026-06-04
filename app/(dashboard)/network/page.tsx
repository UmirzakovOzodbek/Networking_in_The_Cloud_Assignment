"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricsCharts } from '@/components/network/metrics-charts'
import { HealthChecks, ScalingEvents } from '@/components/network/health-scaling'
import { ec2Instances, healthChecks, scalingEvents, networkMetrics } from '@/lib/data/metrics'
import { Activity, Server, Cpu, MemoryStick, Network, Clock } from 'lucide-react'

export default function NetworkMonitoringPage() {
  const avgCpu = Math.round(ec2Instances.reduce((sum, i) => sum + i.cpuUsage, 0) / ec2Instances.length)
  const avgMemory = Math.round(ec2Instances.reduce((sum, i) => sum + i.memoryUsage, 0) / ec2Instances.length)
  const healthyChecks = healthChecks.filter(h => h.status === 'Healthy').length
  const avgLatency = Math.round(healthChecks.reduce((sum, h) => sum + h.latency, 0) / healthChecks.length)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Network Monitoring</h1>
        <p className="text-muted-foreground">Real-time infrastructure metrics and performance monitoring</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average CPU</CardTitle>
            <Cpu className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu}%</div>
            <p className="text-xs text-muted-foreground">Across {ec2Instances.length} instances</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Memory</CardTitle>
            <MemoryStick className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMemory}%</div>
            <p className="text-xs text-muted-foreground">RAM utilization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Checks</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyChecks}/{healthChecks.length}</div>
            <p className="text-xs text-muted-foreground">All checks passing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="instances">EC2 Instances</TabsTrigger>
          <TabsTrigger value="health">Health & Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <MetricsCharts metrics={networkMetrics} />
        </TabsContent>

        <TabsContent value="instances">
          <Card>
            <CardHeader>
              <CardTitle>EC2 Instance Status</CardTitle>
              <CardDescription>Real-time status of all running EC2 instances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ec2Instances.map((instance) => (
                  <Card key={instance.id} className="border-border/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="size-4 text-muted-foreground" />
                          <CardTitle className="text-sm font-medium">{instance.name}</CardTitle>
                        </div>
                        <Badge variant={instance.status === 'Running' ? 'default' : 'secondary'}>
                          {instance.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <span className="ml-1 font-medium">{instance.type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">AZ:</span>
                          <span className="ml-1 font-medium">{instance.az}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Private IP:</span>
                          <span className="ml-1 font-medium">{instance.privateIp}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Public IP:</span>
                          <span className="ml-1 font-medium">{instance.publicIp}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">CPU Usage</span>
                          <span className="font-medium">{instance.cpuUsage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div 
                            className="h-2 rounded-full bg-primary transition-all" 
                            style={{ width: `${instance.cpuUsage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Memory Usage</span>
                          <span className="font-medium">{instance.memoryUsage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div 
                            className="h-2 rounded-full bg-chart-2 transition-all" 
                            style={{ width: `${instance.memoryUsage}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <div className="grid gap-4 lg:grid-cols-2">
            <HealthChecks />
            <ScalingEvents />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
