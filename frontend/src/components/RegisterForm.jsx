import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        password: '',
    });
    const [agreed, setAgreed] = useState(true);

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

    const isFormValid = formData.fullName && formData.password && agreed && passwordCriteria.every(c => c.valid);

    return (
        <div className="w-[480px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-10 flex flex-col items-center">

            {/* Header Section */}
            <div className="w-full flex items-center gap-4 mb-2">
                <button className="text-xl text-gray-700 hover:bg-gray-100 p-1 rounded-lg transition-all">
                    <IoMdArrowBack />
                </button>
                <h3 className="text-[20px] font-bold text-[#222222]">Đăng ký tài khoản mới</h3>
            </div>

            {/* Phần Text: Đã bỏ mb-auto, thay bằng mb-10 để tách biệt rõ rệt với Form */}
            <div className="w-full mb-2">
                <p className="text-[14px] text-gray-500 leading-relaxed">
                    Nhập mật khẩu để đăng ký <span className="font-bold text-black">example@email.com</span>
                </p>
            </div>

            <form className="flex flex-col gap-4 items-center">
                {/* Input Họ và tên: 400x48px, text-center để placeholder nằm giữa */}
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên *"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl px-4 outline-none focus:border-[#FFBA00] transition-all placeholder:text-gray-400 text-[14px]"
                />

                {/* Input Mật khẩu: 400x48px, text-center để placeholder nằm giữa */}
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu *"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl px-4 outline-none focus:border-[#FFBA00] transition-all placeholder:text-gray-400 text-[14px]"
                />

                {/* Password Criteria: Căn chỉnh lại để rộng 400px cho cân đối */}
                <div className="w-[400px] grid grid-cols-2 gap-x-2">
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

                {/* Điều khoản: Rộng 400px */}
                <div className="w-[400px] flex items-start gap-3">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            className="w-5 h-5 accent-[#FFBA00] cursor-pointer rounded"
                        />
                    </div>
                    <p className="text-[13px] leading-5 text-[#222222]">
                        Bằng việc Đăng ký, bạn đã đọc và đồng ý với <a href="#" className="text-blue-600">Điều khoản sử dụng</a> và <a href="#" className="text-blue-600">Chính sách bảo mật</a> của Chợ Tốt
                    </p>
                </div>

                {/* Nút Tiếp tục: 400x48px */}
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-[400px] h-[48px] text-[16px] font-bold rounded-xl transition-all ${
                        isFormValid
                            ? "bg-[#FFBA00] text-black hover:brightness-105"
                            : "bg-[#F4F4F4] text-[#8C8C8C] cursor-not-allowed"
                    }`}
                >
                    Tiếp tục
                </button>
            </form>

            {/* Footer */}
            <div className="w-full mt-4 flex justify-between items-center text-[12px] text-[#8C8C8C] px-2">
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