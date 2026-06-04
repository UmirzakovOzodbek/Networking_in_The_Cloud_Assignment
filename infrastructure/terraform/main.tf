# CWMS Infrastructure - Terraform Configuration
# Main entry point for AWS infrastructure

terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "cwms-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "cwms-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "CWMS"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local variables
locals {
  name_prefix = "cwms-${var.environment}"
  azs         = slice(data.aws_availability_zones.available.names, 0, 3)
  
  common_tags = {
    Project     = "CWMS"
    Environment = var.environment
    Owner       = "DevOps"
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  name_prefix         = local.name_prefix
  vpc_cidr            = var.vpc_cidr
  availability_zones  = local.azs
  public_subnets      = var.public_subnets
  private_subnets     = var.private_subnets
  database_subnets    = var.database_subnets
  enable_nat_gateway  = true
  single_nat_gateway  = var.environment != "production"
  
  tags = local.common_tags
}

# Security Module
module "security" {
  source = "./modules/security"
  
  name_prefix = local.name_prefix
  vpc_id      = module.vpc.vpc_id
  vpc_cidr    = var.vpc_cidr
  
  tags = local.common_tags
}

# ALB Module
module "alb" {
  source = "./modules/alb"
  
  name_prefix       = local.name_prefix
  vpc_id            = module.vpc.vpc_id
  public_subnets    = module.vpc.public_subnet_ids
  security_group_id = module.security.alb_security_group_id
  certificate_arn   = var.certificate_arn
  
  tags = local.common_tags
}

# Auto Scaling Group Module
module "asg" {
  source = "./modules/asg"
  
  name_prefix         = local.name_prefix
  vpc_id              = module.vpc.vpc_id
  private_subnets     = module.vpc.private_subnet_ids
  security_group_id   = module.security.web_security_group_id
  target_group_arn    = module.alb.target_group_arn
  instance_type       = var.instance_type
  min_size            = var.asg_min_size
  max_size            = var.asg_max_size
  desired_capacity    = var.asg_desired_capacity
  
  tags = local.common_tags
}

# RDS Module
module "rds" {
  source = "./modules/rds"
  
  name_prefix             = local.name_prefix
  vpc_id                  = module.vpc.vpc_id
  database_subnets        = module.vpc.database_subnet_ids
  security_group_id       = module.security.db_security_group_id
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  database_name           = var.database_name
  master_username         = var.db_master_username
  multi_az                = var.environment == "production"
  backup_retention_period = var.environment == "production" ? 30 : 7
  
  tags = local.common_tags
}

# CloudWatch Module
module "cloudwatch" {
  source = "./modules/cloudwatch"
  
  name_prefix           = local.name_prefix
  asg_name              = module.asg.asg_name
  alb_arn_suffix        = module.alb.alb_arn_suffix
  target_group_arn_suffix = module.alb.target_group_arn_suffix
  rds_instance_id       = module.rds.instance_id
  sns_topic_arn         = var.alert_sns_topic_arn
  
  tags = local.common_tags
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.dns_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = module.asg.asg_name
}
