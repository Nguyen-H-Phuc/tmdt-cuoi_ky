import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios';

const VerifyForm = ({ email, onBack, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post("http://localhost:8080/api/auth/verify-otp", {
                email: email,
                otp: otp
            });
            alert("Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập.");
            onSuccess();
        } catch (err) {
            setError(err.response?.data || "Mã xác thực không chính xác hoặc đã hết hạn.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[480px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-10 flex flex-col items-center">
            {/* Header Section */}
            <div className="w-full flex items-center gap-4 mb-2">
                <button 
                    onClick={onBack}
                    className="text-xl text-gray-700 hover:bg-gray-100 p-1 rounded-lg transition-all"
                >
                    <IoMdArrowBack />
                </button>
                <h3 className="text-[20px] font-bold text-[#222222]">Xác thực tài khoản</h3>
            </div>

            {/* Info Section */}
            <div className="w-full mb-8">
                <p className="text-[14px] text-gray-500 leading-relaxed">
                    Mã xác thực đã được gửi đến email <span className="font-bold text-black">{email}</span>. Vui lòng kiểm tra hộp thư của bạn.
                </p>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col gap-6 items-center w-full">
                {/* OTP Input */}
                <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP (6 chữ số)"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl outline-none pl-4 focus:border-[#FFBA00] transition-all bg-white text-[14px] text-[#222222] placeholder:text-[#8C8C8C] text-center tracking-[0.5em] font-bold"
                />

                {error && <p className="text-red-500 text-[13px] w-[400px] text-center">{error}</p>}

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={otp.length < 6 || loading}
                    className={`w-[400px] h-[48px] text-[16px] font-bold rounded-lg transition-all ${
                        otp.length === 6 && !loading
                            ? "bg-[#FFBA00] text-black hover:brightness-105 shadow-sm"
                            : "bg-[#F4F4F4] text-[#8C8C8C] cursor-not-allowed"
                    }`}
                >
                    {loading ? "Đang xử lý..." : "Xác thực"}
                </button>
            </form>

            {/* Footer / Resend */}
            <div className="mt-8 text-[14px] text-[#666666]">
                Không nhận được mã?{" "}
                <button className="text-[#1877F2] font-semibold hover:underline">
                    Gửi lại mã
                </button>
            </div>

            <div className="w-full mt-10 flex justify-between items-center text-[12px] text-[#8C8C8C] px-2">
                <a href="#" className="hover:underline">Quy chế hoạt động sàn</a>
                <div className="h-3 w-px bg-gray-300"></div>
                <a href="#" className="hover:underline">Chính sách bảo mật</a>
                <div className="h-3 w-px bg-gray-300"></div>
                <a href="#" className="hover:underline">Liên hệ hỗ trợ</a>
            </div>
        </div>
    );
};

export default VerifyForm;
