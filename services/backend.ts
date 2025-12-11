
import { MOCK_LOGS } from '../constants';

// Types representing the DB schema
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
  
  // Persisted Stats as requested
  malware_detected: number; // "含有恶意代码的次数"
  total_attacks: number;    // "收到攻击次数"
  active_rules: number;     // "威胁防御规则数量"
  
  uptime_start: number;
  active_video_tasks: number;
  active_file_tasks: number;
}

export interface ServiceStatus {
  name: string;      // Translation Key
  status: 'running' | 'degraded' | 'stopped';
  load: 'low' | 'medium' | 'high';
  lastCheck: string; // Translation Key
}

export interface SystemStats {
  cpu: number;
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  services: ServiceStatus[];
}

const STORAGE_KEYS = {
  TASKS: 'aegis_db_tasks',
  THREATS: 'aegis_db_threats',
  SYSTEM: 'aegis_db_system' 
};

// Singleton Mock Backend Class
class BackendService {
  private tasks: Task[] = [];
  
  // Default Initial Data
  private threats: ThreatStats = {
    pps: 45200,
    dropped: 1204,
    sources: 12,
    mitigating: true,
    malware_detected: 142,
    total_attacks: 8942,
    active_rules: 4218,
    uptime_start: Date.now() - (45 * 24 * 3600 * 1000), // 45 days ago
    active_video_tasks: 12,
    active_file_tasks: 85
  };

  // Services ordered: File Sandbox, Video, Firewall, Logs
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

  constructor() {
    this.load();
    this.startEngine();
  }

  private load() {
    const t = localStorage.getItem(STORAGE_KEYS.TASKS);
    const th = localStorage.getItem(STORAGE_KEYS.THREATS);
    // Note: We generally don't persist system.services status as it's real-time, but for this mock we reset to default
    
    if (t) this.tasks = JSON.parse(t);
    if (th) {
      const savedThreats = JSON.parse(th);
      // Merge saved stats with current structure in case we added new fields
      this.threats = { ...this.threats, ...savedThreats };
    }
    
    // Seed initial tasks if empty
    if (this.tasks.length === 0) {
      this.tasks = [
        { id: 'T-10293', name: 'financial_report_q3.docx', size: '2.4 MB', sizeBytes: 2400000, status: 'CLEAN', type: 'DOC', progress: 100, currentStep: 'file.status.clean', submittedAt: '10:42 AM' },
        { id: 'T-10294', name: 'site_photo.jpg', size: '5.1 MB', sizeBytes: 5100000, status: 'MALICIOUS', type: 'IMG', progress: 100, currentStep: 'file.status.malicious', submittedAt: '10:45 AM' }
      ];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
    localStorage.setItem(STORAGE_KEYS.THREATS, JSON.stringify(this.threats));
  }

  private startEngine() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick() {
    // 1. Simulate System Stat Fluctuations
    this.system.cpu = Math.max(5, Math.min(100, this.system.cpu + (Math.random() * 10 - 5)));
    this.system.memory.used = Math.max(4, Math.min(30, this.system.memory.used + (Math.random() * 2 - 1)));
    
    // 2. Simulate Threat Activity & Persistence
    if (Math.random() > 0.7) {
      this.threats.pps = Math.max(0, this.threats.pps + Math.floor(Math.random() * 200 - 100));
      this.threats.dropped += Math.floor(Math.random() * 5);
      
      // Increment Attack Count occasionally
      if (Math.random() > 0.8) {
         this.threats.total_attacks += 1;
      }
    }

    // 3. Process Tasks (The Core CDR Logic Simulation)
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

    if (tasksChanged) this.save();
    
    // Periodically save stats even if tasks didn't change (for attacks/uptime/etc)
    if (Math.random() > 0.9) this.save();
  }

  private processTaskStep(task: Task) {
    // Determine steps based on type
    let steps: { msg: string; progress: number }[] = [];
    
    if (task.type === 'DOC') {
      steps = [
        { msg: 'file.step.uploading', progress: 10 },
        { msg: 'file.step.doc_convert', progress: 40 }, // Doc -> PDF
        { msg: 'file.step.doc_strip', progress: 80 },   // Strip Macros
        { msg: 'file.status.clean', progress: 100 }
      ];
    } else if (task.type === 'IMG') {
      steps = [
        { msg: 'file.step.uploading', progress: 10 },
        { msg: 'file.step.img_rotate', progress: 30 }, // Rotate 90
        { msg: 'file.step.img_rotate', progress: 50 }, // Rotate 180
        { msg: 'file.step.img_rotate', progress: 70 }, // Rotate 270
        { msg: 'file.step.img_sharpen', progress: 85 }, // Sharpen & Resize
        { msg: 'file.step.img_convert', progress: 95 }, // To PNG
        { msg: 'file.status.clean', progress: 100 }
      ];
    } else if (task.type === 'AV') {
      steps = [
        { msg: 'file.step.uploading', progress: 5 },
        { msg: 'file.step.av_decode', progress: 25 },  // Decode H264
        { msg: 'file.step.av_compress', progress: 50 }, // Compress Frame
        { msg: 'file.step.av_noise', progress: 75 },    // Add Noise
        { msg: 'file.step.av_encode', progress: 95 },   // Re-encode
        { msg: 'file.status.clean', progress: 100 }
      ];
    } else {
      steps = [{ msg: 'file.status.clean', progress: 100 }];
    }

    // Find current step index
    const currentIdx = steps.findIndex(s => s.msg === task.currentStep);
    const nextIdx = currentIdx + 1;

    if (currentIdx === -1) {
      // Start
      task.currentStep = steps[0].msg;
      task.progress = steps[0].progress;
      task.status = 'SCANNING';
    } else if (nextIdx < steps.length) {
      // Advance
      // Add some randomness to processing speed
      if (Math.random() > 0.3) {
         task.currentStep = steps[nextIdx].msg;
         task.progress = steps[nextIdx].progress;
      }
    } else {
      // Done
      // Randomly classify as MALICIOUS (simulating malware detection)
      // For this demo, we'll say 10% are malicious
      const isMalicious = Math.random() < 0.1;
      
      task.status = isMalicious ? 'MALICIOUS' : 'CLEAN';
      task.currentStep = isMalicious ? 'file.status.malicious' : 'file.status.clean';
      task.completedAt = new Date().toLocaleTimeString();
      
      if (isMalicious) {
          this.threats.malware_detected += 1;
      }
    }
  }

  // API Methods
  public getSystemData() {
    return {
      system: { ...this.system },
      threats: { ...this.threats }
    };
  }

  public getTasks() {
    // Return sorted by time desc
    return [...this.tasks].sort((a, b) => {
        return new Date('1970/01/01 ' + b.submittedAt).getTime() - new Date('1970/01/01 ' + a.submittedAt).getTime();
    });
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
    return newTask;
  }

  private formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  public toggleDdos(enabled: boolean) {
    this.threats.mitigating = enabled;
    this.save();
  }
}

export const backend = new BackendService();
