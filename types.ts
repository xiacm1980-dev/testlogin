export enum Role {
  SYSADMIN = 'sysadmin',
  SECADMIN = 'secadmin',
  LOGADMIN = 'logadmin',
}

export enum View {
  DASHBOARD = 'dashboard',
  SYSTEM_CONFIG = 'system_config',
  USER_MANAGEMENT = 'user_management',
  SECURITY_POLICIES = 'security_policies',
  THREAT_PROTECTION = 'threat_protection',
  LOGS_AUDIT = 'logs_audit',
  LOGS_TRAFFIC = 'logs_traffic',
}

export interface User {
  username: string;
  role: Role;
  avatar: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  module: string;
  message: string;
  sourceIp?: string;
  user?: string;
}

export interface PolicyRule {
  id: number;
  name: string;
  source: string;
  destination: string;
  service: string;
  action: 'ALLOW' | 'DENY';
  enabled: boolean;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  throughput: number;
}