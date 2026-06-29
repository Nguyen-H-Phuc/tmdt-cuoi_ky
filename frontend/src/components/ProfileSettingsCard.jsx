import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, MapPin, Camera, Save, Loader2, AlertCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const ProfileSettingsCard = () => {
    const { user: currentUser, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        bio: '',
        university: '',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default'
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser?.userId) return;
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/users/profile/${currentUser.userId}`);
                const data = response.data;
                const fetchedAvatar = (!data.avatar || data.avatar === 'null' || data.avatar === 'undefined')
                    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName || 'Default'}`
                    : data.avatar;
                setProfile({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    address: data.address || '',
                    bio: data.bio || '',
                    university: data.university || '',
                    avatar: fetchedAvatar
                });
                
                // Sync fetched data to AuthContext so other components like Sidebar receive the updated avatar/name
                updateUser({
                    ...currentUser,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    avatar: data.avatar,
                    address: data.address,
                    bio: data.bio,
                    university: data.university
                });
            } catch (error) {
                console.error("Lỗi fetch thông tin người dùng:", error);
                setMessage({ type: 'error', text: 'Không thể tải thông tin tài khoản.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser?.userId, updateUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 1MB)
        if (file.size > 1024 * 1024) {
            setMessage({ type: 'error', text: 'Dung lượng file tối đa là 1MB.' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://localhost:8080/api/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const newAvatarUrl = response.data.avatarUrl;

            // Lưu trực tiếp vào database ngay khi upload thành công
            await axios.put(`http://localhost:8080/api/users/profile/${currentUser.userId}`, {
                fullName: profile.fullName || currentUser.fullName,
                phone: profile.phone || currentUser.phone,
                email: profile.email || currentUser.email,
                address: profile.address || currentUser.address,
                bio: profile.bio || currentUser.bio,
                avatar: newAvatarUrl
            });

            setProfile(prev => ({ ...prev, avatar: newAvatarUrl }));

            // Cập nhật AuthContext lập tức để thay đổi avatar bên sidebar & header dropdown
            updateUser({
                ...currentUser,
                avatar: newAvatarUrl
            });

            setMessage({ type: 'success', text: 'Tải ảnh đại diện lên thành công!' });
        } catch (error) {
            console.error("Lỗi upload avatar:", error);
            const errMsg = error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên.';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentUser?.userId) return;
        
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        
        try {
            const response = await axios.put(`http://localhost:8080/api/users/profile/${currentUser.userId}`, {
                fullName: profile.fullName,
                phone: profile.phone,
                email: profile.email,
                address: profile.address,
                bio: profile.bio,
                university: profile.university,
                avatar: profile.avatar
            });
            
            const updatedUser = response.data;
            updateUser({
                ...currentUser,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                address: updatedUser.address,
                bio: updatedUser.bio,
                university: updatedUser.university
            });
            
            setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
            const errMsg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin.';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-12 flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <span className="text-xs text-gray-500 font-bold">Đang tải thông tin cá nhân...</span>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-[#222222]">Hồ sơ cá nhân</h2>
                    <p className="text-xs text-gray-500 mt-1">Quản lý thông tin cá nhân của bạn để bảo mật tài khoản</p>
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

                <form onSubmit={handleSave} className="flex flex-col gap-6">
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />

                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                        <div 
                            onClick={handleAvatarClick}
                            className="relative group cursor-pointer"
                        >
                            <img 
                                src={profile.avatar} 
                                alt="Avatar" 
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 group-hover:brightness-95 transition-all"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center">
                                    <Loader2 className="animate-spin text-white" size={24} />
                                </div>
                            )}
                            <button 
                                type="button"
                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <Camera size={16} className="text-[#222222]" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-[#222222]">Ảnh đại diện</h3>
                            <p className="text-xs text-gray-400">Dung lượng file tối đa 1MB. Định dạng: .JPEG, .PNG, .WEBP</p>
                            <button 
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={isUploading}
                                className="mt-2 text-sm font-semibold text-[#1877F2] hover:underline w-fit cursor-pointer disabled:opacity-50"
                            >
                                {isUploading ? 'Đang tải ảnh...' : 'Chọn ảnh'}
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
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs text-[#222222]"
                                required
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
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs text-[#222222]"
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
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs text-[#222222]"
                                required
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
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs text-[#222222]"
                            />
                        </div>

                        {/* Trường học */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#222222] flex items-center gap-2">
                                <GraduationCap size={14} className="text-gray-400" />
                                Trường học (Đại học / Cao đẳng)
                            </label>
                            <input
                                type="text"
                                name="university"
                                value={profile.university}
                                onChange={handleChange}
                                placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
                                className="w-full h-10 px-3 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs text-[#222222]"
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
                            className="w-full p-3 border border-[#DADADA] rounded-lg outline-none focus:border-brand-accent transition-all bg-white text-xs text-[#222222] resize-none"
                            maxLength={500}
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (currentUser) {
                                    setProfile({
                                        fullName: currentUser.fullName || '',
                                        phone: currentUser.phone || '',
                                        email: currentUser.email || '',
                                        address: currentUser.address || '',
                                        bio: currentUser.bio || '',
                                        avatar: currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default'
                                    });
                                }
                            }}
                            className="px-4 h-10 text-xs font-semibold text-gray-500 hover:text-[#222222] transition-colors cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="px-6 h-10 bg-brand-primary hover:bg-brand-hover text-black disabled:bg-gray-200 disabled:text-gray-400 text-xs font-bold rounded-lg hover:brightness-105 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettingsCard;
