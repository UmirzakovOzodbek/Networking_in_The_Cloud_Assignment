"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Globe, 
  Server, 
  Database, 
  Shield, 
  Network, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const architectureComponents = [
  { id: 'users', label: 'Users', icon: Users, status: 'operational' },
  { id: 'route53', label: 'Route 53', icon: Globe, status: 'operational' },
  { id: 'alb', label: 'ALB', icon: Network, status: 'operational' },
  { id: 'asg', label: 'Auto Scaling', icon: Server, status: 'operational' },
  { id: 'ec2', label: 'EC2 Instances', icon: Server, status: 'operational' },
  { id: 'rds', label: 'RDS PostgreSQL', icon: Database, status: 'operational' },
]

export function ArchitectureDiagram() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AWS Architecture Overview</CardTitle>
          <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
            All Systems Operational
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Architecture Flow */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:gap-2">
            {architectureComponents.map((component, index) => {
              const Icon = component.icon
              return (
                <div key={component.id} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex size-16 items-center justify-center rounded-xl border-2 transition-all",
                      component.status === 'operational' 
                        ? "border-success/30 bg-success/5" 
                        : "border-warning/30 bg-warning/5"
                    )}>
                      <Icon className={cn(
                        "size-8",
                        component.status === 'operational' ? "text-success" : "text-warning"
                      )} />
                    </div>
                    <span className="mt-2 text-sm font-medium">{component.label}</span>
                    <div className="mt-1 flex items-center gap-1">
                      <CheckCircle className="size-3 text-success" />
                      <span className="text-xs text-muted-foreground">Active</span>
                    </div>
                  </div>
                  {index < architectureComponents.length - 1 && (
                    <ArrowRight className="hidden size-5 text-muted-foreground lg:block" />
                  )}
                </div>
              )
            })}
          </div>

          {/* VPC Boundary */}
          <div className="mt-8 rounded-lg border border-dashed border-primary/30 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span className="text-sm font-medium">VPC: 10.0.0.0/16</span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Public Subnets */}
              <div className="rounded-lg border border-info/30 bg-info/5 p-4">
                <h4 className="mb-3 text-sm font-medium text-info">Public Subnets</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded bg-background/50 p-2 text-xs">
                    <span>us-east-1a</span>
                    <span className="font-mono">10.0.1.0/24</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-background/50 p-2 text-xs">
                    <span>us-east-1b</span>
                    <span className="font-mono">10.0.2.0/24</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-background/50 p-2 text-xs">
                    <span>us-east-1c</span>
                    <span className="font-mono">10.0.3.0/24</span>
                  </div>
                </div>
              </div>

              {/* Private Subnets */}
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <h4 className="mb-3 text-sm font-medium text-warning">Private Subnets</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded bg-background/50 p-2 text-xs">
                    <span>us-east-1a</span>
                    <span className="font-mono">10.0.11.0/24</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-background/50 p-2 text-xs">
                    <span>us-east-1b</span>
                    <span className="font-mono">10.0.12.0/24</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-background/50 p-2 text-xs">
                    <span>us-east-1c</span>
                    <span className="font-mono">10.0.13.0/24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
