# CWMS AWS Deployment Guide

This guide covers the complete deployment process for the Cloud Wholesale Management System (CWMS) on AWS.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Terraform >= 1.0.0
- Docker
- Node.js 20.x
- pnpm

## Architecture Overview

```
                                    ┌─────────────────────────────────────────────────────────┐
                                    │                        AWS Cloud                         │
                                    │                                                          │
    ┌──────────┐                   │  ┌──────────────────────────────────────────────────┐   │
    │          │                   │  │                      VPC                          │   │
    │  Users   │──────────────────►│  │  ┌─────────────┐                                  │   │
    │          │                   │  │  │  Route 53   │                                  │   │
    └──────────┘                   │  │  └──────┬──────┘                                  │   │
                                    │  │         │                                         │   │
                                    │  │         ▼                                         │   │
                                    │  │  ┌─────────────┐       ┌─────────────────────┐   │   │
                                    │  │  │     ALB     │──────►│   Auto Scaling      │   │   │
                                    │  │  │   (HTTPS)   │       │   Group (EC2)       │   │   │
                                    │  │  └─────────────┘       │   ┌───┐ ┌───┐ ┌───┐ │   │   │
                                    │  │                        │   │EC2│ │EC2│ │EC2│ │   │   │
                                    │  │                        │   └─┬─┘ └─┬─┘ └─┬─┘ │   │   │
                                    │  │                        └─────┼─────┼─────┼───┘   │   │
                                    │  │                              │     │     │       │   │
                                    │  │                              ▼     ▼     ▼       │   │
                                    │  │                        ┌─────────────────────┐   │   │
                                    │  │                        │   RDS PostgreSQL    │   │   │
                                    │  │                        │   (Multi-AZ)        │   │   │
                                    │  │                        └─────────────────────┘   │   │
                                    │  └──────────────────────────────────────────────────┘   │
                                    │                                                          │
                                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
                                    │  │ CloudWatch  │  │   S3        │  │  Secrets    │      │
                                    │  │ (Monitoring)│  │  (Logs)     │  │  Manager    │      │
                                    │  └─────────────┘  └─────────────┘  └─────────────┘      │
                                    └─────────────────────────────────────────────────────────┘
```

## Step 1: Initial Setup

### 1.1 Create S3 Bucket for Terraform State

```bash
aws s3 mb s3://cwms-terraform-state --region us-east-1
aws s3api put-bucket-versioning --bucket cwms-terraform-state --versioning-configuration Status=Enabled
aws s3api put-bucket-encryption --bucket cwms-terraform-state --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

### 1.2 Create DynamoDB Table for State Locking

```bash
aws dynamodb create-table \
    --table-name cwms-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 1.3 Request SSL Certificate

```bash
aws acm request-certificate \
    --domain-name cwms.example.com \
    --validation-method DNS \
    --region us-east-1
```

Validate the certificate by adding the DNS records to your domain.

## Step 2: Deploy Infrastructure with Terraform

### 2.1 Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### 2.2 Create terraform.tfvars

```hcl
aws_region          = "us-east-1"
environment         = "production"
vpc_cidr            = "10.0.0.0/16"
instance_type       = "t3.medium"
asg_min_size        = 2
asg_max_size        = 10
asg_desired_capacity = 3
db_instance_class   = "db.t3.medium"
db_allocated_storage = 100
certificate_arn     = "arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID"
alert_sns_topic_arn = "arn:aws:sns:us-east-1:ACCOUNT_ID:cwms-alerts"
```

### 2.3 Plan and Apply

```bash
terraform plan -out=tfplan
terraform apply tfplan
```

## Step 3: Configure DNS

After the ALB is created, add a CNAME record pointing your domain to the ALB DNS name:

```
cwms.example.com  CNAME  cwms-production-alb-123456789.us-east-1.elb.amazonaws.com
```

## Step 4: Set Up CI/CD

### 4.1 Create ECR Repository

```bash
aws ecr create-repository --repository-name cwms-app --region us-east-1
```

### 4.2 Configure GitHub Secrets

Add these secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `CODECOV_TOKEN`: (Optional) Codecov token for coverage reports

### 4.3 Create IAM User for CI/CD

```bash
aws iam create-user --user-name cwms-cicd

aws iam attach-user-policy --user-name cwms-cicd \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-user-policy --user-name cwms-cicd \
    --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess
```

## Step 5: Deploy Application

### 5.1 Build and Push Docker Image

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build -t cwms-app -f infrastructure/docker/Dockerfile .
docker tag cwms-app:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cwms-app:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cwms-app:latest
```

### 5.2 Deploy to EC2 via CodeDeploy (Alternative)

If using EC2 instances directly instead of ECS:

1. Install CodeDeploy agent on instances
2. Create CodeDeploy application and deployment group
3. Create appspec.yml for deployment configuration

## Step 6: Verify Deployment

### 6.1 Check Application Health

```bash
curl https://cwms.example.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-06-15T10:30:00Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### 6.2 Monitor CloudWatch

Access the CloudWatch dashboard:
```
https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=cwms-production-dashboard
```

### 6.3 Check Auto Scaling

```bash
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names cwms-production-asg
```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if EC2 instances are healthy in target group
   - Verify security group rules allow traffic on port 3000
   - Check application logs in CloudWatch

2. **Database Connection Issues**
   - Verify RDS security group allows traffic from web servers
   - Check if database credentials are correct in Secrets Manager

3. **SSL Certificate Issues**
   - Ensure certificate is validated and issued
   - Verify certificate ARN is correct in ALB configuration

### Useful Commands

```bash
# View application logs
aws logs tail /cwms/application --follow

# Check EC2 instance status
aws ec2 describe-instances --filters "Name=tag:Project,Values=CWMS"

# View RDS status
aws rds describe-db-instances --db-instance-identifier cwms-production-db

# Check ALB health
aws elbv2 describe-target-health --target-group-arn TARGET_GROUP_ARN
```

## Security Best Practices

1. **Enable AWS Config** to monitor configuration changes
2. **Enable CloudTrail** for API auditing
3. **Use AWS WAF** to protect against common web attacks
4. **Enable VPC Flow Logs** for network monitoring
5. **Rotate credentials regularly** using Secrets Manager rotation
6. **Enable RDS encryption** (already configured)
7. **Use private subnets** for application and database (already configured)

## Cost Optimization

1. Use **Reserved Instances** for predictable workloads
2. Enable **Auto Scaling** based on demand (already configured)
3. Use **RDS Reserved Instances** for database
4. Review **CloudWatch metrics** for right-sizing
5. Enable **S3 Intelligent-Tiering** for log storage

## Backup and Recovery

1. **RDS automated backups** are enabled (30-day retention in production)
2. Create **manual snapshots** before major changes
3. Test **point-in-time recovery** periodically
4. Document and test **disaster recovery procedures**
