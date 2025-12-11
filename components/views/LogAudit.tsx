import React, { useState, useEffect } from 'react';
import { Search, Download, AlertTriangle, Info, XCircle, AlertOctagon, Filter, X } from 'lucide-react';
import { backend, LogEntry } from '../../services/backend';
import { useLanguage } from '../../i18n';

interface LogAuditProps {
  type: 'SYSTEM' | 'ADMIN';
}

const LogAudit: React.FC<LogAuditProps> = ({ type }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showExport, setShowExport] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
     setLogs(backend.getLogs());
     const interval = setInterval(() => {
         setLogs(backend.getLogs());
     }, 2000);
     return () => clearInterval(interval);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'FATAL': return <XCircle className="w-4 h-4 text-red-900" />;
      case 'ERROR': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'INFO': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'FATAL': return 'bg-red-100 text-red-900 border-red-200';
      case 'ERROR': return 'bg-red-50 text-red-700 border-red-100';
      case 'WARN': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'INFO': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  // Filter based on View Type (System vs Admin) and then by user inputs
  const filteredLogs = logs.filter((log) => {
    // 1. Filter by View Type
    const adminModules = ['AUTH', 'CONFIG', 'POLICY', 'SYSTEM'];
    const systemModules = ['FILE', 'VIDEO', 'API', 'THREAT'];
    
    // Admin Logs: Show only admin-related modules
    if (type === 'ADMIN' && !adminModules.includes(log.module)) return false;
    // System Logs: Show all modules OR specific ones depending on requirement. 
    // Usually System Audit shows everything or specific operational logs. 
    // Let's assume System Audit shows non-admin operational logs for clarity, or everything.
    // Based on user request: "System Logs" vs "Admin Logs".
    // SecAdmin sees "Log Audit" (System), LogAdmin sees both.
    // Let's make System Logs show everything EXCEPT purely admin auth/config if needed, 
    // but usually "Audit" implies everything. However, to distinguish, let's filter:
    if (type === 'SYSTEM' && !systemModules.includes(log.module) && !adminModules.includes(log.module)) return true; // Show all for system? Or just system modules?
    // Let's strictly follow the user prompt structure:
    // Admin Logs: Login, Config, Policy, Service Actions.
    // System Logs: File, Video, API, Threat.
    if (type === 'SYSTEM' && !systemModules.includes(log.module)) return false;


    // 2. Filter by Severity
    const matchesFilter = filter === 'ALL' || log.severity === filter;

    // 3. Filter by Search
    const message = t(log.messageKey, log.params);
    const matchesSearch = 
      message.toLowerCase().includes(search.toLowerCase()) || 
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      (log.sourceIp && log.sourceIp.includes(search)) ||
      (log.user && log.user.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleExport = (period: string) => {
      // 1. Get data
      const now = new Date();
      let cutoff = new Date(0); // Default all time
      
      if (period === '1h') cutoff = new Date(now.getTime() - 60 * 60 * 1000);
      else if (period === '24h') cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      else if (period === '7d') cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const exportData = filteredLogs.filter(l => new Date(l.timestamp) >= cutoff);

      // 2. CSV Generation
      const headers = ['Timestamp', 'Severity', 'Module', 'Message', 'Source/User'];
      const rows = exportData.map(l => [
          l.timestamp,
          l.severity,
          l.module,
          `"${t(l.messageKey, l.params).replace(/"/g, '""')}"`, // Escape quotes
          l.sourceIp || l.user || ''
      ]);
      
      const csvContent = [
          headers.join(','),
          ...rows.map(r => r.join(','))
      ].join('\n');

      // 3. Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `aegis_${type.toLowerCase()}_logs_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowExport(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">{type === 'ADMIN' ? t('log.title.admin') : t('log.title.system')}</h2>
           <p className="text-slate-500">{type === 'ADMIN' ? t('log.subtitle.admin') : t('log.subtitle.system')}</p>
        </div>
        <button 
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Download className="w-4 h-4" />
          {t('log.export')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('log.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="md:col-span-7 flex gap-2 overflow-x-auto pb-2 md:pb-0">
             {['ALL', 'INFO', 'WARN', 'ERROR', 'FATAL'].map((sev) => (
               <button
                 key={sev}
                 onClick={() => setFilter(sev)}
                 className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                   filter === sev 
                   ? 'bg-slate-800 text-white' 
                   : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                 }`}
               >
                 {t(`log.level.${sev.toLowerCase()}`)}
               </button>
             ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold w-40">{t('log.col.time')}</th>
                <th className="px-6 py-3 font-semibold w-24">{t('log.col.severity')}</th>
                <th className="px-6 py-3 font-semibold w-24">{t('log.col.module')}</th>
                <th className="px-6 py-3 font-semibold">{t('log.col.message')}</th>
                <th className="px-6 py-3 font-semibold w-40">{t('log.col.source')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityClass(log.severity)}`}>
                      {getSeverityIcon(log.severity)}
                      {t(`log.level.${log.severity.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{log.module}</td>
                  <td className="px-6 py-4 text-slate-800">
                      {t(log.messageKey, log.params)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {log.user ? (
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> {log.user}</span>
                    ) : (
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-300 rounded-full"></span> {log.sourceIp}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400">{t('log.empty')}</div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-in zoom-in duration-200">
                  <button onClick={() => setShowExport(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{t('log.export_modal')}</h3>
                  <div className="space-y-2">
                      <button onClick={() => handleExport('1h')} className="w-full p-3 text-left hover:bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">{t('log.range.1h')}</button>
                      <button onClick={() => handleExport('24h')} className="w-full p-3 text-left hover:bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">{t('log.range.24h')}</button>
                      <button onClick={() => handleExport('7d')} className="w-full p-3 text-left hover:bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">{t('log.range.7d')}</button>
                      <button onClick={() => handleExport('all')} className="w-full p-3 text-left hover:bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-700">{t('log.range.all')}</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LogAudit;
