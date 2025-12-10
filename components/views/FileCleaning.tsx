import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, XCircle, Clock, Search, FileType, Image, Film } from 'lucide-react';
import { useLanguage } from '../../i18n';

const FileCleaning: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 'T-10293', name: 'financial_report_q3.docx', size: '2.4 MB', status: 'CLEAN', time: '10:42 AM' },
    { id: 'T-10294', name: 'site_photo.jpg', size: '5.1 MB', status: 'MALICIOUS', time: '10:45 AM' },
    { id: 'T-10295', name: 'surveillance_dump.avi', size: '142 MB', status: 'SCANNING', time: '10:48 AM' },
  ]);
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'CLEAN': return <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded text-xs font-bold"><CheckCircle className="w-3 h-3"/> {t('file.status.clean')}</span>;
      case 'MALICIOUS': return <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded text-xs font-bold"><XCircle className="w-3 h-3"/> {t('file.status.malicious')}</span>;
      case 'SCANNING': return <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded text-xs font-bold"><Clock className="w-3 h-3 animate-spin"/> {t('file.status.scanning')}</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
         <h2 className="text-2xl font-bold text-slate-900">{t('file.title')}</h2>
         <p className="text-slate-500">{t('file.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileType className="w-5 h-5" /></div>
               <h4 className="font-semibold text-slate-800">{t('file.rule.doc')}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{t('file.rule.doc_desc')}</p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Image className="w-5 h-5" /></div>
               <h4 className="font-semibold text-slate-800">{t('file.rule.img')}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{t('file.rule.img_desc')}</p>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><Film className="w-5 h-5" /></div>
               <h4 className="font-semibold text-slate-800">{t('file.rule.av')}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{t('file.rule.av_desc')}</p>
         </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center border-dashed border-2 hover:border-blue-400 transition-colors cursor-pointer group">
         <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-blue-500" />
         </div>
         <h3 className="text-lg font-semibold text-slate-800">{t('file.drop')}</h3>
         <p className="text-slate-500 text-sm mt-1">{t('file.browse')}</p>
         <p className="text-xs text-slate-400 mt-4">{t('file.formats')}</p>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{t('file.recent')}</h3>
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder={t('file.search')} className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </div>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="px-6 py-3 font-medium">{t('file.col.task')}</th>
                  <th className="px-6 py-3 font-medium">{t('file.col.filename')}</th>
                  <th className="px-6 py-3 font-medium">{t('file.col.size')}</th>
                  <th className="px-6 py-3 font-medium">{t('file.col.status')}</th>
                  <th className="px-6 py-3 font-medium">{t('file.col.submitted')}</th>
                  <th className="px-6 py-3 font-medium text-right"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                     <td className="px-6 py-4 font-mono text-slate-500">{task.id}</td>
                     <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        <File className="w-4 h-4 text-slate-400" />
                        {task.name}
                     </td>
                     <td className="px-6 py-4 text-slate-500">{task.size}</td>
                     <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                     <td className="px-6 py-4 text-slate-500">{task.time}</td>
                     <td className="px-6 py-4 text-right">
                        {task.status === 'CLEAN' && (
                           <button className="text-blue-600 hover:underline font-medium">{t('file.download')}</button>
                        )}
                        {task.status === 'MALICIOUS' && (
                           <button className="text-slate-400 hover:text-slate-600">{t('file.view_report')}</button>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default FileCleaning;