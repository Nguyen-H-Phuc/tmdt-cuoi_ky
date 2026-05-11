import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                token: token,
                newPassword: newPassword
            });
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    if (isSuccess) {
        return (
            <div className="w-[400px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#222222] mb-3">Thành công!</h3>
                <p className="text-sm text-gray-500 mb-8">
                    Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full h-10 bg-[#FFBA00] text-black text-sm font-bold rounded-lg hover:brightness-105 transition-all"
                >
                    Đăng nhập ngay
                </button>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="w-[400px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-8 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-red-500 mb-4">Lỗi truy cập</h3>
                <p className="text-sm text-gray-500 mb-8">
                    Liên kết không hợp lệ hoặc đã thiếu mã xác thực. Vui lòng kiểm tra lại email của bạn.
                </p>
                <button
                    onClick={() => navigate('/forgot-password')}
                    className="w-full h-10 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-all"
                >
                    Yêu cầu lại link mới
                </button>
            </div>
        );
    }

    return (
        <div className="w-[400px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#222222] mb-2">Đặt lại mật khẩu</h3>
            <p className="text-sm text-gray-500 text-center mb-8">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                        <Lock size={14} className="text-gray-400" />
                        Mật khẩu mới
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-10 px-4 pr-10 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#222222]">Xác nhận mật khẩu mới</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-10 px-4 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full h-10 bg-[#FFBA00] text-black text-xs font-bold rounded-lg hover:brightness-105 shadow-sm transition-all mt-2"
                >
                    Đổi mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
