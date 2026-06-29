import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/forgot-password`, {
                email: email
            });
            setIsSubmitted(true);
        } catch (err) {
            setError(err.response?.data || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-[400px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <Send className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#222222] mb-3">Kiểm tra Email của bạn</h3>
                <p className="text-sm text-gray-500 mb-8">
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới <span className="font-semibold text-[#222222]">{email}</span>
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full h-10 bg-brand-accent text-black text-sm font-bold rounded-lg hover:brightness-105 transition-all"
                >
                    Quay lại Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className="w-[400px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-8 flex flex-col items-center">
            <button 
                onClick={() => navigate('/login')}
                className="self-start flex items-center gap-2 text-sm text-gray-500 hover:text-[#222222] mb-6 transition-colors"
            >
                <ArrowLeft size={16} />
                Quay lại
            </button>

            <h3 className="text-xl font-bold text-[#222222] mb-2">Quên mật khẩu?</h3>
            <p className="text-sm text-gray-500 text-center mb-8">
                Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn để khôi phục mật khẩu.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">
                        {error}
                    </div>
                )}
                
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        Địa chỉ Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full h-10 px-4 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!email || isLoading}
                    className={`w-full h-10 text-xs font-bold rounded-lg transition-all mt-2 flex items-center justify-center gap-2 ${
                        email && !isLoading
                            ? "bg-brand-accent text-black hover:brightness-105 shadow-sm"
                            : "bg-[#F4F4F4] text-[#8C8C8C] cursor-not-allowed"
                    }`}
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn'}
                </button>
            </form>

            <div className="mt-8 text-xs text-gray-400 flex flex-col items-center gap-2">
                <p>Bạn vẫn gặp sự cố?</p>
                <a href="#" className="text-[#1877F2] font-semibold hover:underline">Liên hệ bộ phận hỗ trợ</a>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
