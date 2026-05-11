import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Camera, Save } from 'lucide-react';

const ProfileSettingsCard = () => {
    const [profile, setProfile] = useState({
        fullName: 'Nguyễn Hữu Phúc',
        phone: '0987654321',
        email: 'phuc@example.com',
        address: 'Đại học Bách Khoa Hà Nội',
        bio: 'Sinh viên năm 4, thích trao đổi đồ công nghệ.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phuc'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log('Saving profile:', profile);
        alert('Đã lưu thay đổi hồ sơ!');
    };

    return (
        <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-[#222222]">Hồ sơ cá nhân</h2>
                    <p className="text-xs text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn để bảo mật tài khoản</p>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                        <div className="relative group">
                            <img 
                                src={profile.avatar} 
                                alt="Avatar" 
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                            />
                            <button 
                                type="button"
                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <Camera size={16} className="text-[#222222]" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-[#222222]">Ảnh đại diện</h3>
                            <p className="text-xs text-gray-400">Dung lượng file tối đa 1MB. Định dạng: .JPEG, .PNG</p>
                            <button 
                                type="button"
                                className="mt-2 text-sm font-semibold text-[#1877F2] hover:underline w-fit"
                            >
                                Chọn ảnh
                            </button>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Họ và tên */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={profile.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs text-[#222222]"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs text-[#222222]"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs text-[#222222]"
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" />
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs text-[#222222]"
                            />
                        </div>
                    </div>

                    {/* Bio / Giới thiệu */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#222222]">Giới thiệu ngắn</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Kể gì đó về bản thân bạn..."
                            className="w-full p-3 border border-[#DADADA] rounded-lg outline-none focus:border-[#FFBA00] transition-all bg-white text-xs text-[#222222] resize-none"
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            className="px-4 h-10 text-xs font-semibold text-gray-500 hover:text-[#222222] transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-6 h-10 bg-[#FFBA00] text-black text-xs font-bold rounded-lg hover:brightness-105 shadow-sm transition-all flex items-center gap-2"
                        >
                            <Save size={16} />
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettingsCard;
