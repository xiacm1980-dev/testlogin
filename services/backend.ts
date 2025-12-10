
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
  total_ddos: number;
  total_intrusions: number;
  uptime_start: number;
}

export interface SystemStats {
  cpu: number;
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  services: { name: string; status: 'Running' | 'Degraded' | 'Stopped'; load: 'Low' | 'Medium' | 'High'; lastCheck: string }[];
}

const STORAGE_KEYS = {
  TASKS: 'aegis_db_tasks',
  THREATS: 'aegis_db_threats',
  SYSTEM: 'aegis_db_system' // Usually live, but we persist some settings
};

// Singleton Mock Backend Class
class BackendService {
  private tasks: Task[] = [];
  private threats: ThreatStats = {
    pps: 45200,
    dropped: 1204,
    sources: 12,
    mitigating: true,
    total_ddos: 842,
    total_intrusions: 15,
    uptime_start: Date.now() - (45 * 24 * 3600 * 1000) // 45 days ago
  };
  private system: SystemStats = {
    cpu: 32,
    memory: { used: 12.4, total: 32 },
    disk: { used: 68, total: 100 },
    services: [
      { name: 'Core Firewall Engine', status: 'Running', load: 'Low', lastCheck: 'Just now' },
      { name: 'Video Analysis Daemon', status: 'Running', load: 'High', lastCheck: '1 min ago' },
      { name: 'File Scanning SandBox', status: 'Running', load: 'Medium', lastCheck: 'Just now' },
      { name: 'Log Aggregator', status: 'Degraded', load: 'High', lastCheck: '5 mins ago' }
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
    if (t) this.tasks = JSON.parse(t);
    if (th) this.threats = JSON.parse(th);
    
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
    
    // 2. Simulate Threat Activity
    if (Math.random() > 0.8) {
      this.threats.pps += Math.floor(Math.random() * 100 - 50);
      this.threats.dropped += Math.floor(Math.random() * 5);
      this.threats.total_ddos += Math.random() > 0.99 ? 1 : 0;
    }

    // 3. Process Tasks (The Core CDR Logic Simulation)
    let tasksChanged = false;
    this.tasks.forEach(task => {
      if (task.status === 'UPLOADING' || task.status === 'SCANNING') {
        tasksChanged = true;
        this.processTaskStep(task);
      }
    });

    if (tasksChanged) this.save();
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
      task.status = 'CLEAN';
      task.completedAt = new Date().toLocaleTimeString();
      this.threats.total_intrusions += 1; // Increment sanitized count
      this.threats.total_ddos += 0; // Just to trigger update
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
