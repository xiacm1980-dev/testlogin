import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  ShieldCheck, 
  Activity, 
  FileText, 
  BarChart3, 
  LogOut, 
  Network
} from 'lucide-react';
import { Role, View } from '../types';

interface SidebarProps {
  role: Role;
  currentView: View;
  onChangeView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, currentView, onChangeView, onLogout }) => {
  
  const getMenuItems = () => {
    const common = [
      { id: View.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    ];

    switch (role) {
      case Role.SYSADMIN:
        return [
          ...common,
          { id: View.SYSTEM_CONFIG, label: 'System Config', icon: Settings },
          { id: View.USER_MANAGEMENT, label: 'User Management', icon: Users },
        ];
      case Role.SECADMIN:
        return [
          ...common,
          { id: View.SECURITY_POLICIES, label: 'Security Policies', icon: ShieldCheck },
          { id: View.THREAT_PROTECTION, label: 'Threat Protection', icon: Network },
        ];
      case Role.LOGADMIN:
        return [
          ...common,
          { id: View.LOGS_AUDIT, label: 'Audit Logs', icon: FileText },
          { id: View.LOGS_TRAFFIC, label: 'Traffic Analysis', icon: BarChart3 },
        ];
      default:
        return common;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-3 font-bold text-lg">S</div>
        <span className="text-xl font-bold tracking-tight">SecGuard</span>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          {role.toUpperCase()} Console
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;