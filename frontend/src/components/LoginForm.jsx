import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email: email,
                password: password
            });

            // Backend trả về LoginResponse (token, fullName, role)
            const data = response.data;

            // Lưu token vào localStorage để dùng cho các request sau
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            navigate("/"); // Chuyển về trang chủ
            window.location.reload(); // Reload để Header cập nhật trạng thái user
        } catch (error) {
            alert(error.response?.data || "Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.");
        }
    };
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const fullName = params.get("fullName");
        const role = params.get("role");

        if (token) {
            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify({ token, fullName, role })
            );

            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="w-[480px] bg-white rounded-2xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-10 flex flex-col items-center">
            {/* Tiêu đề: Bold 20px */}
            <h3 className="text-[20px] font-bold text-[#222222] mb-8 leading-7">
                Đăng nhập/Đăng ký
            </h3>

            {/* Social Buttons Section */}
            <div className="flex flex-col gap-3 w-full items-center mb-6">
                {/* Nút Google: 400x48 */}
                <button
                    type="button"
                    onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                    className="w-[400px] h-[48px] flex items-center px-4 rounded-full border border-[#DADADA] hover:bg-gray-50 transition-all group"
                >
                    <FcGoogle className="text-[24px]" />
                    <span className="flex-1 text-center text-[16px] font-bold text-[#222222]">
                        Tiếp tục với Google
                    </span>
                </button>

                {/* Nút Facebook: 400x48 */}
                <button
                    type="button"
                    onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/facebook"}
                    className="w-[400px] h-[48px] flex items-center px-4 rounded-full border border-[#DADADA] hover:bg-gray-50 transition-all"
                >
                    <SiFacebook className="text-[#1877F2] text-[24px]" />
                    <span className="flex-1 text-center text-[16px] font-bold text-[#222222]">
                        Tiếp tục với Facebook
                    </span>
                </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 w-[400px] mb-6">
                <div className="flex-1 h-px bg-[#F4F4F4]"></div>
                <span className="text-[14px] font-normal text-[#8C8C8C]">Hoặc</span>
                <div className="flex-1 h-px bg-[#F4F4F4]"></div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4 items-center">
                {/* Input Email: 400x48, text-center để placeholder ở giữa */}
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl outline-none pl-4 focus:border-[#FFBA00] transition-all bg-white text-[14px] text-[#222222] placeholder:text-[#8C8C8C]"
                />

                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    className="w-[400px] h-[48px] border border-[#DADADA] rounded-xl outline-none pl-4 focus:border-[#FFBA00] transition-all bg-white text-[14px] text-[#222222] placeholder:text-[#8C8C8C]"
                />

                <div className="w-[400px] text-right -mt-2">
                    <a href="#" className="text-[14px] text-[#1877F2] hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>

                <div className="text-[14px] text-[#666666]">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-[#1877F2] font-semibold hover:underline">
                        Đăng ký mới
                    </a>
                </div>

                {/* Nút Tiếp tục: 400x48 */}
                <button
                    type="submit"
                    disabled={!email}
                    className={`w-[400px] h-[48px] text-[16px] font-bold rounded-lg transition-all ${
                        email
                            ? "bg-[#FFBA00] text-black hover:brightness-105 shadow-sm"
                            : "bg-[#F4F4F4] text-[#8C8C8C] cursor-not-allowed"
                    }`}
                >
                    Tiếp tục
                </button>
            </form>

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

export default LoginForm;