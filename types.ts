
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
  VIDEO_CLEANING = 'video_cleaning',
  FILE_CLEANING = 'file_cleaning',
  API_SETTINGS = 'api_settings',
  LOGS_AUDIT = 'logs_audit',
  ADMIN_LOGS = 'admin_logs', // New View
  REPORTS = 'reports',
}

export interface User {
  username: string;
  role: Role;
  avatar: string;
}

export interface LogEntry {
  id: number;
  timestamp: string; // ISO String for better sorting/filtering
  severity: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  module: 'AUTH' | 'CONFIG' | 'POLICY' | 'SYSTEM' | 'FILE' | 'VIDEO' | 'API' | 'THREAT';
  messageKey: string; // Translation key
  params?: Record<string, string | number>; // Dynamic params for translation
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
