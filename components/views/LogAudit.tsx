import React, { useState } from 'react';
import { Search, Download, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import { MOCK_LOGS } from '../../constants';
import { LogEntry } from '../../types';

const LogAudit: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'ERROR': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-100';
      case 'ERROR': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'WARN': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  const filteredLogs = MOCK_LOGS.filter((log) => {
    const matchesFilter = filter === 'ALL' || log.severity === filter;
    const matchesSearch = 
      log.message.toLowerCase().includes(search.toLowerCase()) || 
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      (log.sourceIp && log.sourceIp.includes(search));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">System Logs & Audit</h2>
           <p className="text-slate-500">Monitor system events, security alerts, and user activity.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition-all">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by message, module, IP..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="md:col-span-7 flex gap-2 overflow-x-auto pb-2 md:pb-0">
             {['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map((sev) => (
               <button
                 key={sev}
                 onClick={() => setFilter(sev)}
                 className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                   filter === sev 
                   ? 'bg-slate-800 text-white' 
                   : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                 }`}
               >
                 {sev}
               </button>
             ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Time</th>
                <th className="px-6 py-3 font-semibold">Severity</th>
                <th className="px-6 py-3 font-semibold">Module</th>
                <th className="px-6 py-3 font-semibold">Message</th>
                <th className="px-6 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityClass(log.severity)}`}>
                      {getSeverityIcon(log.severity)}
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{log.module}</td>
                  <td className="px-6 py-4 text-slate-800">{log.message}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {log.sourceIp || log.user || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400">No logs found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogAudit;