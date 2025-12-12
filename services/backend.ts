
import { GeneralUser, Role } from '../types';

// Types representing the DB schema (matching types.ts updates)
export interface Task {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  status: 'CLEAN' | 'MALICIOUS' | 'SCANNING' | 'UPLOADING';
  type: 'DOC' | 'IMG' | 'AV' | 'OTHER';
  progress: number; // 0-100
  currentStep: string; // Translation key
  submittedAt: string;
  completedAt?: string;
  submittedBy: string; // New field
}

export interface ThreatStats {
  pps: number;
  dropped: number;
  sources: number;
  mitigating: boolean;
  
  // Persisted Stats
  malware_detected: number;
  total_attacks: number;
  active_rules: number;
  
  uptime_start: number;
  active_video_tasks: number;
  active_file_tasks: number;
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

export interface PolicyRule {
  id: number;
  name: string;
  source: string;
  destination: string;
  service: string;
  action: 'ALLOW' | 'DENY';
  enabled: boolean;
}

export interface ThreatConfig {
  synThreshold: number;
  udpThreshold: number;
  synAction: 'drop' | 'blacklist';
  udpAction: 'drop' | 'ratelimit';
  whitelist: string[];
}

export interface LogEntry {
  id: number;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  module: 'AUTH' | 'CONFIG' | 'POLICY' | 'SYSTEM' | 'FILE' | 'VIDEO' | 'API' | 'THREAT';
  messageKey: string;
  params?: Record<string, string | number>;
  sourceIp?: string;
  user?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE';
  dateRange: string;
  generatedBy: string;
  generatedAt: string; // ISO String
  content: string; // The text content of the report
}

export interface ArchiveFile {
    id: string;
    filename: string; // e.g., archive_2023_08.sqlite
    month: string; // 2023-08
    size: string;
    createdAt: string;
}

export interface BackupFile {
    id: string;
    name: string;
    createdAt: string;
    size: string;
    type: 'MANUAL' | 'AUTO';
    data: string; // JSON string of the state
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
    diskCleanupThreshold: number; // Percentage (30%)
    autoArchive: boolean;
}

interface AdminUser {
    role: Role;
    password: string;
}

const STORAGE_KEYS = {
  TASKS: 'aegis_db_tasks',
  THREATS: 'aegis_db_threats',
  POLICIES: 'aegis_db_policies',
  THREAT_CONFIG: 'aegis_db_threat_config',
  LOGS: 'aegis_db_logs',
  REPORTS: 'aegis_db_reports',
  ARCHIVES: 'aegis_db_archives',
  BACKUPS: 'aegis_db_backups',
  NET_CONFIG: 'aegis_db_net_config',
  LOG_CONFIG: 'aegis_db_log_config',
  USERS: 'aegis_db_users', // General Users
  ADMINS: 'aegis_db_admins' // Admin Users
};

// Singleton Mock Backend Class
class BackendService {
  private tasks: Task[] = [];
  private policies: PolicyRule[] = [];
  private logs: LogEntry[] = [];
  private reports: Report[] = [];
  private archives: ArchiveFile[] = [];
  private backups: BackupFile[] = [];
  private generalUsers: GeneralUser[] = [];
  private adminUsers: AdminUser[] = [];
  
  private networkConfig: NetworkConfig = {
      hostname: 'aegis-core-01',
      ipAddress: '192.168.1.100',
      netmask: '255.255.255.0',
      gateway: '192.168.1.1',
      dns1: '8.8.8.8',
      ntpServer: 'pool.ntp.org'
  };

  private logConfig: LogConfig = {
      retentionDays: 90,
      diskCleanupThreshold: 30,
      autoArchive: true
  };
  
  private threatConfig: ThreatConfig = {
    synThreshold: 1000,
    udpThreshold: 2000,
    synAction: 'drop',
    udpAction: 'drop',
    whitelist: ['192.168.1.0/24', '10.0.0.5']
  };

  private threats: ThreatStats = {
    pps: 45200,
    dropped: 1204,
    sources: 12,
    mitigating: true,
    malware_detected: 142,
    total_attacks: 8942,
    active_rules: 0,
    uptime_start: Date.now() - (45 * 24 * 3600 * 1000),
    active_video_tasks: 12,
    active_file_tasks: 85
  };

