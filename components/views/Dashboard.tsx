import React from 'react';
import { Role } from '../../types';
import { 
  Cpu, HardDrive, Activity, Server, Zap, Video, FileScan, CheckCircle2, AlertTriangle, XCircle 
} from 'lucide-react';

interface DashboardProps {
  role: Role;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">System Dashboard</h2>
      
      {/* Row 1: Hardware Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">CPU Usage</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">32%</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">16 Cores Active</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Memory Usage</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">12.4 GB</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Total: 32 GB</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Disk Status</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">68%</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-amber-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Healthy (RAID 5)</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">System Uptime</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">45d 12h</h3>
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
              <span className="text-xs font-medium text-green-600">All Systems Normal</span>
          </div>
        </div>
      </div>

      {/* Row 2: Service & Task Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-lg text-slate-800">Service Status</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Service Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Load</th>
                  <th className="px-6 py-3">Last Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-medium">Core Firewall Engine</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3 mr-1"/> Running</span></td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4 text-slate-500">Just now</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Video Analysis Daemon</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3 mr-1"/> Running</span></td>
                  <td className="px-6 py-4 text-amber-600 font-medium">High</td>
                  <td className="px-6 py-4 text-slate-500">1 min ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">File Scanning SandBox</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3 mr-1"/> Running</span></td>
                  <td className="px-6 py-4">Medium</td>
                  <td className="px-6 py-4 text-slate-500">Just now</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Log Aggregator</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold"><AlertTriangle className="w-3 h-3 mr-1"/> Degraded</span></td>
                  <td className="px-6 py-4">High</td>
                  <td className="px-6 py-4 text-slate-500">5 mins ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
             <Video className="w-24 h-24 absolute -right-6 -bottom-6 text-white opacity-20" />
             <h3 className="text-lg font-medium opacity-90 mb-2">Active Video Tasks</h3>
             <div className="text-4xl font-bold mb-4">12</div>
             <div className="flex flex-col space-y-2 text-sm opacity-80">
               <div className="flex justify-between">
                 <span>Ingress Streams:</span>
                 <span className="font-bold">12</span>
               </div>
               <div className="flex justify-between">
                 <span>Cleaned/Forwarded:</span>
                 <span className="font-bold">12</span>
               </div>
             </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
             <FileScan className="w-24 h-24 absolute -right-6 -bottom-6 text-white opacity-20" />
             <h3 className="text-lg font-medium opacity-90 mb-2">File Cleaning Tasks</h3>
             <div className="text-4xl font-bold mb-4">1,402</div>
             <div className="flex flex-col space-y-2 text-sm opacity-80">
               <div className="flex justify-between">
                 <span>Pending:</span>
                 <span className="font-bold">45</span>
               </div>
               <div className="flex justify-between">
                 <span>Malware Found:</span>
                 <span className="font-bold text-red-100">3</span>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-slate-800">Threat Prevention Stats (24h)</h3>
            </div>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">842</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">DDoS Attacks</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">15</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Intrusions</div>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
