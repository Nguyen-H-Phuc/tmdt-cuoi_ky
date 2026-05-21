import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
    Pencil, 
    Heart, 
    Bookmark, 
    History, 
    Star, 
    Coins, 
    ShieldCheck, 
    LogOut, 
    ChevronRight,
    MessageCircle
} from 'lucide-react';

// Sử dụng Lucide icons thay thế cho SVG cũ
const ICONS = {
    EDIT: <Pencil size={14} className="text-white" />,
    SAVED_POSTS: <Heart size={18} className="text-gray-400" />,
    SAVED_SEARCH: <Bookmark size={18} className="text-gray-400" />,
    HISTORY: <History size={18} className="text-gray-400" />,
    RATINGS: <Star size={18} className="text-gray-400" />,
    CHOTOT_COIN: <Coins size={18} className="text-amber-500" />,
    PRO: <ShieldCheck size={18} className="text-rose-500" />,
    LOGOUT: <LogOut size={18} className="text-rose-500" />,
    ARROW_RIGHT: <ChevronRight size={16} className="text-gray-400" />,
};

const MenuItem = ({ icon, label, extra, isLogout, onClick }) => (
    <div 
        onClick={onClick}
        className="flex items-center justify-between px-3 py-2 bg-white hover:bg-neutral-50 cursor-pointer transition-colors border-b border-neutral-50 last:border-none"
    >
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
            <span className={`text-xs font-bold leading-5 ${isLogout ? 'text-rose-500' : 'text-zinc-600'}`}>
                {label}
            </span>
        </div>
        <div className="flex items-center gap-2">
            {extra}
            {ICONS.ARROW_RIGHT}
        </div>
    </div>
);

const SectionHeader = ({ title }) => (
    <div className="w-full px-3 py-1.5 bg-neutral-100">
        <h3 className="text-neutral-400 text-[10px] font-bold leading-4 uppercase tracking-tight">
            {title}
        </h3>
    </div>
);

const PopupProfile = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const fullName = user?.fullName || "Khách";
    const avatarUrl = user?.avatar || "https://placehold.co/80x80";

    const handleLogout = (e) => {
        e.stopPropagation();
        logout(); 
        // Thay vì dùng navigate của React Router, ta ép trình duyệt tải lại trang luôn
        // Điều này đảm bảo toàn bộ state, URL params, và bộ nhớ đệm được dọn sạch 100%
        // Chuyển hướng về trang chủ thay vì trang login
        window.location.href = "/";
    };

    return (
        <>
            {/* Backdrop to close on click outside */}
            <div className="fixed inset-0 z-[90]" onClick={onClose}></div>
            
            <div 
                className="absolute top-[56px] right-4 w-72 bg-neutral-100 rounded-xl shadow-2xl border-4 border-white overflow-hidden flex flex-col z-[100] max-h-[calc(100vh-80px)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* User Profile Section (Fixed) */}
                <div className="shrink-0 p-4 flex flex-col items-center gap-3">
                    <div className="relative">
                        <img className="w-14 h-14 rounded-full border border-neutral-200 object-cover" src={avatarUrl} alt="Avatar" />
                        <div className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 bg-brand-accent rounded-full p-1 border-2 border-white">
                            {ICONS.EDIT}
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-neutral-800 text-base font-bold leading-5">{fullName}</h2>
                        <div className="flex gap-3 mt-1 justify-center">
                            <span className="text-[10px] text-neutral-400">Follower <b className="text-neutral-800 font-medium">0</b></span>
                            <span className="text-[10px] text-neutral-400">Following <b className="text-neutral-800 font-medium">0</b></span>
                        </div>
                    </div>

                    {/* Wallet Info */}
                    <div className="w-full bg-white p-3 rounded-xl space-y-3 shadow-sm border border-neutral-100">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-400 text-[10px] font-medium uppercase">Đồng Tốt</span>
                            <div className="flex items-center gap-1">
                                <span className="text-neutral-800 text-xs font-bold">0</span>
                                <div className="w-4 h-4 flex items-center justify-center scale-90">{ICONS.CHOTOT_COIN}</div>
                            </div>
                        </div>
                        <button className="w-full h-7 bg-brand-primary hover:bg-brand-hover rounded-lg text-neutral-800 text-xs font-bold transition-all active:scale-[0.98]">
                            Nạp ngay
                        </button>
                    </div>
                </div>

                {/* Menu List (Scrollable) */}
                <div className="flex-1 overflow-y-auto">
                    <SectionHeader title="Tiện ích" />
                    <MenuItem label="Hộp thư nhắn tin" icon={<MessageCircle size={18} className="text-gray-400" />} onClick={() => { navigate('/chat'); onClose(); }} />
                    <MenuItem label="Tin đăng đã lưu" icon={ICONS.SAVED_POSTS} />
                    <MenuItem label="Tìm kiếm đã lưu" icon={ICONS.SAVED_SEARCH} />
                    <MenuItem label="Lịch sử xem tin" icon={ICONS.HISTORY} />
                    <MenuItem label="Đánh giá từ tôi" icon={ICONS.RATINGS} />

                    <SectionHeader title="Dịch vụ trả phí" />
                    <MenuItem label="Đồng Tốt" icon={ICONS.CHOTOT_COIN} />
                    <MenuItem label="Gói PRO" icon={ICONS.PRO} />
                    <MenuItem
                        label="Cửa hàng / chuyên trang"
                        icon={ICONS.HISTORY}
                    />

                    <SectionHeader title="Khác" />
                    <MenuItem label="Cài đặt tài khoản" icon={ICONS.HISTORY} onClick={() => { navigate('/profile'); onClose(); }} />
                    <MenuItem label="Đăng xuất" icon={ICONS.LOGOUT} isLogout onClick={handleLogout} />
                    {/* Padding bottom to ensure space */}
                    <div className="h-4"></div>
                </div>
            </div>
        </>
    );
};

export default PopupProfile;