import React, { useState } from 'react';
import { Save, RefreshCw, Server, Globe, Clock, History, Trash2, Download, Upload } from 'lucide-react';

const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'logs' | 'backup'>('network');
  const [saving, setSaving] = useState(false);
  
  // Network State
  const [hostname, setHostname] = useState('sg-firewall-core-01');
  const [dns1, setDns1] = useState('8.8.8.8');
  
  // Log Policy State
  const [logRetention, setLogRetention] = useState(90);
  const [autoArchive, setAutoArchive] = useState(true);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const renderNetwork = () => (
    <div className="space-y-6">
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">Network Interfaces</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Hostname</label>
            <input 
              type="text" 
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Management IP</label>
            <input 
              type="text" 
              disabled
              value="192.168.1.1"
              className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">DNS Server</label>
            <input 
              type="text" 
              value={dns1}
              onChange={(e) => setDns1(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Gateway</label>
            <input 
              type="text" 
              defaultValue="192.168.1.254"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">Time & NTP</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Current Time</span>
              <span className="font-mono text-slate-900">{new Date().toISOString()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">NTP Server</span>
              <span className="font-medium text-slate-900">pool.ntp.org</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
          <Trash2 className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg text-slate-800">Log Cleaning & Retention Policy</h3>
      </div>
      <div className="p-6 space-y-8">
        <div>
          <label className="flex items-center justify-between mb-4">
             <span className="text-base font-medium text-slate-800">Retention Period (Days)</span>
             <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg">{logRetention} Days</span>
          </label>
          <input 
            type="range" 
            min="30" 
            max="365" 
            value={logRetention}
            onChange={(e) => setLogRetention(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-sm text-slate-500 mt-2">Logs older than {logRetention} days will be automatically deleted or archived.</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
           <div>
             <h4 className="font-semibold text-slate-800">Auto-Archive before delete</h4>
             <p className="text-sm text-slate-500">Compress and move old logs to cold storage before deletion.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={autoArchive} onChange={() => setAutoArchive(!autoArchive)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>

        <div className="pt-4 border-t border-slate-100">
           <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2">
             <Trash2 className="w-4 h-4" />
             Manually Clean Logs Now
           </button>
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">System Backup & Restore</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b border-slate-100 pb-2">Create Backup</h4>
              <p className="text-sm text-slate-500">Download a full snapshot of the system configuration, policies, and keys.</p>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download System Snapshot
              </button>
           </div>
           
           <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b border-slate-100 pb-2">Restore System</h4>
              <p className="text-sm text-slate-500">Upload a previously saved snapshot to restore system state. System will reboot.</p>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                 <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                 <span className="text-sm text-slate-500">Click to upload backup file</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h4 className="font-semibold text-slate-700 text-sm">Recent Backups</h4>
        </div>
        <ul className="divide-y divide-slate-100">
           {[1, 2, 3].map((i) => (
             <li key={i} className="px-6 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="font-medium text-slate-700">backup_auto_daily_{i}.enc</span>
                </div>
                <span className="text-slate-500">2023-10-2{7-i} 03:00 AM</span>
             </li>
           ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">System Configuration</h2>
           <p className="text-slate-500">Manage device settings, maintenance, and data policies.</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 shadow-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
      </div>

      <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('network')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'network' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Globe className="w-4 h-4" /> Network
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'logs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Trash2 className="w-4 h-4" /> Log Policy
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'backup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <History className="w-4 h-4" /> Backup & Restore
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'network' && renderNetwork()}
        {activeTab === 'logs' && renderLogs()}
        {activeTab === 'backup' && renderBackup()}
      </div>
    </div>
  );
};

export default SystemConfig;
