import React from 'react';
import { Globe, Copy, RefreshCw, ToggleRight } from 'lucide-react';
import { useLanguage } from '../../i18n';

const ApiSettings: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
         <h2 className="text-2xl font-bold text-slate-900">{t('api.title')}</h2>
         <p className="text-slate-500">{t('api.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <Globe className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-semibold text-lg text-slate-800">{t('api.rest_title')}</h3>
                <p className="text-xs text-slate-500">Base URL: https://gateway.secguard.local/api/v1</p>
             </div>
             <div className="ml-auto">
                <ToggleRight className="w-10 h-10 text-emerald-500 cursor-pointer" />
             </div>
         </div>
         
         <div className="p-6 space-y-6">
            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">{t('api.master_key')}</label>
               <div className="flex gap-2">
                  <input type="text" readOnly value="sk_live_51M3p9jK2..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono text-sm text-slate-600" />
                  <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><Copy className="w-4 h-4" /></button>
                  <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><RefreshCw className="w-4 h-4" /></button>
               </div>
               <p className="text-xs text-slate-400">{t('api.master_key_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('api.rate_limit')}</label>
                  <input type="number" defaultValue={600} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('api.timeout')}</label>
                  <input type="number" defaultValue={3600} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
               </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">{t('config.save')}</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ApiSettings;
