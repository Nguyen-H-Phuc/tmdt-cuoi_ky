import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, Key, Eye, EyeOff, ShieldAlert } from 'lucide-react';

const ProfileSecurityCard = () => {
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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        console.log('Changing password...');
        alert('Đã cập nhật mật khẩu mới!');
    };

    return (
        <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-[#222222]">Bảo mật tài khoản</h2>
                    <p className="text-xs text-gray-500 mt-1">Quản lý mật khẩu và các thiết lập bảo mật khác</p>
                </div>

                {/* Password Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#FFBA00]/10 rounded text-[#FFBA00]">
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
                                    className="w-full h-12 pl-4 pr-12 border border-[#DADADA] rounded-xl outline-none focus:border-[#FFBA00] transition-all bg-white text-sm"
                                    placeholder="••••••••"
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
                                    className="w-full h-12 pl-4 pr-12 border border-[#DADADA] rounded-xl outline-none focus:border-[#FFBA00] transition-all bg-white text-sm"
                                    placeholder="••••••••"
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
                            <label className="text-xs font-semibold text-[#222222]">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirm"
                                    value={passwords.confirm}
                                    onChange={handlePasswordChange}
                                    className="w-full h-10 pl-3 pr-10 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs"
                                    placeholder="••••••••"
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
                            className="mt-1 w-fit px-6 h-10 bg-[#FFBA00] text-black text-xs font-bold rounded-lg hover:brightness-105 shadow-sm transition-all"
                        >
                            Cập nhật mật khẩu
                        </button>
                    </form>
                </div>

                {/* 2FA Section */}
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#FFBA00]/10 rounded text-[#FFBA00]">
                            <Smartphone size={16} />
                        </div>
                        <h3 className="font-bold text-sm text-[#222222]">Xác thực 2 lớp (2FA)</h3>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex gap-3">
                            <div className="p-1.5 bg-white rounded shadow-sm h-fit">
                                <ShieldCheck size={20} className="text-green-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-xs text-[#222222]">Tình trạng: Chưa kích hoạt</p>
                                <p className="text-[10px] text-gray-500 mt-0.5 max-w-md">
                                    Tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác minh mỗi khi đăng nhập.
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-1.5 border-2 border-[#FFBA00] text-[#222222] text-xs font-bold rounded-lg hover:bg-[#FFBA00] transition-all">
                            Kích hoạt
                        </button>
                    </div>
                </div>

                {/* Devices Section */}
                <div className="pt-8 border-t border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FFBA00]/10 rounded-lg text-[#FFBA00]">
                            <Key size={20} />
                        </div>
                        <h3 className="font-bold text-[#222222]">Các thiết bị đang đăng nhập</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Smartphone size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#222222]">Windows PC - Chrome</p>
                                    <p className="text-xs text-gray-500">Đang hoạt động • Hà Nội, Việt Nam</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">Hiện tại</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurityCard;
