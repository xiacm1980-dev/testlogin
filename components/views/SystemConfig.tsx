import React, { useState } from 'react';
import { Save, RefreshCw, Server, Globe, Clock, History, Trash2, Download, Upload, Database } from 'lucide-react';
import { useLanguage } from '../../i18n';

const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'logs' | 'backup'>('network');
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();
  
  // Network State
  const [hostname, setHostname] = useState('aegis-core-01');
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
          <h3 className="font-semibold text-lg text-slate-800">{t('config.network.interfaces')}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('config.hostname')}</label>
            <input 
              type="text" 
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('config.mgmt_ip')}</label>
            <input 
              type="text" 
              disabled
              value="192.168.1.1"
              className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('config.dns')}</label>
            <input 
              type="text" 
              value={dns1}
              onChange={(e) => setDns1(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">{t('config.gateway')}</label>
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
          <h3 className="font-semibold text-lg text-slate-800">{t('config.time')}</h3>
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
          <Database className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg text-slate-800">{t('config.logs.title')}</h3>
      </div>
      <div className="p-6 space-y-8">
        <div>
           <div className="flex items-center gap-2 mb-4 bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800 text-sm">
             <Database className="w-4 h-4"/>
             <span>Storage Engine: <strong>SQLite 3.42.0</strong> (Persistent Storage)</span>
           </div>
          <label className="flex items-center justify-between mb-4">
             <span className="text-base font-medium text-slate-800">{t('config.logs.retention')}</span>
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
          <p className="text-sm text-slate-500 mt-2">{t('config.logs.desc', {days: logRetention})}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
           <div>
             <h4 className="font-semibold text-slate-800">{t('config.logs.archive')}</h4>
             <p className="text-sm text-slate-500">{t('config.logs.archive_desc')}</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={autoArchive} onChange={() => setAutoArchive(!autoArchive)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>

        <div className="pt-4 border-t border-slate-100">
           <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2">
             <Trash2 className="w-4 h-4" />
             {t('config.logs.manual')}
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
          <h3 className="font-semibold text-lg text-slate-800">{t('config.backup.title')}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b border-slate-100 pb-2">{t('config.backup.create')}</h4>
              <p className="text-sm text-slate-500">{t('config.backup.create_desc')}</p>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                {t('config.backup.download')}
              </button>
           </div>
           
           <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b border-slate-100 pb-2">{t('config.backup.restore')}</h4>
              <p className="text-sm text-slate-500">{t('config.backup.restore_desc')}</p>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                 <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                 <span className="text-sm text-slate-500">{t('config.backup.upload')}</span>
              </div>
           </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h4 className="font-semibold text-slate-700 text-sm">{t('config.backup.recent')}</h4>
        </div>
        <ul className="divide-y divide-slate-100">
           {[1, 2, 3].map((i) => (
             <li key={i} className="px-6 py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="font-medium text-slate-700">backup_auto_daily_{i}.sqlite</span>
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
           <h2 className="text-2xl font-bold text-slate-900">{t('config.title')}</h2>
           <p className="text-slate-500">{t('config.subtitle')}</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 shadow-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t('config.saving') : t('config.save')}
          </button>
      </div>

      <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('network')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'network' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Globe className="w-4 h-4" /> {t('config.tab.network')}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'logs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <Database className="w-4 h-4" /> {t('config.tab.logs')}
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'backup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
          }`}
        >
          <History className="w-4 h-4" /> {t('config.tab.backup')}
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