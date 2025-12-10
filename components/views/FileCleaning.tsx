import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle, XCircle, Clock, Search, FileType, Image, Film, Loader2, Download } from 'lucide-react';
import { useLanguage } from '../../i18n';

interface FileTask {
  id: string;
  name: string;
  size: string;
  status: 'CLEAN' | 'MALICIOUS' | 'SCANNING' | 'UPLOADING';
  time: string;
  progressStep?: string; // To show current CDR step
  type: 'DOC' | 'IMG' | 'AV' | 'OTHER';
}

const FileCleaning: React.FC = () => {
  const [tasks, setTasks] = useState<FileTask[]>([
    { id: 'T-10293', name: 'financial_report_q3.docx', size: '2.4 MB', status: 'CLEAN', time: '10:42 AM', type: 'DOC' },
    { id: 'T-10294', name: 'site_photo.jpg', size: '5.1 MB', status: 'MALICIOUS', time: '10:45 AM', type: 'IMG' },
    { id: 'T-10295', name: 'surveillance_dump.avi', size: '142 MB', status: 'SCANNING', time: '10:48 AM', type: 'AV', progressStep: 'file.step.av_noise' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const getFileType = (filename: string): 'DOC' | 'IMG' | 'AV' | 'OTHER' => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'wps'].includes(ext || '')) return 'DOC';
    if (['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(ext || '')) return 'IMG';
    if (['mp4', 'avi', 'mov', 'wav', 'mp3', 'flv', 'wma'].includes(ext || '')) return 'AV';
    return 'OTHER';
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFiles = (files: File[]) => {
    const newTasks: FileTask[] = files.map(file => ({
      id: `T-${Math.floor(Math.random() * 10000)}`,
      name: file.name,
      size: formatSize(file.size),
      status: 'UPLOADING',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: getFileType(file.name),
      progressStep: 'file.step.uploading'
    }));

    setTasks(prev => [...newTasks, ...prev]);

    // Simulate Processing for each file
    newTasks.forEach(task => processTask(task.id, task.type));
  };

  const processTask = (taskId: string, type: 'DOC' | 'IMG' | 'AV' | 'OTHER') => {
    // Helper to update task status
    const update = (status: FileTask['status'], step?: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, progressStep: step } : t));
    };

    // Simulate CDR Steps
    setTimeout(() => {
        update('SCANNING', 'file.step.uploading');
        
        // Define steps based on type
        const steps = [];
        if (type === 'DOC') {
            steps.push({ msg: 'file.step.doc_convert', delay: 1500 });
            steps.push({ msg: 'file.step.doc_strip', delay: 3000 });
        } else if (type === 'IMG') {
            steps.push({ msg: 'file.step.img_rotate', delay: 1000 });
            steps.push({ msg: 'file.step.img_sharpen', delay: 2000 });
            steps.push({ msg: 'file.step.img_convert', delay: 3000 });
        } else if (type === 'AV') {
            steps.push({ msg: 'file.step.av_decode', delay: 1500 });
            steps.push({ msg: 'file.step.av_noise', delay: 3500 });
            steps.push({ msg: 'file.step.av_compress', delay: 5500 });
            steps.push({ msg: 'file.step.av_encode', delay: 7500 });
        } else {
            steps.push({ msg: 'file.status.scanning', delay: 1000 });
        }

        // Execute steps
        steps.forEach((step, index) => {
            setTimeout(() => {
                update('SCANNING', step.msg);
                // Last step completes the task
                if (index === steps.length - 1) {
                    setTimeout(() => {
                        update('CLEAN', undefined);
                    }, 1000);
                }
            }, step.delay);
        });

    }, 1000);
  };

  const handleDownload = (fileName: string) => {
      // Simulate download
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Simulated Cleaned Content');
      link.download = `cleaned_${fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getStatusBadge = (task: FileTask) => {
    switch(task.status) {
      case 'CLEAN': return <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded text-xs font-bold"><CheckCircle className="w-3 h-3"/> {t('file.status.clean')}</span>;
      case 'MALICIOUS': return <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded text-xs font-bold"><XCircle className="w-3 h-3"/> {t('file.status.malicious')}</span>;
      case 'SCANNING': 
      case 'UPLOADING':
        return (
            <div className="flex flex-col">
                <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded text-xs font-bold mb-1 w-fit">
                    <Loader2 className="w-3 h-3 animate-spin"/> 
                    {task.status === 'UPLOADING' ? t('file.step.uploading') : t('file.status.scanning')}
                </span>
                {task.progressStep && <span className="text-[10px] text-slate-400 animate-pulse">{t(task.progressStep)}</span>}
            </div>
        );
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
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center border-dashed border-2 hover:border-blue-400 transition-colors cursor-pointer group"
      >
         <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            multiple 
         />
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
                        {task.type === 'IMG' ? <Image className="w-4 h-4 text-purple-400" /> : 
                         task.type === 'AV' ? <Film className="w-4 h-4 text-rose-400" /> :
                         <File className="w-4 h-4 text-blue-400" />}
                        {task.name}
                     </td>
                     <td className="px-6 py-4 text-slate-500">{task.size}</td>
                     <td className="px-6 py-4">{getStatusBadge(task)}</td>
                     <td className="px-6 py-4 text-slate-500">{task.time}</td>
                     <td className="px-6 py-4 text-right">
                        {task.status === 'CLEAN' && (
                           <button 
                             onClick={() => handleDownload(task.name)}
                             className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                           >
                             <Download className="w-4 h-4" />
                             {t('file.download')}
                           </button>
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