import React, { useState } from 'react';
import { Shield, Server, FileText, Lock, ArrowRight } from 'lucide-react';
import { Role } from '../types';
import { ROLE_COLORS, ROLE_LABELS } from '../constants';

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === '123456') {
      if (selectedRole) {
        onLogin(selectedRole);
      }
    } else {
      setError('Invalid password. Default is 123456');
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl max-w-4xl w-full z-10 transition-all">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6 shadow-lg border border-slate-700">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SecGuard Manager</h1>
          <p className="text-slate-400 text-lg">Secure Device Management System</p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SysAdmin Card */}
            <button
              onClick={() => handleRoleSelect(Role.SYSADMIN)}
              className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-blue-600/10 border border-slate-700 hover:border-blue-500 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.SYSADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all`}>
                <Server className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{ROLE_LABELS[Role.SYSADMIN]}</h3>
              <p className="text-sm text-slate-400 text-center">
                System status, Backup/Restore, API Config.
              </p>
            </button>

            {/* SecAdmin Card */}
            <button
              onClick={() => handleRoleSelect(Role.SECADMIN)}
              className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-emerald-600/10 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.SECADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-emerald-500/50 transition-all`}>
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{ROLE_LABELS[Role.SECADMIN]}</h3>
              <p className="text-sm text-slate-400 text-center">
                DDoS Protection, Video Cleaning, File Cleaning.
              </p>
            </button>

            {/* LogAdmin Card */}
            <button
              onClick={() => handleRoleSelect(Role.LOGADMIN)}
              className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-amber-600/10 border border-slate-700 hover:border-amber-500 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.LOGADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-amber-500/50 transition-all`}>
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{ROLE_LABELS[Role.LOGADMIN]}</h3>
              <p className="text-sm text-slate-400 text-center">
                Log Audit, Reports & Statistical Analysis.
              </p>
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-slate-800/80 p-8 rounded-xl border border-slate-700 animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl text-white font-semibold mb-6 text-center">
              Login as <span className="text-blue-400">{ROLE_LABELS[selectedRole]}</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password (default: 123456)"
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
                  Back
                </button>
                <button 
                  onClick={handleLogin}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  Login <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-slate-500 text-sm">
          &copy; 2024 SecGuard Systems Inc. Protected by quantum encryption.
        </div>
      </div>
    </div>
  );
};

export default Login;
