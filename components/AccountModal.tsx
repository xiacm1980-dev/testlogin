import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Role } from '../types';
import { X } from 'lucide-react';
import { backend } from '../services/backend';

interface AccountModalProps {
    onClose: () => void;
    t: any;
    user: User;
}

const AccountModal: React.FC<AccountModalProps> = ({ onClose, t, user }) => {
    const isGeneralUser = user.role === Role.USER;
    const [activeTab, setActiveTab] = useState<'basic' | 'password'>(isGeneralUser ? 'basic' : 'password');

    // Password State
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passError, setPassError] = useState('');

    // Basic Info State
    const [userInfo, setUserInfo] = useState<any>(null);
    const [infoError, setInfoError] = useState('');

    useEffect(() => {
        // Fetch current user info if it's a general user
        if (isGeneralUser) {
            const generalUsers = backend.getGeneralUsers();
            const currentUser = generalUsers.find(u => u.id === user.username);
            if (currentUser) setUserInfo(currentUser);
        }
    }, [user, isGeneralUser]);

    const handlePasswordSubmit = () => {
        setPassError('');
        if (!currentPass || !newPass || !confirmPass) {
            setPassError(t('error.all_fields_required'));
            return;
        }
        if (newPass !== confirmPass) {
            setPassError(t('error.password_mismatch'));
            return;
        }

        // Validate password strength
        const validation = backend.validatePasswordStrength(newPass);
        if (!validation.valid) {
            setPassError(t(validation.error || 'error.invalid_password'));
            return;
        }

        const success = backend.changePassword(user.username, user.role, currentPass, newPass);

        if (success) {
            toast.success(t('common.password_changed'));
            onClose();
        } else {
            setPassError(t('error.incorrect_current_password'));
        }
    };

    const handleInfoSubmit = () => {
        if (!userInfo) return;
        backend.updateGeneralUser(userInfo);
        toast.success(t('user.update_success'));
        // Update session with new name
        const currentSession = JSON.parse(sessionStorage.getItem('aegis_user_session') || '{}');
        currentSession.name = userInfo.name;
        sessionStorage.setItem('aegis_user_session', JSON.stringify(currentSession));
        // Close modal - parent will re-render with updated session
        onClose();
        // Trigger a page reload to update the header
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{isGeneralUser ? t('common.account') : t('common.change_password')}</h3>

            {/* Only show tabs for General Users */}
            {isGeneralUser && (
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
            )}

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

            {activeTab === 'basic' && isGeneralUser && (
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
                            {t('error.user_info_unavailable')}
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    );
};

export default AccountModal;
