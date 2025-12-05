import React, { useState } from 'react';
import { Plus, Trash2, Filter, Search, MoreVertical, ToggleRight, ToggleLeft } from 'lucide-react';
import { INITIAL_POLICIES } from '../../constants';
import { PolicyRule } from '../../types';

const SecurityPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyRule[]>(INITIAL_POLICIES);
  const [searchTerm, setSearchTerm] = useState('');

  const togglePolicy = (id: number) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const deletePolicy = (id: number) => {
    if(window.confirm('Are you sure you want to delete this policy rule?')) {
      setPolicies(policies.filter(p => p.id !== id));
    }
  };

  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Security Policies</h2>
           <p className="text-slate-500">Manage firewall rules and traffic control lists.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
          <Plus className="w-5 h-5" />
          Add New Rule
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search policies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Destination</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <button onClick={() => togglePolicy(policy.id)} className="focus:outline-none">
                      {policy.enabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-500 transition-colors" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300 transition-colors" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">#{policy.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{policy.name}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700">
                       {policy.source}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-medium text-slate-700">
                       {policy.destination}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{policy.service}</td>
                  <td className="px-6 py-4">
                    {policy.action === 'ALLOW' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        ALLOW
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        DENY
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deletePolicy(policy.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPolicies.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            No policies found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPolicies;