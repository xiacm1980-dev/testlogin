import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, AlertOctagon, Activity } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { backend } from '../../services/backend';

const ThreatProtection: React.FC = () => {
  const [data, setData] = useState(backend.getSystemData().threats);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
       setData(backend.getSystemData().threats);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDdos = () => {
     backend.toggleDdos(!data.mitigating);
     // Update local state immediately for better UI response
     setData(prev => ({ ...prev, mitigating: !prev.mitigating }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('threat.title')}</h2>
          <p className="text-slate-500">{t('threat.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
           <span className={`text-sm font-medium ${data.mitigating ? 'text-emerald-600' : 'text-slate-500'}`}>
             Engine: {data.mitigating ? t('threat.active') : t('threat.disabled')}
           </span>
           <button 
             onClick={toggleDdos}
             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.mitigating ? 'bg-emerald-500' : 'bg-slate-300'}`}
           >
             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.mitigating ? 'translate-x-6' : 'translate-x-1'}`} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Attack Monitor */}
         <div className="lg:col-span-3 bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldAlert className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                 <Activity className="w-5 h-5 text-red-400 animate-pulse" />
                 {t('threat.monitor')}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('threat.pps')}</div>
                    <div className="text-2xl font-mono font-bold text-blue-400">{data.pps.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('threat.dropped')}</div>
                    <div className="text-2xl font-mono font-bold text-red-400">{data.dropped.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('threat.sources')}</div>
                    <div className="text-2xl font-mono font-bold text-amber-400">{data.sources}</div>
                  </div>
                   <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('dash.status')}</div>
                    <div className={`text-2xl font-bold ${data.mitigating ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {data.mitigating ? t('threat.mitigating') : 'Idle'}
                    </div>
                  </div>
               </div>
            </div>
         </div>

         {/* SYN Flood Config */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Zap className="w-5 h-5" />
               </div>
               <h3 className="font-semibold text-slate-800">{t('threat.syn_title')}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">{t('threat.syn_desc')}</p>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-700">{t('threat.threshold')}</span>
                     <span className="text-blue-600 font-mono">1000</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100"
                    defaultValue={1000}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-sm text-slate-600">{t('threat.action')}</span>
                  <select className="text-sm bg-white border border-slate-300 rounded px-2 py-1">
                     <option>Drop Packet</option>
                     <option>Blacklist Source IP</option>
                  </select>
               </div>
            </div>
         </div>

         {/* UDP Flood Config */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <AlertOctagon className="w-5 h-5" />
               </div>
               <h3 className="font-semibold text-slate-800">{t('threat.udp_title')}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">{t('threat.udp_desc')}</p>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-700">{t('threat.threshold')}</span>
                     <span className="text-blue-600 font-mono">2000</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100"
                    defaultValue={2000}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-sm text-slate-600">{t('threat.action')}</span>
                  <select className="text-sm bg-white border border-slate-300 rounded px-2 py-1">
                     <option>Drop Packet</option>
                     <option>Rate Limit</option>
                  </select>
               </div>
            </div>
         </div>

         {/* Whitelist */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4">{t('threat.whitelist')}</h3>
            <div className="space-y-2 mb-4">
               <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-100 text-sm">
                  <span className="font-mono text-green-800">192.168.1.0/24</span>
                  <button className="text-green-600 hover:text-green-800">&times;</button>
               </div>
               <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-100 text-sm">
                  <span className="font-mono text-green-800">10.0.0.5</span>
                  <button className="text-green-600 hover:text-green-800">&times;</button>
               </div>
            </div>
            <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 text-sm">
               {t('threat.add_ip')}
            </button>
         </div>
      </div>
    </div>
  );
};

export default ThreatProtection;