import React from 'react';
import { SiFacebook, SiYoutube } from 'react-icons/si';
import { LuMail, LuPhone, LuMapPin } from 'react-icons/lu';

const Footer = () => {
    const footerLinks = {
        support: [
            "Trung tâm trợ giúp",
            "An toàn mua bán",
            "Liên hệ hỗ trợ"
        ],
        about: [
            "Giới thiệu",
            "Quy chế hoạt động sàn",
            "Chính sách bảo mật",
            "Giải quyết tranh chấp",
            "Tuyển dụng",
            "Truyền thông",
            "Blog"
        ]
    };

    return (
        <footer className="w-full bg-white border-t border-gray-100 font-['Reddit_Sans']">
            {/* Upper Footer: 4 columns on desktop */}
            <div className="max-w-[1200px] mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Column 1: Download App */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-[#222222] text-sm uppercase">Tải ứng dụng Chợ Tốt</h4>
                        <div className="flex gap-4 items-center">
                            <div className="w-[87px] h-[87px] bg-gray-100 rounded-lg flex items-center justify-center">
                                <img src="https://placehold.co/87x87" alt="QR Code" className="w-full h-full p-1" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <img src="https://placehold.co/116x39" alt="App Store" className="h-[35px] w-auto cursor-pointer" />
                                <img src="https://placehold.co/116x39" alt="Google Play" className="h-[35px] w-auto cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Support */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-[#222222] text-sm uppercase">Hỗ trợ khách hàng</h4>
                        <ul className="flex flex-col gap-2">
                            {footerLinks.support.map((link) => (
                                <li key={link} className="text-[#595959] text-sm hover:text-[#FFBA00] cursor-pointer transition-colors">
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: About */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold text-[#222222] text-sm uppercase">Về Chợ Tốt</h4>
                        <ul className="flex flex-col gap-2">
                            {footerLinks.about.map((link) => (
                                <li key={link} className="text-[#595959] text-sm hover:text-[#FFBA00] cursor-pointer transition-colors">
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact & Social */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-[#222222] text-sm uppercase">Liên kết</h4>
                            <div className="flex gap-3 text-2xl">
                                <SiFacebook className="text-[#1877F2] cursor-pointer hover:opacity-80" />
                                <SiYoutube className="text-[#FF0000] cursor-pointer hover:opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info Detail */}
                <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-[#595959] text-sm">
                    <div className="flex items-start gap-2">
                        <LuMail className="mt-1 shrink-0" />
                        <span>Email: trogiup@chosinhvien.vn</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <LuPhone className="mt-1 shrink-0" />
                        <span>CSKH: 1900XXXX (1.000đ/phút)</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <LuMapPin className="mt-1 shrink-0" />
                        <span>Địa chỉ: Trường Đại học Nông Lâm Thành phố Hồ Chí Minh</span>
                    </div>
                </div>
            </div>

            {/* Bottom Footer: Legal Info */}
            <div className="w-full bg-gray-50 py-6">
                <div className="max-w-[1200px] mx-auto px-4 text-center md:text-left">
                    <p className="text-[11px] text-[#8C8C8C] leading-relaxed">
                        CÔNG TY TNHH CHỢ SINH VIÊN
                        <br />
                        <a href="#" className="text-[#306BD9] underline hover:text-blue-800">Chính sách sử dụng</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;