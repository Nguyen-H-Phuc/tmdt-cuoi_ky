import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VerifyForm from './VerifyForm';

const RegisterForm = () => {
    const [step, setStep] = useState('register'); // 'register' or 'verify'
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [agreed, setAgreed] = useState(true);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const passwordCriteria = [
        { label: "Giới hạn từ 8-32 ký tự.", valid: formData.password.length >= 8 && formData.password.length <= 32 },
        { label: "Tối thiểu 01 ký tự IN HOA.", valid: /[A-Z]/.test(formData.password) },
        { label: "Tối thiểu 01 ký tự in thường.", valid: /[a-z]/.test(formData.password) },
        { label: "Tối thiểu 01 chữ số.", valid: /[0-9]/.test(formData.password) },
    ];

    const isFormValid = formData.fullName && formData.email && formData.password && agreed && passwordCriteria.every(c => c.valid);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/register`, {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            // Thay vì alert, ta chuyển sang bước verify ngay
            setStep('verify');
        } catch (error) {
            setError(error.response?.data || "Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (step === 'verify') {
        return (
            <VerifyForm 
                email={formData.email} 
                onBack={() => setStep('register')} 
                onSuccess={() => navigate('/login')}
            />
        );
    }

    return (
        <div className="w-[480px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-10 flex flex-col items-center">

            {/* Header Section */}
            <div className="w-full flex items-center gap-4 mb-2">
                <button 
                    onClick={() => navigate('/login')}
                    className="text-xl text-gray-700 hover:bg-gray-100 p-1 rounded-lg transition-all"
                >
                    <IoMdArrowBack />
                </button>
                <h3 className="text-[20px] font-bold text-[#222222]">Đăng ký tài khoản mới</h3>
            </div>

            <div className="w-full mb-6">
                <p className="text-[14px] text-gray-500 leading-relaxed">
                    Vui lòng điền thông tin bên dưới để tạo tài khoản.
                </p>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4 items-center w-full">
                {/* Thông báo lỗi tập trung */}
                {error && (
                    <div className="w-[400px] bg-red-50 text-red-600 text-[13px] p-3 rounded-xl border border-red-100 mb-2">
                        {error}
                    </div>
                )}

                {/* Input Họ và tên */}
                <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên *"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl px-4 outline-none focus:border-brand-accent transition-all placeholder:text-gray-400 text-[14px]"
                />

                {/* Input Email */}
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email *"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl px-4 outline-none focus:border-brand-accent transition-all placeholder:text-gray-400 text-[14px]"
                />

                {/* Input Mật khẩu */}
                <div className="relative w-[400px]">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Mật khẩu *"
                        className="w-full h-[48px] border border-[#DADADA] rounded-xl pl-4 pr-12 outline-none focus:border-brand-accent transition-all placeholder:text-gray-400 text-[14px]"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Password Criteria */}
                <div className="w-[400px] grid grid-cols-2 gap-y-2">
                    {passwordCriteria.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {item.valid ? (
                                <AiFillCheckCircle className="text-green-500 text-[16px]" />
                            ) : (
                                <AiOutlineCheckCircle className="text-gray-300 text-[16px]" />
                            )}
                            <span className={`text-[11px] ${item.valid ? 'text-gray-700' : 'text-gray-500'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Điều khoản */}
                <div className="w-[400px] flex items-start gap-3 mt-2">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            className="w-5 h-5 accent-brand-accent cursor-pointer rounded"
                        />
                    </div>
                    <p className="text-[13px] leading-5 text-[#222222]">
                        Bằng việc Đăng ký, bạn đã đọc và đồng ý với <a href="#" className="text-blue-600">Điều khoản sử dụng</a> và <a href="#" className="text-blue-600">Chính sách bảo mật</a> của Chợ Sinh Viên
                    </p>
                </div>

                {/* Nút Tiếp tục */}
                <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className={`w-[400px] h-[48px] text-[16px] font-bold rounded-xl transition-all ${
                        isFormValid && !loading
                            ? "bg-brand-accent text-black hover:brightness-105"
                            : "bg-[#F4F4F4] text-[#8C8C8C] cursor-not-allowed"
                    }`}
                >
                    {loading ? "Đang xử lý..." : "Tiếp tục"}
                </button>
            </form>

            <div className="text-[14px] text-[#666666] mt-6">
                Đã có tài khoản?{" "}
                <a href="/login" className="text-[#1877F2] font-semibold hover:underline">
                    Đăng nhập ngay
                </a>
            </div>

            {/* Footer */}
            <div className="w-full mt-8 flex justify-between items-center text-[12px] text-[#8C8C8C] px-2">
                <a href="#" className="hover:underline">Quy chế hoạt động sàn</a>
                <div className="h-3 w-px bg-gray-300"></div>
                <a href="#" className="hover:underline">Chính sách bảo mật</a>
                <div className="h-3 w-px bg-gray-300"></div>
                <a href="#" className="hover:underline">Liên hệ hỗ trợ</a>
            </div>
        </div>
    );
};

export default RegisterForm;
