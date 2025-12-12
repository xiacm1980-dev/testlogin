import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Filter, Search, MoreVertical, ToggleRight, ToggleLeft, Shield, X, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { backend, PolicyRule } from '../../services/backend';
import { useLanguage } from '../../i18n';

const SecurityPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PolicyRule, direction: 'asc' | 'desc' }>({ key: 'id', direction: 'asc' });
  const { t } = useLanguage();

  // New Policy Form State
  const [newRule, setNewRule] = useState({
    name: '', source: 'Any', destination: 'Any', service: 'Any', action: 'DENY' as 'DENY'|'ALLOW'
  });

  useEffect(() => {
    // Initial fetch
    setPolicies(backend.getPolicies());
    // Poll to keep sync with backend stats (active rules count logic resides in backend but rules array is here)
    const interval = setInterval(() => {
      setPolicies(backend.getPolicies());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const togglePolicy = (id: number) => {
    backend.togglePolicy(id);
    setPolicies(backend.getPolicies());
  };

  const deletePolicy = (id: number) => {
    if(window.confirm(t('policy.delete_confirm'))) {
      backend.deletePolicy(id);
      setPolicies(backend.getPolicies());
    }
  };

  const handleAddRule = () => {
    if (!newRule.name) return;
    backend.addPolicy({
      ...newRule,
      enabled: true
    });
    setShowAddModal(false);
    setNewRule({ name: '', source: 'Any', destination: 'Any', service: 'Any', action: 'DENY' });
    setPolicies(backend.getPolicies());
  };

  const handleSort = (key: keyof PolicyRule) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
  });

  const SortIcon = ({ colKey }: { colKey: keyof PolicyRule }) => {
      if (sortConfig.key !== colKey) return <ArrowDown className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-50" />;
      return sortConfig.direction === 'asc' 
        ? <ArrowUp className="w-3 h-3 text-emerald-600" />
        : <ArrowDown className="w-3 h-3 text-emerald-600" />;
  };

  const Th = ({ colKey, label }: { colKey: keyof PolicyRule, label: string }) => (
      <th 
        className="px-6 py-4 font-semibold cursor-pointer group select-none resize-x overflow-hidden"
        onClick={() => handleSort(colKey)}
      >
          <div className="flex items-center gap-1">
              {label}
              <SortIcon colKey={colKey} />
          </div>
      </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">{t('policy.title')}</h2>
           <p className="text-slate-500">{t('policy.subtitle')}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('policy.add')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('policy.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
            <Filter className="w-4 h-4" />
            {t('policy.filter')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <Th colKey="enabled" label={t('policy.col.status')} />
                <Th colKey="id" label={t('policy.col.id')} />
                <Th colKey="name" label={t('policy.col.name')} />
                <Th colKey="source" label={t('policy.col.source')} />
                <Th colKey="destination" label={t('policy.col.dest')} />
                <Th colKey="service" label={t('policy.col.service')} />
                <Th colKey="action" label={t('policy.col.action')} />
                <th className="px-6 py-4 font-semibold text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sortedPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <button onClick={() => togglePolicy(policy.id)} className="focus:outline-none" title="Toggle firewalld rule">
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
                        {t('policy.allow')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        {t('policy.deny')}
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
        {sortedPolicies.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            {t('policy.empty')}
          </div>
        )}
      </div>

       {/* Add Rule Modal */}
       {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg"><Shield className="w-6 h-6 text-emerald-600"/></div>
                <h3 className="text-xl font-bold text-slate-900">{t('policy.add')}</h3>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('policy.col.name')}</label>
                    <input 
                      type="text" 
                      value={newRule.name} 
                      onChange={e => setNewRule({...newRule, name: e.target.value})}
                      placeholder="e.g. Block External SSH"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('policy.col.source')}</label>
                        <input 
                            type="text" 
                            value={newRule.source} 
                            onChange={e => setNewRule({...newRule, source: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('policy.col.dest')}</label>
                        <input 
                            type="text" 
                            value={newRule.destination} 
                            onChange={e => setNewRule({...newRule, destination: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('policy.col.service')}</label>
                        <input 
                            type="text" 
                            value={newRule.service} 
                            onChange={e => setNewRule({...newRule, service: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('policy.col.action')}</label>
                        <select 
                            value={newRule.action} 
                            onChange={e => setNewRule({...newRule, action: e.target.value as 'ALLOW'|'DENY'})}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white" 
                        >
                            <option value="ALLOW">{t('policy.allow')}</option>
                            <option value="DENY">{t('policy.deny')}</option>
                        </select>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 mt-8">
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                      {t('common.cancel')}
                    </button>
                    <button 
                      onClick={handleAddRule}
                      className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save to Firewalld
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPolicies;