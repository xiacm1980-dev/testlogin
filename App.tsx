import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/views/Dashboard';
import SystemConfig from './components/views/SystemConfig';
import SecurityPolicies from './components/views/SecurityPolicies';
import LogAudit from './components/views/LogAudit';
import ThreatProtection from './components/views/ThreatProtection';
import VideoStream from './components/views/VideoStream';
import FileCleaning from './components/views/FileCleaning';
import ApiSettings from './components/views/ApiSettings';
import Reports from './components/views/Reports';
import { Role, User, View } from './types';
import { Key, X, Languages } from 'lucide-react';
import { useLanguage } from './i18n';
import { backend } from './services/backend';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLogin = (role: Role) => {
    const username = role === Role.SYSADMIN ? 'sysadmin' : role === Role.SECADMIN ? 'secadmin' : 'logadmin';
    // Simulate login
    setUser({
      username: username,
      role: role,
      avatar: 'https://picsum.photos/200',
    });
    backend.loginUser(username, role); // Log the login event
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.DASHBOARD);
  };

  const renderContent = () => {
    if (!user) return null;

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard role={user.role} />;
      case View.SYSTEM_CONFIG:
        return user.role === Role.SYSADMIN ? <SystemConfig /> : <Unauthorized />;
      case View.API_SETTINGS:
        return user.role === Role.SYSADMIN ? <ApiSettings /> : <Unauthorized />;
      case View.SECURITY_POLICIES:
        return user.role === Role.SECADMIN ? <SecurityPolicies /> : <Unauthorized />;
      case View.THREAT_PROTECTION:
        return user.role === Role.SECADMIN ? <ThreatProtection /> : <Unauthorized />;
      case View.VIDEO_CLEANING:
        return user.role === Role.SECADMIN ? <VideoStream /> : <Unauthorized />;
      case View.FILE_CLEANING:
        return user.role === Role.SECADMIN ? <FileCleaning /> : <Unauthorized />;
      case View.LOGS_AUDIT:
        // SecAdmin and LogAdmin can see logs
        return (user.role === Role.LOGADMIN || user.role === Role.SECADMIN) ? <LogAudit type="SYSTEM" /> : <Unauthorized />;
      case View.ADMIN_LOGS:
        return user.role === Role.LOGADMIN ? <LogAudit type="ADMIN" /> : <Unauthorized />;
      case View.REPORTS:
        return user.role === Role.LOGADMIN ? <Reports /> : <Unauthorized />;
      default:
        return <ComingSoon viewName={currentView} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        role={user.role} 
        currentView={currentView} 
        onChangeView={setCurrentView}
        onLogout={handleLogout}
      />
      <div className="ml-64 w-full min-h-screen flex flex-col">
         {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center text-sm text-slate-500">
             <span className="font-semibold text-slate-900">{t(`role.${user.role}`)}</span>
             <span className="mx-2">/</span>
             <span className="capitalize">{t(`menu.${currentView}`)}</span>
          </div>
          <div className="flex items-center gap-4">
             <button
               onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
               className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
             >
               <Languages className="w-4 h-4" /> {language === 'en' ? '中文' : 'English'}
             </button>
             <div className="h-6 w-px bg-slate-200"></div>
             <button 
                onClick={() => setShowPasswordModal(true)}
                className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
             >
                <Key className="w-4 h-4" /> {t('common.change_password')}
             </button>
             <div className="h-6 w-px bg-slate-200"></div>
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <div className="text-sm font-bold text-slate-800">{user.username}</div>
                 <div className="text-xs text-slate-500 uppercase">{user.role}</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <img src={`https://ui-avatars.com/api/?name=${user.role}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
               </div>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('common.change_password')}</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.current_password')}</label>
                    <input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.new_password')}</label>
                    <input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.confirm_password')}</label>
                    <input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-2" />
                 </div>
                 <div className="flex justify-end gap-3 mt-6">
                    <button 
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                      {t('common.cancel')}
                    </button>
                    <button 
                      onClick={() => {
                        alert(t('common.password_changed'));
                        setShowPasswordModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium"
                    >
                      {t('common.update_password')}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Helper Components for simple states
const Unauthorized: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">🚫</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{t('common.access_denied')}</h2>
      <p className="text-slate-500 mt-2">{t('common.no_permission')}</p>
    </div>
  );
};

const ComingSoon: React.FC<{ viewName: string }> = ({ viewName }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
      <h2 className="text-xl font-bold text-slate-400 capitalize">{viewName.replace('_', ' ')}</h2>
      <p className="text-slate-400 mt-1">{t('common.coming_soon')}</p>
    </div>
  );
};

export default App;
