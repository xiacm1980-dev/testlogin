import React, { useState } from 'react';
import { Shield, Server, FileText, Lock, ArrowRight, Languages, User } from 'lucide-react';
import { Role } from '../types';
import { ROLE_COLORS } from '../constants';
import { useLanguage } from '../i18n';
import { backend } from '../services/backend';

interface LoginProps {
  onLogin: (role: Role, username?: string, name?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { language, setLanguage, t } = useLanguage();

  const handleAdminLogin = () => {
    if (selectedRole && backend.authenticateAdmin(selectedRole, password)) {
        onLogin(selectedRole);
    } else {
        setError(t('login.error'));
    }
  };

  const handleGeneralLogin = () => {
      const user = backend.authenticateGeneralUser(username, password);
      if (user) {
          onLogin(Role.USER, user.id, user.name);
      } else {
          setError(t('login.invalid_creds'));
      }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  const switchTab = (tab: 'admin' | 'user') => {
      setActiveTab(tab);
      setError('');
      setPassword('');
      setUsername('');
      setSelectedRole(null);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="absolute top-6 right-6 z-20">
         <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
         >
            <Languages className="w-4 h-4" /> {language === 'en' ? '中文' : 'English'}
         </button>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl max-w-4xl w-full z-10 transition-all flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6 shadow-lg border border-slate-700">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('app.title')}</h1>
          <p className="text-slate-400 text-lg">{t('app.subtitle')}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800/50 p-1 rounded-xl mb-8 mx-auto max-w-md w-full border border-slate-700">
            <button 
                onClick={() => switchTab('admin')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
                {t('login.tab_admin')}
            </button>
            <button 
                onClick={() => switchTab('user')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'user' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
                {t('login.tab_user')}
            </button>
        </div>

        {activeTab === 'admin' ? (
            !selectedRole ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                    onClick={() => handleRoleSelect(Role.SYSADMIN)}
                    className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-blue-600/10 border border-slate-700 hover:border-blue-500 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                    <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.SYSADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all`}>
                        <Server className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{t(`role.${Role.SYSADMIN}`)}</h3>
                    <p className="text-sm text-slate-400 text-center">
                        {t('role.desc.sysadmin')}
                    </p>
                    </button>

                    <button
                    onClick={() => handleRoleSelect(Role.SECADMIN)}
                    className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-emerald-600/10 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                    <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.SECADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-emerald-500/50 transition-all`}>
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{t(`role.${Role.SECADMIN}`)}</h3>
                    <p className="text-sm text-slate-400 text-center">
                        {t('role.desc.secadmin')}
                    </p>
                    </button>

                    <button
                    onClick={() => handleRoleSelect(Role.LOGADMIN)}
                    className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-amber-600/10 border border-slate-700 hover:border-amber-500 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                    <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.LOGADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-amber-500/50 transition-all`}>
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{t(`role.${Role.LOGADMIN}`)}</h3>
                    <p className="text-sm text-slate-400 text-center">
                        {t('role.desc.logadmin')}
                    </p>
                    </button>
                </div>
            ) : (
                <div className="max-w-md mx-auto w-full bg-slate-800/80 p-8 rounded-xl border border-slate-700 animate-in fade-in zoom-in duration-300">
                    <h3 className="text-xl text-white font-semibold mb-6 text-center">
                    {t('login.title')} <span className="text-blue-400">{t(`role.${selectedRole}`)}</span>
                    </h3>
                    
                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">{t('login.password')}</label>
                        <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                        placeholder={t('login.placeholder')}
                        className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        autoFocus
                        />
                    </div>
                    
                    {error && (
                        <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded">
                        {error}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button 
                        onClick={() => setSelectedRole(null)}
                        className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                        {t('login.back')}
                        </button>
                        <button 
                        onClick={handleAdminLogin}
                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                        {t('login.button')} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    </div>
                </div>
            )
        ) : (
             <div className="max-w-md mx-auto w-full bg-slate-800/80 p-8 rounded-xl border border-slate-700 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                   <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-6 h-6 text-slate-300" />
                   </div>
                   <h3 className="text-xl text-white font-semibold">{t('login.general_title')}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('login.username')}</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t('login.username')}
                      className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">{t('login.password')}</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGeneralLogin()}
                      placeholder={t('login.password')}
                      className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div className="mt-6">
                    <button 
                      onClick={handleGeneralLogin}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {t('login.button')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
             </div>
        )}

        <div className="mt-12 text-center text-slate-500 text-sm">
          {t('app.footer')}
        </div>
      </div>
    </div>
  );
};

export default Login;