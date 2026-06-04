# CWMS RDS Module

variable "name_prefix" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "database_subnets" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "allocated_storage" {
  type    = number
  default = 100
}

variable "database_name" {
  type    = string
  default = "cwms"
}

variable "master_username" {
  type    = string
  default = "cwms_admin"
}

variable "multi_az" {
  type    = bool
  default = true
}

variable "backup_retention_period" {
  type    = number
  default = 7
}

variable "tags" {
  type    = map(string)
  default = {}
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.name_prefix}-db-subnet-group"
  subnet_ids = var.database_subnets
  
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-db-subnet-group"
  })
}

# Generate random password
resource "random_password" "master" {
  length  = 32
  special = false
}

# Store password in Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.name_prefix}-db-password"
  
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.master.result
    host     = aws_db_instance.main.address
    port     = 5432
    database = var.database_name
  })
}

# RDS Parameter Group
resource "aws_db_parameter_group" "main" {
  name   = "${var.name_prefix}-pg15"
  family = "postgres15"
  
  parameter {
    name  = "log_connections"
    value = "1"
  }
  
  parameter {
    name  = "log_disconnections"
    value = "1"
  }
  
  parameter {
    name  = "log_statement"
    value = "ddl"
  }
  
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }
  
  tags = var.tags
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.name_prefix}-db"
  
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  max_allocated_storage = var.allocated_storage * 2
  storage_type         = "gp3"
  storage_encrypted    = true
  
  db_name  = var.database_name
  username = var.master_username
  password = random_password.master.result
  
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.security_group_id]
  parameter_group_name   = aws_db_parameter_group.main.name
  
  multi_az                     = var.multi_az
  publicly_accessible          = false
  deletion_protection          = true
  skip_final_snapshot          = false
  final_snapshot_identifier    = "${var.name_prefix}-final-snapshot"
  backup_retention_period      = var.backup_retention_period
  backup_window                = "03:00-04:00"
  maintenance_window           = "Mon:04:00-Mon:05:00"
  auto_minor_version_upgrade   = true
  
  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-db"
  })
}

# Outputs
output "instance_id" {
  value = aws_db_instance.main.id
}

output "endpoint" {
  value = aws_db_instance.main.endpoint
}

output "address" {
  value = aws_db_instance.main.address
}

output "port" {
  value = aws_db_instance.main.port
}

output "database_name" {
  value = aws_db_instance.main.db_name
}

output "secret_arn" {
  value = aws_secretsmanager_secret.db_password.arn
}
