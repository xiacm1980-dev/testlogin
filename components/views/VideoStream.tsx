import React, { useState } from 'react';
import { Video, ArrowRight, Settings, Shield, Globe, Play } from 'lucide-react';
import { useLanguage } from '../../i18n';

const VideoStream: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'access' | 'forward' | 'strategy'>('access');
  const { t } = useLanguage();

  const renderAccessConfig = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
       <div className="flex items-start justify-between">
         <div>
            <h3 className="text-lg font-semibold text-slate-800">{t('video.ingress')}</h3>
            <p className="text-slate-500 text-sm">{t('video.ingress_desc')}</p>
         </div>
         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Globe className="w-5 h-5"/></div>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">{t('video.protocol')}</label>
             <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-white">
                <option>ONVIF (Open Network Video Interface Forum)</option>
                <option>GB/T 28181-2016 (National Standard)</option>
                <option>RTSP (Real Time Streaming Protocol)</option>
                <option>RTMP (Real-Time Messaging Protocol)</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">{t('video.port')}</label>
             <input type="number" defaultValue={554} className="w-full border border-slate-300 rounded-lg p-2.5" />
          </div>
          <div className="col-span-2 space-y-2">
             <label className="text-sm font-medium text-slate-700">{t('video.allowed_ips')}</label>
             <textarea className="w-full border border-slate-300 rounded-lg p-2.5 h-24 font-mono text-sm" defaultValue="192.168.10.0/24&#10;10.5.0.0/16"></textarea>
          </div>
       </div>
       <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">{t('video.save_ingress')}</button>
       </div>
    </div>
  );

  const renderForwardConfig = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
       <div className="flex items-start justify-between">
         <div>
            <h3 className="text-lg font-semibold text-slate-800">{t('video.forward')}</h3>
            <p className="text-slate-500 text-sm">{t('video.forward_desc')}</p>
         </div>
         <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ArrowRight className="w-5 h-5"/></div>
       </div>
       
       <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                   <th className="px-4 py-3 font-medium">Stream ID</th>
                   <th className="px-4 py-3 font-medium">Source</th>
                   <th className="px-4 py-3 font-medium">Destination IP</th>
                   <th className="px-4 py-3 font-medium">Dest Port</th>
                   <th className="px-4 py-3 font-medium">Status</th>
                   <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                <tr>
                   <td className="px-4 py-3 font-mono">CAM-001</td>
                   <td className="px-4 py-3">192.168.10.5 (ONVIF)</td>
                   <td className="px-4 py-3">10.0.0.50</td>
                   <td className="px-4 py-3">8080</td>
                   <td className="px-4 py-3"><span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">Active</span></td>
                   <td className="px-4 py-3 text-right text-blue-600 font-medium cursor-pointer">Edit</td>
                </tr>
                <tr>
                   <td className="px-4 py-3 font-mono">CAM-002</td>
                   <td className="px-4 py-3">192.168.10.6 (GB28181)</td>
                   <td className="px-4 py-3">10.0.0.50</td>
                   <td className="px-4 py-3">8081</td>
                   <td className="px-4 py-3"><span className="text-slate-500 font-bold text-xs bg-slate-100 px-2 py-1 rounded-full">Paused</span></td>
                   <td className="px-4 py-3 text-right text-blue-600 font-medium cursor-pointer">Edit</td>
                </tr>
             </tbody>
          </table>
       </div>
       <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:bg-slate-50">+ Add Forwarding Rule</button>
    </div>
  );

  const renderStrategyConfig = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
       <div className="flex items-start justify-between">
         <div>
            <h3 className="text-lg font-semibold text-slate-800">{t('video.strategy')}</h3>
            <p className="text-slate-500 text-sm">{t('video.strategy_desc')}</p>
         </div>
         <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Shield className="w-5 h-5"/></div>
       </div>

       <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
             <div>
                <h4 className="font-medium text-slate-900">{t('video.check.protocol')}</h4>
                <p className="text-sm text-slate-500">Strictly enforce H.264 standard through full decode/encode cycle.</p>
             </div>
             <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
             <div>
                <h4 className="font-medium text-slate-900">{t('video.check.steganography')}</h4>
                <p className="text-sm text-slate-500">Add white noise to audio/video YUV data to destroy hidden payloads.</p>
             </div>
             <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
             <div>
                <h4 className="font-medium text-slate-900">{t('video.check.framerate')}</h4>
                <p className="text-sm text-slate-500">Normalize frame rates to prevent buffer overflow attacks.</p>
             </div>
             <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">{t('video.title')}</h2>
           <p className="text-slate-500">{t('video.subtitle')}</p>
         </div>
         <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
            <Play className="w-4 h-4 fill-current" /> {t('video.restart')}
         </button>
       </div>

       <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'access' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {t('video.tab.access')}
        </button>
        <button
          onClick={() => setActiveTab('forward')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'forward' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {t('video.tab.forward')}
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'strategy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {t('video.tab.strategy')}
        </button>
      </div>

      <div className="mt-4">
         {activeTab === 'access' && renderAccessConfig()}
         {activeTab === 'forward' && renderForwardConfig()}
         {activeTab === 'strategy' && renderStrategyConfig()}
      </div>
    </div>
  );
};

export default VideoStream;