  private system: SystemStats = {
    cpu: 32,
    memory: { used: 12.4, total: 32 },
    disk: { used: 68, total: 100 },
    services: [
      { name: 'service.sandbox', status: 'running', load: 'medium', lastCheck: 'time.just_now' },
      { name: 'service.video', status: 'running', load: 'high', lastCheck: 'time.1_min_ago' },
      { name: 'service.firewall', status: 'running', load: 'low', lastCheck: 'time.just_now' },
      { name: 'service.logs', status: 'degraded', load: 'high', lastCheck: 'time.5_min_ago' }
    ]
  };

  private intervalId: any = null;
  private videoLogCounter = 0;
  private archiveCheckCounter = 0;

  constructor() {
    this.load();
    this.startEngine();
  }

  private load() {
    const t = localStorage.getItem(STORAGE_KEYS.TASKS);
    const th = localStorage.getItem(STORAGE_KEYS.THREATS);
    const p = localStorage.getItem(STORAGE_KEYS.POLICIES);
    const tc = localStorage.getItem(STORAGE_KEYS.THREAT_CONFIG);
    const l = localStorage.getItem(STORAGE_KEYS.LOGS);
    const r = localStorage.getItem(STORAGE_KEYS.REPORTS);
    const a = localStorage.getItem(STORAGE_KEYS.ARCHIVES);
    const b = localStorage.getItem(STORAGE_KEYS.BACKUPS);
    const nc = localStorage.getItem(STORAGE_KEYS.NET_CONFIG);
    const lc = localStorage.getItem(STORAGE_KEYS.LOG_CONFIG);
    const u = localStorage.getItem(STORAGE_KEYS.USERS);
    const ad = localStorage.getItem(STORAGE_KEYS.ADMINS);

    if (t) this.tasks = JSON.parse(t);
    if (th) this.threats = { ...this.threats, ...JSON.parse(th) };
    if (p) this.policies = JSON.parse(p);
    if (tc) this.threatConfig = JSON.parse(tc);
    if (l) this.logs = JSON.parse(l);
    if (r) this.reports = JSON.parse(r);
    if (a) this.archives = JSON.parse(a);
    if (b) this.backups = JSON.parse(b);
    if (nc) this.networkConfig = JSON.parse(nc);
    if (lc) this.logConfig = JSON.parse(lc);
    if (u) this.generalUsers = JSON.parse(u);
    if (ad) this.adminUsers = JSON.parse(ad);

    // Seed defaults
    if (this.tasks.length === 0) {
      this.tasks = [
        { id: 'T-10293', name: 'financial_report_q3.docx', size: '2.4 MB', sizeBytes: 2400000, status: 'CLEAN', type: 'DOC', progress: 100, currentStep: 'file.status.clean', submittedAt: '10:42 AM', submittedBy: 'System' },
        { id: 'T-10294', name: 'site_photo.jpg', size: '5.1 MB', sizeBytes: 5100000, status: 'MALICIOUS', type: 'IMG', progress: 100, currentStep: 'file.status.malicious', submittedAt: '10:45 AM', submittedBy: 'System' }
      ];
    }
    
    if (this.policies.length === 0) {
       this.policies = [
          { id: 1, name: 'Allow Web Traffic', source: 'Any', destination: 'Web_Server_DMZ', service: 'HTTP/HTTPS', action: 'ALLOW', enabled: true },
          { id: 2, name: 'Block Malicious IPs', source: 'Threat_Intel_List', destination: 'Any', service: 'Any', action: 'DENY', enabled: true },
          { id: 3, name: 'Allow DNS', source: 'Internal_LAN', destination: 'Any', service: 'DNS', action: 'ALLOW', enabled: true },
          { id: 4, name: 'Management Access', source: 'Mgmt_VLAN', destination: 'Local_Interface', service: 'SSH/HTTPS', action: 'ALLOW', enabled: true },
       ];
    }
    
    if (this.generalUsers.length === 0) {
        this.generalUsers = [
            { id: 'user01', name: 'John Doe', password: 'password', unit: 'Headquarters', department: 'Finance', contact: '555-0101', createdAt: new Date().toISOString() }
        ];
    }

    if (this.adminUsers.length === 0) {
        this.adminUsers = [
            { role: Role.SYSADMIN, password: '123456' },
            { role: Role.SECADMIN, password: '123456' },
            { role: Role.LOGADMIN, password: '123456' }
        ];
    }
    
    this.save();
  }

