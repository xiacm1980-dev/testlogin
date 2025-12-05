import React, { useState } from 'react';
import { Save, RefreshCw, Server, Globe, Clock, UserPlus } from 'lucide-react';

const SystemConfig: React.FC = () => {
  const [hostname, setHostname] = useState('sg-firewall-core-01');
  const [dns1, setDns1] = useState('8.8.8.8');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Configuration</h2>
        <p className="text-slate-500">Manage device settings, network interfaces, and system access.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800">Network Settings</h3>
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
            <label className="text-sm font-medium text-slate-700">DNS Server (Primary)</label>
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
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-800">Firmware</h3>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Up to Date</span>
          </div>
          <div className="p-6 space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-slate-600">Current Version</span>
               <span className="font-mono text-slate-900">v4.5.2-stable</span>
            </div>
             <div className="flex justify-between items-center">
               <span className="text-slate-600">Last Checked</span>
               <span className="text-slate-900">Today, 09:00 AM</span>
            </div>
            <button className="w-full mt-2 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              Check for Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;