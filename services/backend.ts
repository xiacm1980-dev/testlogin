
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

const STORAGE_KEYS = {
  TASKS: 'aegis_db_tasks',
  THREATS: 'aegis_db_threats',
  POLICIES: 'aegis_db_policies',
  THREAT_CONFIG: 'aegis_db_threat_config',
  LOGS: 'aegis_db_logs',
  REPORTS: 'aegis_db_reports'
};

// Singleton Mock Backend Class
class BackendService {
  private tasks: Task[] = [];
  private policies: PolicyRule[] = [];
  private logs: LogEntry[] = [];
  private reports: Report[] = [];
  
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

    if (t) this.tasks = JSON.parse(t);
    if (th) this.threats = { ...this.threats, ...JSON.parse(th) };
    if (p) this.policies = JSON.parse(p);
    if (tc) this.threatConfig = JSON.parse(tc);
    if (l) this.logs = JSON.parse(l);
    if (r) this.reports = JSON.parse(r);

    // Seed defaults if empty
    if (this.tasks.length === 0) {
      this.tasks = [
        { id: 'T-10293', name: 'financial_report_q3.docx', size: '2.4 MB', sizeBytes: 2400000, status: 'CLEAN', type: 'DOC', progress: 100, currentStep: 'file.status.clean', submittedAt: '10:42 AM' },
        { id: 'T-10294', name: 'site_photo.jpg', size: '5.1 MB', sizeBytes: 5100000, status: 'MALICIOUS', type: 'IMG', progress: 100, currentStep: 'file.status.malicious', submittedAt: '10:45 AM' }
      ];
    }
    
    if (this.policies.length === 0) {
       this.policies = [
          { id: 1, name: 'Allow Web Traffic', source: 'Any', destination: 'Web_Server_DMZ', service: 'HTTP/HTTPS', action: 'ALLOW', enabled: true },
          { id: 2, name: 'Block Malicious IPs', source: 'Threat_Intel_List', destination: 'Any', service: 'Any', action: 'DENY', enabled: true },
          { id: 3, name: 'Allow DNS', source: 'Internal_LAN', destination: 'Any', service: 'DNS', action: 'ALLOW', enabled: true },
          { id: 4, name: 'Management Access', source: 'Mgmt_VLAN', destination: 'Local_Interface', service: 'SSH/HTTPS', action: 'ALLOW', enabled: true },
          { id: 5, name: 'Block Legacy Protocols', source: 'Any', destination: 'Any', service: 'Telnet/FTP', action: 'DENY', enabled: false },
       ];
    }

    if (this.logs.length === 0) {
        this.log('SYSTEM', 'INFO', 'log.msg.system_start');
        this.log('AUTH', 'INFO', 'log.msg.login_success', { user: 'sysadmin' }, undefined, 'sysadmin');
    }

    if (this.reports.length === 0) {
        // Seed one report
        this.reports.push({
            id: 'R-20231001',
            name: 'Security_Audit_Sept_2023',
            type: 'AUDIT',
            dateRange: '2023-09-01 - 2023-09-30',
            generatedBy: 'System',
            generatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            content: "SIMULATED HISTORICAL REPORT\n..."
        });
    }
    
