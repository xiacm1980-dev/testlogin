import { LogEntry, PolicyRule, Role } from './types';

export const MOCK_LOGS: LogEntry[] = [
  { id: 101, timestamp: '2023-10-27 10:42:01', severity: 'CRITICAL', module: 'IPS', message: 'SQL Injection attempt blocked', sourceIp: '192.168.1.55' },
  { id: 102, timestamp: '2023-10-27 10:41:55', severity: 'INFO', module: 'AUTH', message: 'User admin logged in', user: 'admin', sourceIp: '10.0.0.5' },
  { id: 103, timestamp: '2023-10-27 10:40:12', severity: 'WARN', module: 'SYSTEM', message: 'High memory usage detected (85%)' },
  { id: 104, timestamp: '2023-10-27 10:38:45', severity: 'INFO', module: 'FW', message: 'Rule #4 matching traffic', sourceIp: '172.16.0.22' },
  { id: 105, timestamp: '2023-10-27 10:35:00', severity: 'ERROR', module: 'VPN', message: 'Tunnel down: Site-to-Site A' },
  { id: 106, timestamp: '2023-10-27 10:30:11', severity: 'INFO', module: 'AUTH', message: 'User sec_officer failed login', user: 'sec_officer' },
];

export const INITIAL_POLICIES: PolicyRule[] = [
  { id: 1, name: 'Allow Web Traffic', source: 'Any', destination: 'Web_Server_DMZ', service: 'HTTP/HTTPS', action: 'ALLOW', enabled: true },
  { id: 2, name: 'Block Malicious IPs', source: 'Threat_Intel_List', destination: 'Any', service: 'Any', action: 'DENY', enabled: true },
  { id: 3, name: 'Allow DNS', source: 'Internal_LAN', destination: 'Any', service: 'DNS', action: 'ALLOW', enabled: true },
  { id: 4, name: 'Management Access', source: 'Mgmt_VLAN', destination: 'Local_Interface', service: 'SSH/HTTPS', action: 'ALLOW', enabled: true },
  { id: 5, name: 'Block Legacy Protocols', source: 'Any', destination: 'Any', service: 'Telnet/FTP', action: 'DENY', enabled: false },
];

export const ROLE_COLORS = {
  [Role.SYSADMIN]: 'bg-blue-600',
  [Role.SECADMIN]: 'bg-emerald-600',
  [Role.LOGADMIN]: 'bg-amber-600',
};

export const ROLE_LABELS = {
  [Role.SYSADMIN]: 'System Administrator',
  [Role.SECADMIN]: 'Security Administrator',
  [Role.LOGADMIN]: 'Log Audit Administrator',
};