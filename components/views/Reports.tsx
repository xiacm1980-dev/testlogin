import React from 'react';
import { BarChart3, Download, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../../i18n';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('report.title')}</h2>
            <p className="text-slate-500">{t('report.subtitle')}</p>
         </div>
         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
            <Download className="w-4 h-4" /> {t('report.export')}
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
               <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('report.audit')}</h3>
            <p className="text-slate-500 text-sm mb-4">{t('report.audit_desc')}</p>
            <span className="text-blue-600 text-sm font-medium">{t('report.generate')}</span>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
               <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('report.traffic')}</h3>
            <p className="text-slate-500 text-sm mb-4">{t('report.traffic_desc')}</p>
            <span className="text-emerald-600 text-sm font-medium">{t('report.generate')}</span>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
               <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('report.compliance')}</h3>
            <p className="text-slate-500 text-sm mb-4">{t('report.compliance_desc')}</p>
            <span className="text-purple-600 text-sm font-medium">{t('report.generate')}</span>
         </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 font-semibold text-slate-800">{t('report.history')}</div>
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
               <tr>
                  <td className="px-6 py-4 font-medium">Security_Audit_Oct_2023.pdf</td>
                  <td className="px-6 py-4 text-slate-500">Oct 1 - Oct 31</td>
                  <td className="px-6 py-4">System</td>
                  <td className="px-6 py-4 text-slate-500">Nov 1, 2023</td>
                  <td className="px-6 py-4 text-right text-blue-600 cursor-pointer hover:underline">{t('file.download')}</td>
               </tr>
               <tr>
                  <td className="px-6 py-4 font-medium">Traffic_Analysis_Q3.csv</td>
                  <td className="px-6 py-4 text-slate-500">Jul 1 - Sep 30</td>
                  <td className="px-6 py-4">logadmin</td>
                  <td className="px-6 py-4 text-slate-500">Oct 5, 2023</td>
                  <td className="px-6 py-4 text-right text-blue-600 cursor-pointer hover:underline">{t('file.download')}</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Reports;
