import React, { useState, useEffect } from 'react';
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
import UserManagement from './components/views/UserManagement'; // New Import
import { Role, User, View } from './types';
import { Key, X, Languages } from 'lucide-react';
import { useLanguage } from './i18n';
import { backend } from './services/backend';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
     // Check for persisted session
     const storedUser = sessionStorage.getItem('aegis_user_session');
     if (storedUser) {
         try {
             const u = JSON.parse(storedUser);
             setUser(u);
             // Default view for general user
             if (u.role === Role.USER) {
                 setCurrentView(View.FILE_CLEANING);
             }
         } catch(e) { console.error('Failed to restore session', e); }
     }
  }, []);

  const handleLogin = (role: Role, username?: string, name?: string) => {
    const finalUsername = username || (role === Role.SYSADMIN ? 'sysadmin' : role === Role.SECADMIN ? 'secadmin' : 'logadmin');
    const newUser = {
      username: finalUsername,
      role: role,
      avatar: 'https://picsum.photos/200',
      name: name || finalUsername
    };
    
    setUser(newUser);
    sessionStorage.setItem('aegis_user_session', JSON.stringify(newUser));

    backend.loginUser(finalUsername, role); // Log the login event
    
    if (role === Role.USER) {
        setCurrentView(View.FILE_CLEANING);
    } else {
        setCurrentView(View.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.DASHBOARD);
    sessionStorage.removeItem('aegis_user_session');
  };

  const renderContent = () => {
    if (!user) return null;

    switch (currentView) {
      case View.DASHBOARD:
        return user.role !== Role.USER ? <Dashboard role={user.role} /> : <Unauthorized />;
      case View.SYSTEM_CONFIG:
        return user.role === Role.SYSADMIN ? <SystemConfig /> : <Unauthorized />;
      case View.USER_MANAGEMENT:
        return user.role === Role.SYSADMIN ? <UserManagement /> : <Unauthorized />;
      case View.API_SETTINGS:
        return user.role === Role.SYSADMIN ? <ApiSettings /> : <Unauthorized />;
      case View.SECURITY_POLICIES:
        return user.role === Role.SECADMIN ? <SecurityPolicies /> : <Unauthorized />;
      case View.THREAT_PROTECTION:
        return user.role === Role.SECADMIN ? <ThreatProtection /> : <Unauthorized />;
      case View.VIDEO_CLEANING:
        return user.role === Role.SECADMIN ? <VideoStream /> : <Unauthorized />;
      case View.FILE_CLEANING:
        // Both SecAdmin and General User can access File Cleaning
        return (user.role === Role.SECADMIN || user.role === Role.USER) ? <FileCleaning currentUser={user.name} role={user.role} /> : <Unauthorized />;
      case View.LOGS_AUDIT:
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

  // Simplified Layout for General User
  if (user.role === Role.USER) {
     return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">A</div>
                   <h1 className="text-xl font-bold">{t('app.portal')}</h1>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-sm">
                      <span className="text-slate-400">{t('app.welcome')}</span> <span className="font-semibold">{user.name}</span>
                   </div>
                   <button
                     onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                     className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
                   >
                     <Languages className="w-4 h-4" /> {language === 'en' ? '中文' : 'English'}
                   </button>
                   <div className="h-4 w-px bg-slate-700"></div>
                   <button 
                      onClick={() => setShowAccountModal(true)}
                      className="text-slate-300 hover:text-white text-sm flex items-center gap-1"
                   >
                      <Key className="w-4 h-4"/> {t('common.account')}
                   </button>
                   <button 
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                   >
                      {t('common.signout')}
                   </button>
                </div>
            </header>
            <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
                {renderContent()}
            </main>
            
            {showAccountModal && <AccountModal onClose={() => setShowAccountModal(false)} t={t} user={user} />}
        </div>
     );
  }

  // Standard Admin Layout
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
                onClick={() => setShowAccountModal(true)}
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

      {showAccountModal && <AccountModal onClose={() => setShowAccountModal(false)} t={t} user={user} />}
    </div>
  );
};

const AccountModal: React.FC<{ onClose: () => void, t: any, user: User }> = ({ onClose, t, user }) => {
    const [activeTab, setActiveTab] = useState<'basic' | 'password'>('basic');
    
    // Password State
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passError, setPassError] = useState('');

    // Basic Info State
    const [userInfo, setUserInfo] = useState<any>(null);
    const [infoError, setInfoError] = useState('');

    useEffect(() => {
        // Fetch current user info
        if (user.role === Role.USER) {
            const generalUsers = backend.getGeneralUsers();
            const currentUser = generalUsers.find(u => u.id === user.username);
            if (currentUser) setUserInfo(currentUser);
        }
    }, [user]);

    const handlePasswordSubmit = () => {
        setPassError('');
        if (!currentPass || !newPass || !confirmPass) {
            setPassError('All fields are required');
            return;
        }
        if (newPass !== confirmPass) {
            setPassError('New passwords do not match');
            return;
        }
        
        const success = backend.changePassword(user.username, user.role, currentPass, newPass);
        
        if (success) {
            alert(t('common.password_changed'));
            onClose();
        } else {
            setPassError('Incorrect current password');
        }
    };

    const handleInfoSubmit = () => {
        if (!userInfo) return;
        backend.updateGeneralUser(userInfo);
        alert(t('user.update_success'));
        // Optionally update local storage session if name changed
        const currentSession = JSON.parse(sessionStorage.getItem('aegis_user_session') || '{}');
        currentSession.name = userInfo.name;
        sessionStorage.setItem('aegis_user_session', JSON.stringify(currentSession));
        window.location.reload(); // Simple reload to reflect name change in header
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('common.account')}</h3>
            
            <div className="flex gap-2 mb-6 border-b border-slate-100 pb-2">
                <button 
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'basic' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t('common.basic_info')}
                </button>
                <button 
                    onClick={() => setActiveTab('password')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'password' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t('common.change_password')}
                </button>
            </div>

            {activeTab === 'password' && (
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.current_password')}</label>
                    <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.new_password')}</label>
                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('common.confirm_password')}</label>
                    <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    {passError && <div className="text-red-500 text-sm">{passError}</div>}
                    <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">{t('common.cancel')}</button>
                    <button onClick={handlePasswordSubmit} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium">{t('common.update_password')}</button>
                    </div>
                </div>
            )}

            {activeTab === 'basic' && (
                <div className="space-y-4">
                    {userInfo ? (
                        <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.id')}</label>
                            <input type="text" value={userInfo.id} disabled className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-slate-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.name')}</label>
                            <input type="text" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.unit')}</label>
                                <input type="text" value={userInfo.unit} disabled className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.dept')}</label>
                                <input type="text" value={userInfo.department} disabled className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-slate-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('user.contact')}</label>
                            <input type="text" value={userInfo.contact} onChange={e => setUserInfo({...userInfo, contact: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">{t('common.cancel')}</button>
                            <button onClick={handleInfoSubmit} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium">{t('common.save_info')}</button>
                        </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            User information not available for this role.
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    );
};

// Helper Components
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