import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/views/Dashboard';
import SystemConfig from './components/views/SystemConfig';
import SecurityPolicies from './components/views/SecurityPolicies';
import LogAudit from './components/views/LogAudit';
import { Role, User, View } from './types';
import { ROLE_LABELS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const handleLogin = (role: Role) => {
    // Simulate login
    setUser({
      username: 'admin_user',
      role: role,
      avatar: 'https://picsum.photos/200', // Placeholder
    });
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
      case View.SECURITY_POLICIES:
        return user.role === Role.SECADMIN ? <SecurityPolicies /> : <Unauthorized />;
      case View.LOGS_AUDIT:
        return user.role === Role.LOGADMIN ? <LogAudit /> : <Unauthorized />;
      // Fallback/Placeholder for views not fully implemented in this demo
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
             <span className="font-semibold text-slate-900">{ROLE_LABELS[user.role]}</span>
             <span className="mx-2">/</span>
             <span className="capitalize">{currentView.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <div className="text-sm font-bold text-slate-800">Admin User</div>
               <div className="text-xs text-slate-500 uppercase">{user.role}</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                <img src={`https://ui-avatars.com/api/?name=${user.role}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Helper Components for simple states
const Unauthorized: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">🚫</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
    <p className="text-slate-500 mt-2">Your role does not have permission to view this resource.</p>
  </div>
);

const ComingSoon: React.FC<{ viewName: string }> = ({ viewName }) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
    <h2 className="text-xl font-bold text-slate-400 capitalize">{viewName.replace('_', ' ')}</h2>
    <p className="text-slate-400 mt-1">This module is under development.</p>
  </div>
);

export default App;