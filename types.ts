
export enum Role {
  SYSADMIN = 'sysadmin',
  SECADMIN = 'secadmin',
  LOGADMIN = 'logadmin',
  USER = 'user', // General User
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
  ADMIN_LOGS = 'admin_logs',
  REPORTS = 'reports',
}

export interface User {
  username: string;
  role: Role;
  avatar: string;
  name?: string; // Display name
}

export interface GeneralUser {
  id: string; // Username
  name: string;
  password: string;
  unit: string;
  department: string;
  contact: string;
  createdAt: string;
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

export interface ServiceStatus {
  name: string;
  status: 'running' | 'degraded' | 'stopped';
  load: 'low' | 'medium' | 'high';
  lastCheck: string;
}

export interface SystemStats {
  cpu: number;
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  services: ServiceStatus[];
}

export interface Task {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  status: 'CLEAN' | 'MALICIOUS' | 'SCANNING' | 'UPLOADING';
  type: 'DOC' | 'IMG' | 'AV' | 'OTHER';
  progress: number;
  currentStep: string;
  submittedAt: string;
  completedAt?: string;
  submittedBy: string;
}

export interface ThreatStats {
  pps: number;
  dropped: number;
  sources: number;
  mitigating: boolean;
  malware_detected: number;
  total_attacks: number;
  active_rules: number;
  uptime_start: number;
  active_video_tasks: number;
  active_file_tasks: number;
}

export interface ThreatConfig {
  synThreshold: number;
  udpThreshold: number;
  synAction: 'drop' | 'blacklist';
  udpAction: 'drop' | 'ratelimit';
  whitelist: string[];
}

export interface Report {
  id: string;
  name: string;
  type: 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE';
  dateRange: string;
  generatedBy: string;
  generatedAt: string;
  content: string;
}

export interface ArchiveFile {
  id: string;
  filename: string;
  month: string;
  size: string;
  createdAt: string;
}

export interface BackupFile {
  id: string;
  name: string;
  createdAt: string;
  size: string;
  type: 'MANUAL' | 'AUTO';
  data: string;
}

export interface NetworkConfig {
  hostname: string;
  ipAddress: string;
  netmask: string;
  gateway: string;
  dns1: string;
  ntpServer: string;
}

export interface LogConfig {
  retentionDays: number;
  diskCleanupThreshold: number;
  autoArchive: boolean;
}