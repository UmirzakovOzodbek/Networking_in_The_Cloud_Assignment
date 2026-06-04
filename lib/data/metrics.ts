import type { 
  AWSService, 
  EC2Instance, 
  SecurityGroup, 
  NetworkMetrics, 
  HealthCheck, 
  ScalingEvent, 
  IAMRole, 
  SecurityAlert 
} from '@/lib/types'

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// AWS Services Configuration
export const awsServices: AWSService[] = [
  { id: 'vpc-1', name: 'CWMS-VPC', type: 'VPC', status: 'Operational', region: 'us-east-1', details: { cidr: '10.0.0.0/16', subnets: 6 } },
  { id: 'igw-1', name: 'CWMS-IGW', type: 'Internet Gateway', status: 'Operational', region: 'us-east-1', details: { attached: 'vpc-1' } },
  { id: 'nat-1', name: 'CWMS-NAT', type: 'NAT Gateway', status: 'Operational', region: 'us-east-1', details: { az: 'us-east-1a', elasticIp: '54.23.145.67' } },
  { id: 'alb-1', name: 'CWMS-ALB', type: 'Application Load Balancer', status: 'Operational', region: 'us-east-1', details: { scheme: 'internet-facing', targets: 3 } },
  { id: 'asg-1', name: 'CWMS-ASG', type: 'Auto Scaling Group', status: 'Operational', region: 'us-east-1', details: { desired: 3, min: 2, max: 10 } },
  { id: 'rds-1', name: 'CWMS-DB', type: 'RDS PostgreSQL', status: 'Operational', region: 'us-east-1', details: { engine: 'postgres', version: '15.4', multiAz: true } },
  { id: 'r53-1', name: 'cwms.example.com', type: 'Route 53', status: 'Operational', region: 'global', details: { recordSets: 12, healthChecks: 3 } },
  { id: 'cw-1', name: 'CWMS-Monitoring', type: 'CloudWatch', status: 'Operational', region: 'us-east-1', details: { alarms: 15, dashboards: 3 } }
]

// EC2 Instances
export const ec2Instances: EC2Instance[] = [
  { id: 'i-0a1b2c3d4e5f6', name: 'CWMS-Web-1', type: 't3.medium', status: 'Running', az: 'us-east-1a', privateIp: '10.0.1.10', publicIp: '54.23.145.100', cpuUsage: 45, memoryUsage: 62 },
  { id: 'i-1b2c3d4e5f6a7', name: 'CWMS-Web-2', type: 't3.medium', status: 'Running', az: 'us-east-1b', privateIp: '10.0.2.10', publicIp: '54.23.145.101', cpuUsage: 38, memoryUsage: 55 },
  { id: 'i-2c3d4e5f6a7b8', name: 'CWMS-Web-3', type: 't3.medium', status: 'Running', az: 'us-east-1c', privateIp: '10.0.3.10', publicIp: '54.23.145.102', cpuUsage: 52, memoryUsage: 68 }
]

// Security Groups
export const securityGroups: SecurityGroup[] = [
  {
    id: 'sg-alb',
    name: 'CWMS-ALB-SG',
    description: 'Security group for Application Load Balancer',
    vpcId: 'vpc-1',
    inboundRules: [
      { protocol: 'TCP', portRange: '443', source: '0.0.0.0/0', description: 'HTTPS from anywhere' },
      { protocol: 'TCP', portRange: '80', source: '0.0.0.0/0', description: 'HTTP from anywhere (redirect to HTTPS)' }
    ],
    outboundRules: [
      { protocol: 'All', portRange: 'All', source: '0.0.0.0/0', description: 'Allow all outbound' }
    ]
  },
  {
    id: 'sg-web',
    name: 'CWMS-Web-SG',
    description: 'Security group for web servers',
    vpcId: 'vpc-1',
    inboundRules: [
      { protocol: 'TCP', portRange: '3000', source: 'sg-alb', description: 'App traffic from ALB' },
      { protocol: 'TCP', portRange: '22', source: '10.0.0.0/16', description: 'SSH from VPC' }
    ],
    outboundRules: [
      { protocol: 'All', portRange: 'All', source: '0.0.0.0/0', description: 'Allow all outbound' }
    ]
  },
  {
    id: 'sg-db',
    name: 'CWMS-DB-SG',
    description: 'Security group for RDS database',
    vpcId: 'vpc-1',
    inboundRules: [
      { protocol: 'TCP', portRange: '5432', source: 'sg-web', description: 'PostgreSQL from web servers' }
    ],
    outboundRules: [
      { protocol: 'All', portRange: 'All', source: '0.0.0.0/0', description: 'Allow all outbound' }
    ]
  }
]

// Generate Network Metrics
function generateMetrics(): NetworkMetrics {
  const random = seededRandom(999)
  const now = new Date()
  const generateTimeSeries = (baseValue: number, variance: number) => {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (23 - i) * 60 * 60 * 1000).toISOString(),
      value: Math.round((baseValue + (random() - 0.5) * variance) * 10) / 10
    }))
  }

  return {
    cpuUsage: generateTimeSeries(45, 30),
    memoryUsage: generateTimeSeries(60, 20),
    networkIn: generateTimeSeries(150, 100),
    networkOut: generateTimeSeries(200, 150),
    requestCount: generateTimeSeries(1500, 1000),
    responseTime: generateTimeSeries(120, 80)
  }
}

