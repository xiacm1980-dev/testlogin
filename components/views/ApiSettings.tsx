import React, { useState } from 'react';
import { Globe, Copy, RefreshCw, ToggleRight, Server, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../i18n';
import { backend } from '../../services/backend';

const ApiSettings: React.FC = () => {
  const { t } = useLanguage();
  const [backendUrl, setBackendUrl] = useState('http://localhost:8080');
  const [apiKey, setApiKey] = useState('sk_live_51M3p9jK2...');
  const [rateLimit, setRateLimit] = useState(600);
  const [timeout, setTimeout] = useState(3600);

  // Video Stream Settings
  const [onvifEnabled, setOnvifEnabled] = useState(true);
  const [gb28181Enabled, setGb28181Enabled] = useState(true);
  const [streamPort, setStreamPort] = useState(5554);
  const [outputPort, setOutputPort] = useState(5555);

  const handleSave = () => {
    // Save to backend/localStorage
    const config = {
      backendUrl,
      apiKey,
      rateLimit,
      timeout,
      videoStream: {
        onvifEnabled,
        gb28181Enabled,
        streamPort,
        outputPort
      }
    };
    localStorage.setItem('aegis_api_config', JSON.stringify(config));
    backend.log('CONFIG', 'INFO', 'API settings updated', undefined, undefined, 'sysadmin');
    toast.success(t('config.saved'));
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API Key copied!');
  };

  const regenerateKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success('API Key regenerated!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
         <h2 className="text-2xl font-bold text-slate-900">{t('api.title')}</h2>
         <p className="text-slate-500">{t('api.subtitle')}</p>
      </div>

      {/* Backend Server Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
               <Server className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-semibold text-lg text-slate-800">Backend Server</h3>
                <p className="text-xs text-slate-500">Configure processing server endpoint</p>
             </div>
         </div>
         <div className="p-6 space-y-4">
            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Backend URL</label>
               <input
                 type="text"
                 value={backendUrl}
                 onChange={(e) => setBackendUrl(e.target.value)}
                 placeholder="http://your-server.com:8080"
                 className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
               />
               <p className="text-xs text-slate-400">The URL of your backend processing server</p>
            </div>
         </div>
      </div>

      {/* RESTful API Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <Globe className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-semibold text-lg text-slate-800">{t('api.rest_title')}</h3>
                <p className="text-xs text-slate-500">RESTful API Configuration</p>
             </div>
             <div className="ml-auto">
                <ToggleRight className="w-10 h-10 text-emerald-500 cursor-pointer" />
             </div>
         </div>
         
         <div className="p-6 space-y-6">
            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">{t('api.master_key')}</label>
               <div className="flex gap-2">
                  <input type="text" readOnly value={apiKey} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-mono text-sm text-slate-600" />
                  <button onClick={copyApiKey} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><Copy className="w-4 h-4" /></button>
                  <button onClick={regenerateKey} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><RefreshCw className="w-4 h-4" /></button>
               </div>
               <p className="text-xs text-slate-400">{t('api.master_key_desc')}</p>
            </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">{t('api.mode')}</label>
               <div className="flex gap-4">
                   <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-3 w-full bg-slate-50">
                      <input type="checkbox" checked disabled className="accent-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Synchronous (/clean/sync)</span>
                        <span className="text-xs text-slate-500">Wait for file cleaning response (Max 30s)</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-3 w-full bg-slate-50">
                      <input type="checkbox" checked disabled className="accent-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Asynchronous (/clean/async)</span>
                        <span className="text-xs text-slate-500">Submit task ID and poll for status</span>
                      </div>
                   </div>
               </div>
               <p className="text-xs text-slate-400">{t('api.mode_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('api.rate_limit')}</label>
                  <input type="number" value={rateLimit} onChange={(e) => setRateLimit(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t('api.timeout')}</label>
                  <input type="number" value={timeout} onChange={(e) => setTimeout(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
               </div>
            </div>
         </div>
      </div>

      {/* Video Stream Protocol Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
               <Video className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-semibold text-lg text-slate-800">Video Stream Protocols</h3>
                <p className="text-xs text-slate-500">ONVIF & GB/T28181-2016 Support</p>
             </div>
         </div>
         <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-slate-700">ONVIF Protocol</label>
                     <button
                       onClick={() => setOnvifEnabled(!onvifEnabled)}
                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${onvifEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                     >
                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${onvifEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                     </button>
                  </div>
                  <p className="text-xs text-slate-400">Enable ONVIF video stream support</p>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-slate-700">GB/T28181-2016</label>
                     <button
                       onClick={() => setGb28181Enabled(!gb28181Enabled)}
                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gb28181Enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                     >
                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gb28181Enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                     </button>
                  </div>
                  <p className="text-xs text-slate-400">Enable GB/T28181 national standard protocol</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Input Stream Port</label>
                  <input
                    type="number"
                    value={streamPort}
                    onChange={(e) => setStreamPort(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-400">Port for receiving video streams</p>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Output Stream Port</label>
                  <input
                    type="number"
                    value={outputPort}
                    onChange={(e) => setOutputPort(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-400">Port for sending processed streams</p>
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <p className="text-sm text-blue-800">
                  <strong>Processing Pipeline:</strong> H264 decode → YUV format → Frame rate compression → White noise injection → H264 encode → Stream output
               </p>
            </div>
         </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
         <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t('config.save')}
         </button>
      </div>
    </div>
  );
};

export default ApiSettings;