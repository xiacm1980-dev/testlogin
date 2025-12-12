import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Server, Globe, Clock, History, Trash2, Download, Upload, Database, Archive, Play, FileInput } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { backend, NetworkConfig, LogConfig, ArchiveFile, BackupFile } from '../../services/backend';

const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'logs' | 'backup'>('network');
  const [saving, setSaving] = useState(false);
  const [network, setNetwork] = useState<NetworkConfig>(backend.getNetworkConfig());
  const [logConfig, setLogConfig] = useState<LogConfig>(backend.getLogConfig());
  const [archives, setArchives] = useState<ArchiveFile[]>([]);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { t } = useLanguage();

  useEffect(() => {
    // Initial fetch
    setNetwork(backend.getNetworkConfig());
    setLogConfig(backend.getLogConfig());
    setArchives(backend.getArchives());
    setBackups(backend.getBackups());

    // Sync clock every second to simulate NTP active time
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Poll backups/archives periodically
    const poller = setInterval(() => {
        setArchives(backend.getArchives());
        setBackups(backend.getBackups());
    }, 5000);

    return () => { clearInterval(timer); clearInterval(poller); };
  }, []);

  const handleSaveNetwork = () => {
    setSaving(true);
    backend.updateNetworkConfig(network);
    setTimeout(() => setSaving(false), 1000);
  };
  
  const handleSaveLogs = () => {
      setSaving(true);
      backend.updateLogConfig(logConfig);
      setTimeout(() => setSaving(false), 1000);
  };

  const handleCreateBackup = () => {
      setSaving(true);
      setTimeout(() => {
          backend.createBackup();
          setBackups(backend.getBackups());
          setSaving(false);
      }, 1500);
  };

  const handleRestore = (id: string) => {
      if(confirm('Are you sure you want to restore the system to this snapshot? Current data will be overwritten.')) {
          backend.restoreBackup(id);
          // Refresh local state
          setNetwork(backend.getNetworkConfig());
          setLogConfig(backend.getLogConfig());
          alert('System restored successfully.');
      }
  };

  const handleRestoreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Simulate restoration from file upload
      if (e.target.files && e.target.files.length > 0) {
          setSaving(true);
          setTimeout(() => {
             alert('Backup file uploaded and system restored successfully (Simulated).');
             setSaving(false);
          }, 2000);
      }
  };

  const renderNetwork = () => (
    <div className="space-y-6">
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-slate-800">{t('config.network.interfaces')}</h3>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('config.hostname')}</label>
            <input 
              type="text" 
              value={network.hostname}
              onChange={(e) => setNetwork({...network, hostname: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('config.mgmt_ip')}</label>
            <input 
              type="text" 
              value={network.ipAddress}
              onChange={(e) => setNetwork({...network, ipAddress: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Netmask</label>
            <input 
              type="text" 
              value={network.netmask}
              onChange={(e) => setNetwork({...network, netmask: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">{t('config.gateway')}</label>
            <input 
              type="text" 
              value={network.gateway}
              onChange={(e) => setNetwork({...network, gateway: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t('config.dns')}</label>
            <input 
              type="text" 
              value={network.dns1}
              onChange={(e) => setNetwork({...network, dns1: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
              <span className="text-slate-600">System Time</span>
              <span className="font-mono text-xl text-slate-900 font-bold tracking-wide">{currentTime.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
             <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-slate-700">NTP Server Address</label>
                <input 
                    type="text" 
                    value={network.ntpServer}
                    onChange={(e) => setNetwork({...network, ntpServer: e.target.value})}
                    placeholder="e.g. pool.ntp.org"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
             </div>
             <button 
                onClick={() => {
                   // Simulate NTP Sync
                   alert(`Synchronized time with ${network.ntpServer}`);
                   setCurrentTime(new Date()); 
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium h-10 mb-[1px]"
             >
                 Sync Now
             </button>
          </div>
        </div>
      </div>
      
       <div className="flex justify-end">
          <button 
            onClick={handleSaveNetwork}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 shadow-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t('config.saving') : t('config.save')}
          </button>
       </div>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
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
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="flex items-center justify-between mb-4">
                     <span className="text-base font-medium text-slate-800">{t('config.logs.retention')}</span>
                     <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg">{logConfig.retentionDays} Days</span>
                  </label>
                  <input 
                    type="range" 
                    min="30" 
                    max="365" 
                    value={logConfig.retentionDays}
                    onChange={(e) => setLogConfig({...logConfig, retentionDays: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-sm text-slate-500 mt-2">{t('config.logs.desc', {days: logConfig.retentionDays})}</p>
               </div>
               
               <div>
                  <label className="flex items-center justify-between mb-4">
                     <span className="text-base font-medium text-slate-800">{t('config.logs.disk_threshold')}</span>
                     <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-lg">{logConfig.diskCleanupThreshold}% Free</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    value={logConfig.diskCleanupThreshold}
                    onChange={(e) => setLogConfig({...logConfig, diskCleanupThreshold: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <p className="text-sm text-slate-500 mt-2">{t('config.logs.disk_desc', {percent: logConfig.diskCleanupThreshold})}</p>
               </div>
           </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            onClick={handleSaveLogs}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 shadow-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? t('config.saving') : t('config.save')}
          </button>
        </div>
      </div>
    </div>
    
    {/* Archive List */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
           <Archive className="w-5 h-5 text-slate-500" />
           <h4 className="font-semibold text-slate-700 text-sm">{t('config.logs.archive_list')}</h4>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="text-slate-500 bg-white border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-3 font-medium">Filename</th>
                        <th className="px-6 py-3 font-medium">Month</th>
                        <th className="px-6 py-3 font-medium">Size</th>
                        <th className="px-6 py-3 font-medium">Created</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {archives.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-slate-400">No archives generated yet.</td></tr>
                    ) : (
                        archives.map(arc => (
                            <tr key={arc.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-slate-600">{arc.filename}</td>
                                <td className="px-6 py-4">{arc.month}</td>
                                <td className="px-6 py-4">{arc.size}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(arc.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1 w-full">
                                        <Download className="w-4 h-4"/> Download
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
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
              <button 
                onClick={handleCreateBackup}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors disabled:opacity-70"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4" />}
                {saving ? 'Creating Snapshot...' : t('config.backup.create_btn')}
              </button>
           </div>
           
           <div className="space-y-4">
              <h4 className="font-medium text-slate-800 border-b border-slate-100 pb-2">{t('config.backup.restore')}</h4>
              <p className="text-sm text-slate-500">{t('config.backup.restore_desc')}</p>
              <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer block">
                 <input type="file" className="hidden" onChange={handleRestoreUpload} />
                 {saving ? <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2"/> : <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />}
                 <span className="text-sm text-slate-500">{saving ? 'Restoring System...' : t('config.backup.upload')}</span>
              </label>
           </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h4 className="font-semibold text-slate-700 text-sm">{t('config.backup.recent')}</h4>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
             <thead className="text-slate-500 bg-white border-b border-slate-100">
                <tr>
                   <th className="px-6 py-3 font-medium">Filename</th>
                   <th className="px-6 py-3 font-medium">Date</th>
                   <th className="px-6 py-3 font-medium">Size</th>
                   <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {backups.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-slate-400">No backups created.</td></tr>
               ) : (
                  backups.map((bkp) => (
                    <tr key={bkp.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="font-medium text-slate-700 font-mono">{bkp.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{new Date(bkp.createdAt).toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-500">{bkp.size}</td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                             <a href={`data:text/json;charset=utf-8,${encodeURIComponent(bkp.data)}`} download={bkp.name} className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1">
                                <Download className="w-3 h-3" /> Download
                             </a>
                             <button onClick={() => handleRestore(bkp.id)} className="text-amber-600 hover:text-amber-800 font-medium text-xs flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Restore
                             </button>
                        </td>
                    </tr>
                  ))
               )}
             </tbody>
        </table>
        </div>
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