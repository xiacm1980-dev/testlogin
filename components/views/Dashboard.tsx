import React, { useEffect, useState } from 'react';
import { Role } from '../../types';
import { 
  Cpu, HardDrive, Activity, Server, Zap, Video, FileScan, CheckCircle2, AlertTriangle 
} from 'lucide-react';
import { useLanguage } from '../../i18n';
import { backend, SystemStats, ThreatStats } from '../../services/backend';

interface DashboardProps {
  role: Role;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const { t } = useLanguage();
  const [data, setData] = useState<{system: SystemStats, threats: ThreatStats}>(backend.getSystemData());

  useEffect(() => {
    const timer = setInterval(() => {
        setData(backend.getSystemData());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { system, threats } = data;
  
  // Calculate uptime string
  const getUptimeString = () => {
    const diff = Date.now() - threats.uptime_start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">{t('dash.system_dashboard')}</h2>
      
      {/* Row 1: Hardware Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('dash.cpu')}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{system.cpu.toFixed(1)}%</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${system.cpu}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">16 Cores Active</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('dash.memory')}</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{system.memory.used.toFixed(1)} GB</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(system.memory.used / system.memory.total) * 100}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Total: {system.memory.total} GB</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('dash.disk')}</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{system.disk.used}%</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-amber-600 h-2 rounded-full transition-all duration-500" style={{ width: `${system.disk.used}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Healthy (RAID 5 - SQLite)</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{t('dash.uptime')}</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{getUptimeString()}</h3>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Server className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
             <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-600">{t('dash.healthy')}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Service & Task Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-lg text-slate-800">{t('dash.service_status')}</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">{t('dash.service_name')}</th>
                  <th className="px-6 py-3">{t('dash.status')}</th>
                  <th className="px-6 py-3">{t('dash.load')}</th>
                  <th className="px-6 py-3">{t('dash.last_check')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {system.services.map((svc, idx) => {
                  // Determine status styling
                  let statusColor = 'text-green-600 bg-green-50';
                  let statusIcon = <CheckCircle2 className="w-3 h-3 mr-1"/>;
                  let statusKey = 'status.running';
                  
                  if (svc.status === 'degraded') {
                    statusColor = 'text-amber-600 bg-amber-50';
                    statusIcon = <AlertTriangle className="w-3 h-3 mr-1"/>;
                    statusKey = 'status.degraded';
                  } else if (svc.status === 'stopped') {
                    statusColor = 'text-red-600 bg-red-50';
                    statusIcon = <AlertTriangle className="w-3 h-3 mr-1"/>;
                    statusKey = 'status.stopped';
                  }

                  // Determine load styling
                  let loadKey = 'load.low';
                  let loadColor = '';
                  if (svc.load === 'medium') { loadKey = 'load.medium'; }
                  else if (svc.load === 'high') { loadKey = 'load.high'; loadColor = 'text-amber-600'; }

                  return (
                    <tr key={idx}>
                    <td className="px-6 py-4 font-medium">{t(svc.name)}</td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                            {statusIcon} 
                            {t(statusKey)}
                        </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${loadColor}`}>{t(loadKey)}</td>
                    <td className="px-6 py-4 text-slate-500">{t(svc.lastCheck)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
           {/* Card 1: File CDR Tasks (Swapped Position) */}
           <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
             <FileScan className="w-24 h-24 absolute -right-6 -bottom-6 text-white opacity-20" />
             <h3 className="text-lg font-medium opacity-90 mb-2">{t('dash.task_file')}</h3>
             <div className="text-4xl font-bold mb-4">{threats.active_file_tasks}</div>
             <div className="flex flex-col space-y-2 text-sm opacity-80">
               <div className="flex justify-between">
                 <span>Pending:</span>
                 <span className="font-bold">{threats.active_file_tasks}</span>
               </div>
               <div className="flex justify-between">
                 <span>Processed:</span>
                 <span className="font-bold text-white">{(threats.malware_detected * 5 + 230).toLocaleString()}</span>
               </div>
             </div>
          </div>

          {/* Card 2: Video Stream Tasks (Swapped Position) */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
             <Video className="w-24 h-24 absolute -right-6 -bottom-6 text-white opacity-20" />
             <h3 className="text-lg font-medium opacity-90 mb-2">{t('dash.task_video')}</h3>
             <div className="text-4xl font-bold mb-4">{threats.active_video_tasks}</div>
             <div className="flex flex-col space-y-2 text-sm opacity-80">
               <div className="flex justify-between">
                 <span>Ingress Streams:</span>
                 <span className="font-bold">{threats.active_video_tasks}</span>
               </div>
               <div className="flex justify-between">
                 <span>Forwarded:</span>
                 <span className="font-bold">{threats.active_video_tasks}</span>
               </div>
             </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-slate-800">{t('dash.threat_stats')}</h3>
            </div>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{threats.malware_detected}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">{t('dash.stat_malware')}</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{threats.total_attacks.toLocaleString()}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">{t('dash.stat_attacks')}</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{threats.active_rules.toLocaleString()}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">{t('dash.stat_rules')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;