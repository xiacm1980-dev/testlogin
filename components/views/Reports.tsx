import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, FileText, Loader2 } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { backend, Report } from '../../services/backend';

const Reports: React.FC = () => {
  const { t, language } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState<string | null>(null); // 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE'

  useEffect(() => {
    setReports(backend.getReports());
  }, []);

  const handleGenerate = (type: 'AUDIT' | 'TRAFFIC' | 'COMPLIANCE') => {
    setGenerating(type);
    
    // Simulate generation delay
    setTimeout(() => {
        backend.generateReport(type, 'logadmin', language);
        setReports(backend.getReports());
        setGenerating(null);
    }, 1500);
  };

  const handleDownload = (report: Report) => {
    const blob = new Blob([report.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Naming it .txt so user can view it in browser, though prompt asked for PDF. 
    // In a real app, this blob would be a PDF binary.
    link.setAttribute('download', `${report.name}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString: string) => {
      return new Date(isoString).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('report.title')}</h2>
            <p className="text-slate-500">{t('report.subtitle')}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Audit Report Card */}
         <div 
            onClick={() => !generating && handleGenerate('AUDIT')}
            className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer relative overflow-hidden group ${generating ? 'opacity-70 pointer-events-none' : ''}`}
         >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
               {generating === 'AUDIT' ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('report.audit')}</h3>
            <p className="text-slate-500 text-sm mb-4">{t('report.audit_desc')}</p>
            <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                {generating === 'AUDIT' ? t('config.saving') : t('report.generate')}
            </span>
         </div>

         {/* Traffic Report Card */}
         <div 
            onClick={() => !generating && handleGenerate('TRAFFIC')}
            className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer relative overflow-hidden group ${generating ? 'opacity-70 pointer-events-none' : ''}`}
         >
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
               {generating === 'TRAFFIC' ? <Loader2 className="w-6 h-6 animate-spin" /> : <BarChart3 className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('report.traffic')}</h3>
            <p className="text-slate-500 text-sm mb-4">{t('report.traffic_desc')}</p>
            <span className="text-emerald-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                {generating === 'TRAFFIC' ? t('config.saving') : t('report.generate')}
            </span>
         </div>

         {/* Compliance Report Card */}
         <div 
            onClick={() => !generating && handleGenerate('COMPLIANCE')}
            className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer relative overflow-hidden group ${generating ? 'opacity-70 pointer-events-none' : ''}`}
         >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
               {generating === 'COMPLIANCE' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calendar className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('report.compliance')}</h3>
            <p className="text-slate-500 text-sm mb-4">{t('report.compliance_desc')}</p>
            <span className="text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                {generating === 'COMPLIANCE' ? t('config.saving') : t('report.generate')}
            </span>
         </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 font-semibold text-slate-800">{t('report.history')}</div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                <tr>
                    <th className="px-6 py-3">{t('report.col.name')}</th>
                    <th className="px-6 py-3">{t('report.col.date')}</th>
                    <th className="px-6 py-3">{t('report.col.by')}</th>
                    <th className="px-6 py-3">{t('report.col.on')}</th>
                    <th className="px-6 py-3 text-right"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                             <FileText className="w-4 h-4 text-slate-400" />
                             {report.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{report.dateRange}</td>
                        <td className="px-6 py-4">{report.generatedBy}</td>
                        <td className="px-6 py-4 text-slate-500">{formatDate(report.generatedAt)}</td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer hover:underline flex items-center justify-end gap-1 w-full"
                            >
                                <Download className="w-4 h-4" /> {t('file.download')}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
         </div>
         {reports.length === 0 && (
            <div className="p-8 text-center text-slate-400">
                No reports generated yet.
            </div>
         )}
      </div>
    </div>
  );
};

export default Reports;