  private save() {
    this.threats.active_rules = this.policies.filter(p => p.enabled).length;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
    localStorage.setItem(STORAGE_KEYS.THREATS, JSON.stringify(this.threats));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(this.policies));
    localStorage.setItem(STORAGE_KEYS.THREAT_CONFIG, JSON.stringify(this.threatConfig));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs.slice(0, 1000))); // Persist last 1000 logs
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
    localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(this.archives));
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(this.backups));
    localStorage.setItem(STORAGE_KEYS.NET_CONFIG, JSON.stringify(this.networkConfig));
    localStorage.setItem(STORAGE_KEYS.LOG_CONFIG, JSON.stringify(this.logConfig));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.generalUsers));
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(this.adminUsers));
  }

  public log(module: LogEntry['module'], severity: LogEntry['severity'], messageKey: string, params?: Record<string, any>, sourceIp?: string, user?: string) {
    const entry: LogEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      severity,
      module,
      messageKey,
      params,
      sourceIp,
      user
    };
    this.logs.unshift(entry);
    // Don't save on every log to prevent thrashing, relying on tick or specific actions
  }

  private startEngine() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick() {
    // 1. System Fluctuations
    this.system.cpu = Math.max(5, Math.min(100, this.system.cpu + (Math.random() * 10 - 5)));
    this.system.memory.used = Math.max(4, Math.min(30, this.system.memory.used + (Math.random() * 2 - 1)));
    
    // Simulate disk usage increasing slightly over time
    if (Math.random() > 0.95) {
        this.system.disk.used = Math.min(99, this.system.disk.used + 0.1);
    }
    
    // 2. Archiving Service (Run every ~10s in sim)
    this.archiveCheckCounter++;
    if (this.archiveCheckCounter > 10) {
        this.archiveCheckCounter = 0;
        this.runArchivingService();
    }
    
    // 3. Threat Simulation
    if (this.threats.mitigating) {
      if (Math.random() > 0.8) {
         this.threats.pps = Math.max(1000, this.threats.pps + Math.floor(Math.random() * 500 - 250));
         const dropRate = this.threats.pps > this.threatConfig.synThreshold ? 0.1 : 0.01;
         const newDrops = Math.floor(this.threats.pps * dropRate * Math.random());
         this.threats.dropped += newDrops;
         
         if (this.threats.pps > this.threatConfig.synThreshold * 1.5 && Math.random() > 0.95) {
             this.log('THREAT', 'WARN', 'log.msg.threat_syn', { pps: this.threats.pps }, 'External');
         }
      }
    }

    // 4. Firewall Simulation
    if (Math.random() > 0.9) {
       const denyRules = this.policies.filter(p => p.enabled && p.action === 'DENY');
       if (denyRules.length > 0) {
           const rule = denyRules[Math.floor(Math.random() * denyRules.length)];
           this.threats.total_attacks++;
           this.log('THREAT', 'WARN', 'log.msg.threat_block', { id: rule.id, name: rule.name }, `10.5.${Math.floor(Math.random()*255)}.12`);
       }
    }
    
    // 5. Video Cleaning Logs
    this.videoLogCounter++;
    if (this.videoLogCounter > 5) {
        this.videoLogCounter = 0;
        this.log('VIDEO', 'INFO', 'log.msg.video_stat', { port: 554, mb: (Math.random() * 50 + 10).toFixed(1) }, 'Video Daemon');
    }

    // 6. File Tasks Simulation
    let tasksChanged = false;
    let activeFileTasksCount = 0;
    this.tasks.forEach(task => {
      if (task.status === 'UPLOADING' || task.status === 'SCANNING') {
        tasksChanged = true;
        activeFileTasksCount++;
        this.processTaskStep(task);
      }
    });
    this.threats.active_file_tasks = activeFileTasksCount;

    if (tasksChanged || Math.random() > 0.7) this.save();
  }

  private runArchivingService() {
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - this.logConfig.retentionDays);

      // 1. Check for old logs
      const oldLogs = this.logs.filter(l => new Date(l.timestamp) < cutoffDate);
      
      if (oldLogs.length > 0) {
          // In a real system, we'd append to sqlite. Here we just create a fake archive file if it doesn't exist for that month
          const monthKey = cutoffDate.toISOString().slice(0, 7); // YYYY-MM
          const existingArchive = this.archives.find(a => a.month === monthKey);
          
          if (!existingArchive) {
              this.archives.unshift({
                  id: `arc_${Date.now()}`,
                  filename: `aegis_logs_${monthKey.replace('-', '_')}.sqlite`,
                  month: monthKey,
                  size: '120 MB', // Mock size
                  createdAt: new Date().toISOString()
              });
              this.log('SYSTEM', 'INFO', 'Archived logs for ' + monthKey);
          }
          
          // Remove old logs from active memory
          this.logs = this.logs.filter(l => new Date(l.timestamp) >= cutoffDate);
      }

      // 2. Check Disk Space Cleanup Strategy
      const freeSpace = 100 - this.system.disk.used;
      if (freeSpace < this.logConfig.diskCleanupThreshold && this.archives.length > 0) {
          // Sort oldest first
          const sortedArchives = [...this.archives].sort((a,b) => a.month.localeCompare(b.month));
          const toDelete = sortedArchives[0];
          
          // Delete oldest
          this.archives = this.archives.filter(a => a.id !== toDelete.id);
          this.system.disk.used -= 5; // Simulate freeing space
          this.log('SYSTEM', 'WARN', `Disk low (${freeSpace.toFixed(1)}%). Auto-deleted old archive: ${toDelete.filename}`);
      }
  }

  private processTaskStep(task: Task) {
    let steps: { msg: string; progress: number }[] = [];
    if (task.type === 'DOC') steps = [{ msg: 'file.step.uploading', progress: 10 }, { msg: 'file.step.doc_convert', progress: 40 }, { msg: 'file.step.doc_strip', progress: 80 }, { msg: 'file.status.clean', progress: 100 }];
    else if (task.type === 'IMG') steps = [{ msg: 'file.step.uploading', progress: 10 }, { msg: 'file.step.img_rotate', progress: 30 }, { msg: 'file.step.img_rotate', progress: 50 }, { msg: 'file.step.img_rotate', progress: 70 }, { msg: 'file.step.img_sharpen', progress: 85 }, { msg: 'file.step.img_convert', progress: 95 }, { msg: 'file.status.clean', progress: 100 }];
    else if (task.type === 'AV') steps = [{ msg: 'file.step.uploading', progress: 5 }, { msg: 'file.step.av_decode', progress: 25 }, { msg: 'file.step.av_compress', progress: 50 }, { msg: 'file.step.av_noise', progress: 75 }, { msg: 'file.step.av_encode', progress: 95 }, { msg: 'file.status.clean', progress: 100 }];
    else steps = [{ msg: 'file.status.clean', progress: 100 }];

    const currentIdx = steps.findIndex(s => s.msg === task.currentStep);
    const nextIdx = currentIdx + 1;

    if (currentIdx === -1) {
      task.currentStep = steps[0].msg; task.progress = steps[0].progress; task.status = 'SCANNING';
    } else if (nextIdx < steps.length) {
      if (Math.random() > 0.3) { task.currentStep = steps[nextIdx].msg; task.progress = steps[nextIdx].progress; }
    } else {
      const isMalicious = Math.random() < 0.1;
      task.status = isMalicious ? 'MALICIOUS' : 'CLEAN';
      task.currentStep = isMalicious ? 'file.status.malicious' : 'file.status.clean';
      task.completedAt = new Date().toLocaleTimeString();
      if (isMalicious) { 
          this.threats.malware_detected += 1; 
          this.log('FILE', 'FATAL', 'log.msg.file_malware', { file: task.name }, 'Sandbox', 'System');
      } else {
          this.log('FILE', 'INFO', 'log.msg.file_clean', { file: task.name, size: task.size }, 'Sandbox', 'System');
      }
    }
  }

  // --- API Methods ---
  public getSystemData() { return { system: { ...this.system }, threats: { ...this.threats } }; }
  public getTasks() { return [...this.tasks].sort((a, b) => new Date('1970/01/01 ' + b.submittedAt).getTime() - new Date('1970/01/01 ' + a.submittedAt).getTime()); }
  public getLogs() { return [...this.logs]; }
  public getReports() { return [...this.reports]; }

  public generateReport(type: 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE', user: string, language: string) {
      const id = `rep_${Date.now()}`;
      let name = '';
      let content = '';
      const dateStr = new Date().toISOString().slice(0, 10);

      switch(type) {
          case 'AUDIT':
              name = `Security_Audit_${dateStr}`;
              content = `SECURITY AUDIT REPORT\nDate: ${dateStr}\nGenerated By: ${user}\nLanguage: ${language}\n\n1. Summary\nNo critical vulnerabilities found.\n\n2. User Activity\n...`;
              break;
          case 'TRAFFIC':
              name = `Traffic_Analysis_${dateStr}`;
              content = `TRAFFIC ANALYSIS REPORT\nDate: ${dateStr}\nGenerated By: ${user}\nLanguage: ${language}\n\n1. Bandwidth Usage\nPeak: 450 Mbps\nAverage: 120 Mbps\n...`;
              break;
          case 'COMPLIANCE':
              name = `Compliance_Check_${dateStr}`;
              content = `COMPLIANCE REPORT (ISO 27001)\nDate: ${dateStr}\nGenerated By: ${user}\nLanguage: ${language}\n\nStatus: COMPLIANT\n...`;
              break;
      }

      const report: Report = {
          id,
          name,
          type,
          dateRange: 'Last 30 Days',
          generatedBy: user,
          generatedAt: new Date().toISOString(),
          content
      };

      this.reports.unshift(report);
      this.save();
      return report;
  }

  // Network & Config Methods
  public getNetworkConfig() { return { ...this.networkConfig }; }
  public updateNetworkConfig(config: Partial<NetworkConfig>) {
      this.networkConfig = { ...this.networkConfig, ...config };
      this.log('CONFIG', 'WARN', 'log.msg.config_update', { user: 'sysadmin' }, 'Local', 'sysadmin');
      this.save();
      return this.networkConfig;
  }
  
  public getLogConfig() { return { ...this.logConfig }; }
  public updateLogConfig(config: Partial<LogConfig>) {
      this.logConfig = { ...this.logConfig, ...config };
      this.save();
      return this.logConfig;
  }
  
  public getArchives() { return [...this.archives]; }
  
  public getBackups() { return [...this.backups].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
  
  public createBackup() {
      const snapshot = {
          tasks: this.tasks,
          policies: this.policies,
          network: this.networkConfig,
          threatConfig: this.threatConfig,
          users: this.generalUsers,
          admins: this.adminUsers
      };
      
      const newBackup: BackupFile = {
          id: `bkp_${Date.now()}`,
          name: `aegis_full_backup_${new Date().toISOString().slice(0,10)}.zip`,
          createdAt: new Date().toISOString(),
          size: `${(JSON.stringify(snapshot).length / 1024).toFixed(1)} KB`,
          type: 'MANUAL',
          data: JSON.stringify(snapshot)
      };
      
      this.backups.unshift(newBackup);
      this.log('SYSTEM', 'INFO', 'log.msg.backup_create', { name: newBackup.name });
      this.save();
      return newBackup;
  }
  
  public restoreBackup(id: string) {
      const backup = this.backups.find(b => b.id === id);
      if (backup) {
          try {
            const data = JSON.parse(backup.data);
            if (data.tasks) this.tasks = data.tasks;
            if (data.policies) this.policies = data.policies;
            if (data.network) this.networkConfig = data.network;
            if (data.threatConfig) this.threatConfig = data.threatConfig;
            if (data.users) this.generalUsers = data.users;
            if (data.admins) this.adminUsers = data.admins;
            this.log('SYSTEM', 'WARN', `System restored from backup ${backup.name}`);
            this.save();
            return true;
          } catch (e) {
              console.error("Restore failed", e);
              return false;
          }
      }
      return false;
  }

  // --- Auth & User Management ---
  public loginUser(username: string, role: Role) {
      this.log('AUTH', 'INFO', 'log.msg.login_success', { user: username }, undefined, username);
  }
  
  public authenticateGeneralUser(id: string, pass: string): GeneralUser | null {
      const user = this.generalUsers.find(u => u.id === id && u.password === pass);
      return user || null;
  }

  public authenticateAdmin(role: Role, pass: string): boolean {
      const admin = this.adminUsers.find(a => a.role === role);
      return admin ? admin.password === pass : false;
  }

  public changePassword(username: string, role: Role, oldPass: string, newPass: string): boolean {
      if (role === Role.USER) {
          const user = this.generalUsers.find(u => u.id === username);
          if (user && user.password === oldPass) {
              user.password = newPass;
              this.log('AUTH', 'INFO', `Password changed for user ${username}`, undefined, undefined, username);
              this.save();
              return true;
          }
      } else {
          const admin = this.adminUsers.find(a => a.role === role);
          if (admin && admin.password === oldPass) {
              admin.password = newPass;
              this.log('AUTH', 'WARN', `Password changed for admin ${role}`, undefined, undefined, role);
              this.save();
              return true;
          }
      }
      return false;
  }

  public getGeneralUsers() { return [...this.generalUsers]; }

  public addGeneralUser(user: GeneralUser) {
      this.generalUsers.push(user);
      this.save();
  }

  public updateGeneralUser(user: GeneralUser) {
      this.generalUsers = this.generalUsers.map(u => u.id === user.id ? user : u);
      this.save();
  }

  public deleteGeneralUser(id: string) {
      this.generalUsers = this.generalUsers.filter(u => u.id !== id);
      this.save();
  }

  public uploadFile(file: File, submittedBy: string = 'System') {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let type: Task['type'] = 'OTHER';
    if (['txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'wps'].includes(ext)) type = 'DOC';
    else if (['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(ext)) type = 'IMG';
    else if (['mp4', 'avi', 'mov', 'wav', 'mp3', 'flv', 'wma'].includes(ext)) type = 'AV';

    const newTask: Task = {
      id: `T-${Math.floor(Math.random() * 90000) + 10000}`,
      name: file.name,
      size: this.formatSize(file.size),
      sizeBytes: file.size,
      status: 'UPLOADING',
      type,
      progress: 0,
      currentStep: 'file.step.uploading',
      submittedAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      submittedBy
    };
    this.tasks.unshift(newTask);
    this.save();
  }

  private formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  public toggleDdos(enabled: boolean) {
    this.threats.mitigating = enabled;
    this.log('CONFIG', 'WARN', 'log.msg.config_update', { user: 'secadmin' }, undefined, 'secadmin');
    this.save();
  }

  public getPolicies() { return [...this.policies]; }

  public addPolicy(policy: Omit<PolicyRule, 'id'>) {
    const newPolicy: PolicyRule = { ...policy, id: Math.floor(Math.random() * 10000) + 1000 };
    this.policies.push(newPolicy);
    this.log('POLICY', 'WARN', 'log.msg.policy_add', { policy: newPolicy.name }, undefined, 'secadmin');
    this.save();
    return newPolicy;
  }

  public deletePolicy(id: number) {
    this.policies = this.policies.filter(p => p.id !== id);
    this.log('POLICY', 'WARN', 'log.msg.policy_del', { id }, undefined, 'secadmin');
    this.save();
  }

  public togglePolicy(id: number) {
    this.policies = this.policies.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p);
    this.log('POLICY', 'WARN', 'log.msg.policy_toggle', { id }, undefined, 'secadmin');
    this.save();
  }

  public getThreatConfig() { return { ...this.threatConfig }; }

  public updateThreatConfig(config: Partial<ThreatConfig>, user: string = 'secadmin') {
    this.threatConfig = { ...this.threatConfig, ...config };
    this.log('CONFIG', 'WARN', 'log.msg.threat_config', { syn: this.threatConfig.synThreshold, udp: this.threatConfig.udpThreshold }, undefined, user);
    this.save();
  }

  public addWhitelistIp(ip: string) {
    if (!this.threatConfig.whitelist.includes(ip)) {
      this.threatConfig.whitelist.push(ip);
      this.log('CONFIG', 'WARN', 'log.msg.whitelist_add', { ip }, undefined, 'secadmin');
      this.save();
    }
  }

  public removeWhitelistIp(ip: string) {
    this.threatConfig.whitelist = this.threatConfig.whitelist.filter(i => i !== ip);
    this.log('CONFIG', 'WARN', 'log.msg.whitelist_del', { ip }, undefined, 'secadmin');
    this.save();
  }
}

export const backend = new BackendService();