export const networkMetrics = generateMetrics()

// Health Checks
export const healthChecks: HealthCheck[] = [
  { id: 'hc-1', target: 'CWMS-Web-1', type: 'HTTP', status: 'Healthy', latency: 23, lastCheck: new Date().toISOString() },
  { id: 'hc-2', target: 'CWMS-Web-2', type: 'HTTP', status: 'Healthy', latency: 28, lastCheck: new Date().toISOString() },
  { id: 'hc-3', target: 'CWMS-Web-3', type: 'HTTP', status: 'Healthy', latency: 31, lastCheck: new Date().toISOString() },
  { id: 'hc-4', target: 'CWMS-DB', type: 'TCP', status: 'Healthy', latency: 5, lastCheck: new Date().toISOString() },
  { id: 'hc-5', target: 'CWMS-ALB', type: 'HTTPS', status: 'Healthy', latency: 15, lastCheck: new Date().toISOString() }
]

// Scaling Events
export const scalingEvents: ScalingEvent[] = [
  { id: 'se-1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'Scale Out', reason: 'CPU utilization exceeded 70%', previousCapacity: 2, newCapacity: 3 },
  { id: 'se-2', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), type: 'Scale Out', reason: 'Request count exceeded threshold', previousCapacity: 3, newCapacity: 4 },
  { id: 'se-3', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), type: 'Scale In', reason: 'CPU utilization below 30%', previousCapacity: 4, newCapacity: 3 },
  { id: 'se-4', timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), type: 'Scale Out', reason: 'Scheduled scaling for peak hours', previousCapacity: 2, newCapacity: 4 },
  { id: 'se-5', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), type: 'Scale In', reason: 'End of peak hours', previousCapacity: 4, newCapacity: 2 }
]

// IAM Roles
export const iamRoles: IAMRole[] = [
  { id: 'role-1', name: 'CWMS-EC2-Role', arn: 'arn:aws:iam::123456789012:role/CWMS-EC2-Role', description: 'Role for EC2 instances', policies: ['AmazonS3ReadOnlyAccess', 'CloudWatchAgentServerPolicy', 'AmazonSSMManagedInstanceCore'], createdAt: '2024-01-15T10:00:00Z' },
  { id: 'role-2', name: 'CWMS-Lambda-Role', arn: 'arn:aws:iam::123456789012:role/CWMS-Lambda-Role', description: 'Role for Lambda functions', policies: ['AWSLambdaBasicExecutionRole', 'AmazonDynamoDBReadOnlyAccess'], createdAt: '2024-01-15T10:00:00Z' },
  { id: 'role-3', name: 'CWMS-RDS-Role', arn: 'arn:aws:iam::123456789012:role/CWMS-RDS-Role', description: 'Role for RDS enhanced monitoring', policies: ['AmazonRDSEnhancedMonitoringRole'], createdAt: '2024-01-15T10:00:00Z' }
]

// Security Alerts
export const securityAlerts: SecurityAlert[] = [
  { id: 'alert-1', severity: 'Low', type: 'SSH Login', message: 'Successful SSH login from authorized IP', source: 'CWMS-Web-1', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), resolved: true },
  { id: 'alert-2', severity: 'Medium', type: 'Failed Login', message: '5 failed login attempts detected', source: 'CWMS-ALB', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), resolved: true },
  { id: 'alert-3', severity: 'Low', type: 'Configuration Change', message: 'Security group rule modified', source: 'CWMS-Web-SG', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), resolved: true },
  { id: 'alert-4', severity: 'High', type: 'Unusual Traffic', message: 'Traffic spike from unknown IP range', source: 'CWMS-ALB', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), resolved: true },
  { id: 'alert-5', severity: 'Critical', type: 'Certificate Expiry', message: 'SSL certificate expires in 30 days', source: 'CWMS-ALB', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), resolved: false }
]

// Dashboard Stats
export function getCloudStats() {
  return {
    totalServices: awsServices.length,
    operationalServices: awsServices.filter(s => s.status === 'Operational').length,
    totalInstances: ec2Instances.length,
    runningInstances: ec2Instances.filter(i => i.status === 'Running').length,
    avgCpuUsage: Math.round(ec2Instances.reduce((sum, i) => sum + i.cpuUsage, 0) / ec2Instances.length),
    avgMemoryUsage: Math.round(ec2Instances.reduce((sum, i) => sum + i.memoryUsage, 0) / ec2Instances.length),
    healthyChecks: healthChecks.filter(h => h.status === 'Healthy').length,
    totalChecks: healthChecks.length,
    unresolvedAlerts: securityAlerts.filter(a => !a.resolved).length,
    totalAlerts: securityAlerts.length
  }
}
