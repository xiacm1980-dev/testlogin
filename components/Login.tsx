import React from 'react';
import { Shield, Server, FileText, Lock } from 'lucide-react';
import { Role } from '../types';
import { ROLE_COLORS, ROLE_LABELS } from '../constants';

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl max-w-4xl w-full z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6 shadow-lg border border-slate-700">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SecGuard Manager</h1>
          <p className="text-slate-400 text-lg">Select your administrative role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SysAdmin Card */}
          <button
            onClick={() => onLogin(Role.SYSADMIN)}
            className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-blue-600/10 border border-slate-700 hover:border-blue-500 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.SYSADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all`}>
              <Server className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{ROLE_LABELS[Role.SYSADMIN]}</h3>
            <p className="text-sm text-slate-400 text-center">
              Network config, firmware updates, user management, and system health.
            </p>
          </button>

          {/* SecAdmin Card */}
          <button
            onClick={() => onLogin(Role.SECADMIN)}
            className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-emerald-600/10 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.SECADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-emerald-500/50 transition-all`}>
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{ROLE_LABELS[Role.SECADMIN]}</h3>
            <p className="text-sm text-slate-400 text-center">
              Firewall rules, IPS signatures, VPN tunnels, and threat prevention.
            </p>
          </button>

          {/* LogAdmin Card */}
          <button
            onClick={() => onLogin(Role.LOGADMIN)}
            className="group relative flex flex-col items-center p-8 bg-slate-800/50 hover:bg-amber-600/10 border border-slate-700 hover:border-amber-500 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <div className={`w-14 h-14 rounded-lg ${ROLE_COLORS[Role.LOGADMIN]} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-amber-500/50 transition-all`}>
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{ROLE_LABELS[Role.LOGADMIN]}</h3>
            <p className="text-sm text-slate-400 text-center">
              System audits, traffic logs, compliance reporting, and forensic analysis.
            </p>
          </button>
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          &copy; 2024 SecGuard Systems Inc. Protected by quantum encryption.
        </div>
      </div>
    </div>
  );
};

export default Login;