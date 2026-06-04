import { StatsCard } from '@/components/dashboard/stats-card'
import { ArchitectureDiagram } from '@/components/cloud/architecture-diagram'
import { ServiceStatus, EC2InstanceStatus } from '@/components/cloud/service-status'
import { getCloudStats } from '@/lib/data/metrics'
import { Cloud, Server, Activity, Shield } from 'lucide-react'

export default function CloudPage() {
  const stats = getCloudStats()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cloud Infrastructure</h1>
        <p className="text-muted-foreground">AWS infrastructure overview and monitoring.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="AWS Services"
          value={`${stats.operationalServices}/${stats.totalServices}`}
          change={100}
          changeLabel="operational"
          icon={Cloud}
          trend="up"
        />
        <StatsCard
          title="EC2 Instances"
          value={`${stats.runningInstances}/${stats.totalInstances}`}
          icon={Server}
          trend="neutral"
        />
        <StatsCard
          title="Avg CPU Usage"
          value={`${stats.avgCpuUsage}%`}
          icon={Activity}
          trend={stats.avgCpuUsage > 70 ? 'down' : 'neutral'}
        />
        <StatsCard
          title="Health Checks"
          value={`${stats.healthyChecks}/${stats.totalChecks}`}
          change={100}
          changeLabel="healthy"
          icon={Shield}
          trend="up"
        />
      </div>

      <ArchitectureDiagram />

      <div className="grid gap-6 lg:grid-cols-2">
        <ServiceStatus />
        <EC2InstanceStatus />
      </div>
    </div>
  )
}