    this.save();
  }

  private save() {
    this.threats.active_rules = this.policies.filter(p => p.enabled).length;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
    localStorage.setItem(STORAGE_KEYS.THREATS, JSON.stringify(this.threats));
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(this.policies));
    localStorage.setItem(STORAGE_KEYS.THREAT_CONFIG, JSON.stringify(this.threatConfig));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs.slice(0, 500)));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
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
    this.save();
  }

  // --- Report Generation Logic ---
  public generateReport(type: 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE', user: string, lang: 'en' | 'zh') {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const dateRange = `${monthStart.toISOString().split('T')[0]} - ${now.toISOString().split('T')[0]}`;
      const id = `R-${Date.now().toString().slice(-6)}`;
      
      let name = '';
      let content = '';

      if (type === 'AUDIT') {
          name = `Security_Audit_${now.toISOString().slice(0,7)}`;
          
          // 1. File Clean Stats
          const totalFiles = this.tasks.length;
          const maliciousFiles = this.tasks.filter(t => t.status === 'MALICIOUS').length;
          const maliciousDetails = this.tasks.filter(t => t.status === 'MALICIOUS').map(t => `- ${t.name}: Detected`).join('\n');
          
          // 2. Video Stats
          const streams = this.threats.active_video_tasks;
          const processedData = (streams * 24 * 60 * 5).toFixed(2); // Simulated MB
          
          // 3. API Stats
          const apiCalls = this.logs.filter(l => l.module === 'API').length;
          
          // 4. Threat Stats
          const threatLogs = this.logs.filter(l => l.module === 'THREAT');
          const threatDetails = threatLogs.slice(0, 10).map(l => `- [${l.timestamp}] ${l.messageKey} ${l.params ? JSON.stringify(l.params) : ''}`).join('\n');

          content = `
==================================================
      AEGIS MONTHLY SECURITY AUDIT REPORT
==================================================
Date Range: ${dateRange}
Generated By: ${user}
Language: ${lang}

[1] FILE CLEANING AUDIT
--------------------------------------------------
Total Files Processed: ${totalFiles}
Threats Neutralized: ${maliciousFiles}
Clean Rate: ${((totalFiles - maliciousFiles)/totalFiles * 100).toFixed(1)}%

Critical Detections:
${maliciousDetails || 'None'}

[2] VIDEO STREAM SECURITY
--------------------------------------------------
Active Streams: ${streams}
Protocols: RTSP, ONVIF
Total Data Processed (Est): ${processedData} GB
Re-encoding Policy: H.264 -> YUV -> Noise -> H.264 (Active)

[3] API INTERFACE USAGE
--------------------------------------------------
Total Calls: ${apiCalls}
Top Consumers: Internal_Web, Mobile_App
Anomalies: 0

[4] THREAT DEFENSE SUMMARY
--------------------------------------------------
Total Attacks Blocked: ${this.threats.total_attacks}
Malware Detected: ${this.threats.malware_detected}
SYN Flood Mitigation: ${this.threats.mitigating ? 'Active' : 'Disabled'}
Current Dropped Packets: ${this.threats.dropped}

Recent Threat Events (Top 10):
${threatDetails}
          `;
      } else if (type === 'TRAFFIC') {
          name = `Traffic_Analysis_${now.toISOString().slice(0,7)}`;
          
          const totalBytes = this.tasks.reduce((acc, t) => acc + t.sizeBytes, 0);
          const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
          
          content = `
==================================================
      AEGIS TRAFFIC ANALYSIS REPORT
==================================================
Date Range: ${dateRange}

[1] FILE TRANSFER TRAFFIC (CDR)
--------------------------------------------------
Total Volume: ${totalMB} MB
File Count: ${this.tasks.length}
Avg File Size: ${(totalBytes / (this.tasks.length || 1) / 1024).toFixed(2)} KB

[2] VIDEO STREAMING BANDWIDTH
--------------------------------------------------
Ingress Ports: 554, 8080, 8081
Active Channels: ${this.threats.active_video_tasks}
Est. Throughput: ${(this.threats.active_video_tasks * 4.5).toFixed(1)} Mbps
          `;

      } else if (type === 'COMPLIANCE') {
          name = `Compliance_Log_${now.toISOString().slice(0,7)}`;
          
          const adminLogs = this.logs.filter(l => ['AUTH', 'CONFIG', 'POLICY'].includes(l.module));
          const logDetails = adminLogs.slice(0, 20).map(l => `[${l.timestamp}] [${l.module}] ${l.user || 'System'}: ${l.messageKey}`).join('\n');
          
          content = `
==================================================
      AEGIS ADMINISTRATOR COMPLIANCE REPORT
==================================================
Date Range: ${dateRange}
Generated By: ${user}

[1] POLICY CONFIGURATION
--------------------------------------------------
Active Firewall Rules: ${this.policies.filter(p => p.enabled).length}
Inactive Rules: ${this.policies.filter(p => !p.enabled).length}
Whitelisted IPs: ${this.threatConfig.whitelist.join(', ')}

[2] ADMINISTRATOR ACTIONS
--------------------------------------------------
Total Actions Recorded: ${adminLogs.length}

Detailed Operation Log (Last 20):
${logDetails}
          `;
      }

      const newReport: Report = {
          id,
          name,
          type,
          dateRange,
          generatedBy: user,
          generatedAt: now.toISOString(),
          content
      };

      this.reports.unshift(newReport);
      this.save();
      return newReport;
  }

  public getReports() {
      return [...this.reports];
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
    
    // 2. Threat Simulation
    if (this.threats.mitigating) {
      if (Math.random() > 0.8) {
         this.threats.pps = Math.max(1000, this.threats.pps + Math.floor(Math.random() * 500 - 250));
         const dropRate = this.threats.pps > this.threatConfig.synThreshold ? 0.1 : 0.01;
         const newDrops = Math.floor(this.threats.pps * dropRate * Math.random());
         this.threats.dropped += newDrops;
         
         // Log SYN Flood occasionally
         if (this.threats.pps > this.threatConfig.synThreshold * 1.5 && Math.random() > 0.95) {
             this.log('THREAT', 'WARN', 'log.msg.threat_syn', { pps: this.threats.pps }, 'External');
         }
      }
    }

    // 3. Firewall Simulation
    if (Math.random() > 0.9) {
       const denyRules = this.policies.filter(p => p.enabled && p.action === 'DENY');
       if (denyRules.length > 0) {
           const rule = denyRules[Math.floor(Math.random() * denyRules.length)];
           this.threats.total_attacks++;
           this.log('THREAT', 'WARN', 'log.msg.threat_block', { id: rule.id, name: rule.name }, `10.5.${Math.floor(Math.random()*255)}.12`);
       }
    }
    
    // 4. API Simulation
    if (Math.random() > 0.7) {
        const methods = ['GET', 'POST'];
        const endpoints = ['/api/v1/stats', '/api/v1/tasks', '/api/v1/health'];
        this.log('API', 'INFO', 'log.msg.api_call', { 
            method: methods[Math.floor(Math.random()*methods.length)], 
            endpoint: endpoints[Math.floor(Math.random()*endpoints.length)] 
        }, '192.168.1.105');
    }

    // 5. Video Cleaning Logs (Every 5 seconds in simulation ~ representing 5 minutes real time)
    this.videoLogCounter++;
    if (this.videoLogCounter > 5) {
        this.videoLogCounter = 0;
        this.log('VIDEO', 'INFO', 'log.msg.video_stat', { port: 554, mb: (Math.random() * 50 + 10).toFixed(1) }, 'Video Daemon');
        this.log('VIDEO', 'INFO', 'log.msg.video_stat', { port: 8080, mb: (Math.random() * 50 + 10).toFixed(1) }, 'Video Daemon');
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

  public loginUser(user: string, role: string) {
      this.log('AUTH', 'INFO', 'log.msg.login_success', { user }, undefined, user);
  }

  public uploadFile(file: File) {
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
      submittedAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    this.tasks.unshift(newTask);
    this.save();
    // No explicit log here, we wait for processing to finish or start, but we can log the upload event if needed.
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
