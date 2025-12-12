import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Search, Edit2, User, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { backend } from '../../services/backend';
import { GeneralUser } from '../../types';
import { useLanguage } from '../../i18n';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<GeneralUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<GeneralUser | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof GeneralUser, direction: 'asc' | 'desc' }>({ key: 'id', direction: 'asc' });
  const { t } = useLanguage();

  const [form, setForm] = useState({
    id: '', name: '', password: '', unit: '', department: '', contact: ''
  });

  useEffect(() => {
    setUsers(backend.getGeneralUsers());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm(t('user.delete_confirm'))) {
      backend.deleteGeneralUser(id);
      setUsers(backend.getGeneralUsers());
    }
  };

  const handleEdit = (user: GeneralUser) => {
    setEditingUser(user);
    setForm({
      id: user.id,
      name: user.name,
      password: '', // Empty password means "keep existing password"
      unit: user.unit,
      department: user.department,
      contact: user.contact
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setForm({ id: '', name: '', password: '', unit: '', department: '', contact: '' });
    setShowModal(true);
  };

  const handleSubmit = () => {
    // Validation
    if (!form.id || !form.name) {
      toast.error(t('user.id') + ' and ' + t('user.name') + ' are required');
      return;
    }

    // For new users, password is required
    if (!editingUser && !form.password) {
      toast.error(t('login.password') + ' is required for new users');
      return;
    }

    // Validate password strength only if password is being set/changed
    if (form.password && form.password.trim() !== '') {
        const validation = backend.validatePasswordStrength(form.password);
        if (!validation.valid) {
            toast.error(t(validation.error || 'Invalid password'));
            return;
        }
    }

    const userData: GeneralUser = {
      ...form,
      // If editing and password is empty, keep the old password
      password: (editingUser && !form.password) ? editingUser.password : form.password,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
    };

    if (editingUser) {
      backend.updateGeneralUser(userData);
      toast.success(t('user.updated'));
    } else {
      backend.addGeneralUser(userData);
      toast.success(t('user.added'));
    }

    setUsers(backend.getGeneralUsers());
    setShowModal(false);
  };

  const handleSort = (key: keyof GeneralUser) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
  });

  const SortIcon = ({ colKey }: { colKey: keyof GeneralUser }) => {
      if (sortConfig.key !== colKey) return <ArrowDown className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-50" />;
      return sortConfig.direction === 'asc' 
        ? <ArrowUp className="w-3 h-3 text-blue-600" />
        : <ArrowDown className="w-3 h-3 text-blue-600" />;
  };

  const Th = ({ colKey, label }: { colKey: keyof GeneralUser, label: string }) => (
      <th 
        className="px-6 py-3 font-medium cursor-pointer group select-none resize-x overflow-hidden"
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
           <h2 className="text-2xl font-bold text-slate-900">{t('menu.user_management')}</h2>
           <p className="text-slate-500">{t('user.subtitle')}</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('user.add')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t('user.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-auto">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <Th colKey="id" label={t('user.id')} />
                <Th colKey="name" label={t('user.name')} />
                <Th colKey="unit" label={t('user.unit')} />
                <Th colKey="department" label={t('user.dept')} />
                <Th colKey="contact" label={t('user.contact')} />
                <th className="px-6 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-600">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><User className="w-3 h-3"/></div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.unit}</td>
                  <td className="px-6 py-4">{user.department}</td>
                  <td className="px-6 py-4">{user.contact}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
              {sortedUsers.length === 0 && (
                 <tr><td colSpan={6} className="p-8 text-center text-slate-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-6">{editingUser ? t('user.edit') : t('user.add')}</h3>
              
              <div className="grid grid-cols-2 gap-4 space-y-0">
                 <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.id')} (Username)</label>
                    <input 
                      type="text" 
                      value={form.id} 
                      disabled={!!editingUser}
                      onChange={e => setForm({...form, id: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100" 
                    />
                 </div>
                 <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.name')}</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t('login.password')}
                      {editingUser && <span className="text-slate-400 text-xs ml-2">({t('user.password_hint_keep')})</span>}
                      {!editingUser && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})}
                      placeholder={editingUser ? t('user.password_placeholder_edit') : t('user.password_placeholder_new')}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {!editingUser && (
                      <p className="text-xs text-slate-500 mt-1">
                        {t('user.password_requirements')}
                      </p>
                    )}
                 </div>
                 <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.unit')}</label>
                    <input 
                      type="text" 
                      value={form.unit} 
                      onChange={e => setForm({...form, unit: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                 </div>
                 <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.dept')}</label>
                    <input 
                      type="text" 
                      value={form.department} 
                      onChange={e => setForm({...form, department: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.contact')}</label>
                    <input 
                      type="text" 
                      value={form.contact} 
                      onChange={e => setForm({...form, contact: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t('config.save')}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;