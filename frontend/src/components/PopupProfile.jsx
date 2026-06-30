import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
    Pencil, 
    ShieldCheck, 
    LogOut, 
    ChevronRight,
    ShoppingBag,
    User
} from 'lucide-react';

const ICONS = {
    EDIT: <Pencil size={14} className="text-white" />,
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

const PopupProfile = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const fullName = user?.fullName || "Khách";
    const avatarUrl = (!user?.avatar || user.avatar === 'null' || user.avatar === 'undefined')
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName || 'Default'}`
        : user.avatar;

    const handleLogout = (e) => {
        e.stopPropagation();
        logout(); 
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
                </div>

                {/* Menu List */}
                <div className="flex-1 overflow-y-auto">
                    {user?.role === 'admin' && (
                        <MenuItem 
                            label="Trang Quản trị" 
                            icon={<ShieldCheck size={18} className="text-blue-600" />} 
                            onClick={() => { navigate('/admin/dashboard'); onClose(); }} 
                        />
                    )}
                    <MenuItem 
                        label="Cửa hàng" 
                        icon={<ShoppingBag size={18} className="text-emerald-500" />} 
                        onClick={() => { navigate(`/seller/${user?.userId}`); onClose(); }} 
                    />
                    <MenuItem 
                        label="Cài đặt tài khoản" 
                        icon={<User size={18} className="text-gray-400" />} 
                        onClick={() => { navigate('/profile'); onClose(); }} 
                    />
                    <MenuItem 
                        label="Đăng xuất" 
                        icon={ICONS.LOGOUT} 
                        isLogout 
                        onClick={handleLogout} 
                    />
                    <div className="h-4"></div>
                </div>
            </div>
        </>
    );
};

export default PopupProfile;