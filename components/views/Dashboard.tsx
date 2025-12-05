import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Role } from '../../types';
import { Activity, ShieldAlert, Wifi, HardDrive } from 'lucide-react';

interface DashboardProps {
  role: Role;
}

const TRAFFIC_DATA = [
  { name: '00:00', mbps: 40 },
  { name: '04:00', mbps: 30 },
  { name: '08:00', mbps: 200 },
  { name: '12:00', mbps: 278 },
  { name: '16:00', mbps: 189 },
  { name: '20:00', mbps: 239 },
  { name: '23:59', mbps: 80 },
];

const THREAT_DATA = [
  { name: 'Malware', value: 400 },
  { name: 'Phishing', value: 300 },
  { name: 'DDoS', value: 300 },
  { name: 'Botnet', value: 200 },
];

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">System Status</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">Healthy</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Uptime: <span className="font-medium text-slate-900">45d 12h 30m</span>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Threats</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">12</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Blocked today: <span className="font-medium text-slate-900">1,240</span>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Network Load</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">450 Mbps</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Peak: <span className="font-medium text-slate-900">1.2 Gbps</span>
          </div>
        </div>

        {/* Widget 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Disk Usage</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">72%</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Storage: <span className="font-medium text-slate-900">1.8TB / 2.5TB</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Traffic - Most relevant for SysAdmin and LogAdmin */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Traffic Throughput (24h)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="colorMbps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
                <Area type="monotone" dataKey="mbps" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMbps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Threat Mix - Most relevant for SecAdmin */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Threat Distribution</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={THREAT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {THREAT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            {THREAT_DATA.map((item, idx) => (
               <div key={item.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                 <span className="text-slate-600">{item.name}</span>
               </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Role specific quick action or message */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
        <h4 className="font-semibold text-indigo-900 mb-2">
           Welcome back, {role === Role.SYSADMIN ? 'System Administrator' : role === Role.SECADMIN ? 'Security Administrator' : 'Log Administrator'}
        </h4>
        <p className="text-indigo-700 text-sm">
          {role === Role.SYSADMIN && "System patches are available. Please schedule a maintenance window."}
          {role === Role.SECADMIN && "New high-risk vulnerability signatures were automatically applied at 03:00 AM."}
          {role === Role.LOGADMIN && "Log storage capacity is at 72%. Retention policy will auto-archive logs older than 90 days."}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;