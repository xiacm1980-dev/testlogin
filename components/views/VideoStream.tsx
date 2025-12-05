import React, { useState } from 'react';
import { Video, ArrowRight, Settings, Shield, Globe, Play } from 'lucide-react';

const VideoStream: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'access' | 'forward' | 'strategy'>('access');

  const renderAccessConfig = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
       <div className="flex items-start justify-between">
         <div>
            <h3 className="text-lg font-semibold text-slate-800">Ingress Configuration</h3>
            <p className="text-slate-500 text-sm">Configure accepted incoming video streams and protocols.</p>
         </div>
         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Globe className="w-5 h-5"/></div>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Input Protocol</label>
             <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-white">
                <option>RTSP (Real Time Streaming Protocol)</option>
                <option>RTMP (Real-Time Messaging Protocol)</option>
                <option>HLS (HTTP Live Streaming)</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Listening Port</label>
             <input type="number" defaultValue={554} className="w-full border border-slate-300 rounded-lg p-2.5" />
          </div>
          <div className="col-span-2 space-y-2">
             <label className="text-sm font-medium text-slate-700">Allowed Source IPs (CIDR)</label>
             <textarea className="w-full border border-slate-300 rounded-lg p-2.5 h-24 font-mono text-sm" defaultValue="192.168.10.0/24&#10;10.5.0.0/16"></textarea>
          </div>
       </div>
       <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save Ingress Rules</button>
       </div>
    </div>
  );

  const renderForwardConfig = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
       <div className="flex items-start justify-between">
         <div>
            <h3 className="text-lg font-semibold text-slate-800">Forwarding Configuration</h3>
            <p className="text-slate-500 text-sm">Define where cleaned streams should be sent.</p>
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
                   <td className="px-4 py-3">192.168.10.5</td>
                   <td className="px-4 py-3">10.0.0.50</td>
                   <td className="px-4 py-3">8080</td>
                   <td className="px-4 py-3"><span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">Active</span></td>
                   <td className="px-4 py-3 text-right text-blue-600 font-medium cursor-pointer">Edit</td>
                </tr>
                <tr>
                   <td className="px-4 py-3 font-mono">CAM-002</td>
                   <td className="px-4 py-3">192.168.10.6</td>
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
            <h3 className="text-lg font-semibold text-slate-800">Cleaning Strategy</h3>
            <p className="text-slate-500 text-sm">Deep packet inspection and payload sanitization rules.</p>
         </div>
         <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Shield className="w-5 h-5"/></div>
       </div>

       <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
             <div>
                <h4 className="font-medium text-slate-900">Protocol Compliance Check</h4>
                <p className="text-sm text-slate-500">Strictly enforce RFC standards for RTSP/RTMP headers.</p>
             </div>
             <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
             <div>
                <h4 className="font-medium text-slate-900">Steganography Detection</h4>
                <p className="text-sm text-slate-500">Analyze frames for hidden data payloads.</p>
             </div>
             <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
             <div>
                <h4 className="font-medium text-slate-900">Frame Rate Limiting</h4>
                <p className="text-sm text-slate-500">Normalize frame rates to prevent buffer overflow attacks.</p>
             </div>
             <input type="checkbox" className="w-5 h-5 accent-blue-600" />
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-slate-900">Video Stream Cleaning</h2>
           <p className="text-slate-500">Secure low-latency video transfer and sanitization.</p>
         </div>
         <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
            <Play className="w-4 h-4 fill-current" /> Restart Engine
         </button>
       </div>

       <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'access' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Access Config
        </button>
        <button
          onClick={() => setActiveTab('forward')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'forward' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Forward Config
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'strategy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Cleaning Strategy
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
