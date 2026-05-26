import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const ProfileSecurityCard = () => {
    const { user: currentUser } = useAuth();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validatePassword = (password) => {
        if (password.length < 8 || password.length > 32) {
            return 'Mật khẩu mới phải từ 8 đến 32 ký tự.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Mật khẩu mới phải chứa ít nhất 1 chữ in hoa.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Mật khẩu mới phải chứa ít nhất 1 chữ thường.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Mật khẩu mới phải chứa ít nhất 1 chữ số.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ các trường.' });
            return;
        }

        // Validate password criteria
        const passwordError = validatePassword(passwords.new);
        if (passwordError) {
            setMessage({ type: 'error', text: passwordError });
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp!' });
            return;
        }

        if (!currentUser?.userId) {
            setMessage({ type: 'error', text: 'Không tìm thấy thông tin người dùng đăng nhập.' });
            return;
        }

        setIsSaving(true);

        try {
            const response = await axios.put(`http://localhost:8080/api/users/profile/${currentUser.userId}/change-password`, {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });

            setMessage({ type: 'success', text: response.data.message || 'Cập nhật mật khẩu thành công!' });
            setPasswords({
                current: '',
                new: '',
                confirm: ''
            });
        } catch (error) {
            console.error("Lỗi cập nhật mật khẩu:", error);
            const errMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật mật khẩu.';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-[#222222]">Bảo mật tài khoản</h2>
                    <p className="text-xs text-gray-500 mt-1">Quản lý mật khẩu và các thiết lập bảo mật khác</p>
                </div>

                {/* Notifications Alert */}
                {message.text && (
                    <div className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs ${
                        message.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                            : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="font-semibold">{message.text}</span>
                    </div>
                )}

                {/* Password Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-accent/10 rounded text-brand-accent">
                            <Lock size={16} />
                        </div>
                        <h3 className="font-bold text-sm text-[#222222]">Thay đổi mật khẩu</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                        {/* Current Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#222222]">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="current"
                                    value={passwords.current}
                                    onChange={handlePasswordChange}
                                    disabled={isSaving}
                                    className="w-full h-12 pl-4 pr-12 border border-[#DADADA] rounded-xl outline-none focus:border-brand-accent transition-all bg-white text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#222222]">Mật khẩu mới</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="new"
                                    value={passwords.new}
                                    onChange={handlePasswordChange}
                                    disabled={isSaving}
                                    className="w-full h-12 pl-4 pr-12 border border-[#DADADA] rounded-xl outline-none focus:border-brand-accent transition-all bg-white text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#222222]">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirm"
                                    value={passwords.confirm}
                                    onChange={handlePasswordChange}
                                    disabled={isSaving}
                                    className="w-full h-12 pl-3 pr-10 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="mt-1 w-fit px-6 h-10 bg-brand-primary hover:bg-brand-hover text-black disabled:bg-gray-200 disabled:text-gray-400 text-xs font-bold rounded-lg hover:brightness-105 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} />
                                    Đang cập nhật...
                                </>
                            ) : (
                                'Cập nhật mật khẩu'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityCard;
