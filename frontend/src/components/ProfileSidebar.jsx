import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    // Settings, 
    // Bell, 
    ShieldCheck, 
    // Heart, 
    ShoppingBag, 
    LogOut,
    // CreditCard,
    Package,
    Star,
    BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'profile', icon: <User size={18} />, label: 'Thông tin cá nhân' },
        { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Quản lý đơn hàng' },
        { id: 'my-products', icon: <Package size={18} />, label: 'Quản lý bài đăng' },
        { id: 'my-reviews', icon: <Star size={18} />, label: 'Quản lý đánh giá' },
        { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Thống kê doanh thu' },
        // { id: 'favorites', icon: <Heart size={18} />, label: 'Sản phẩm yêu thích' },
        // { id: 'notifications', icon: <Bell size={18} />, label: 'Thông báo' },
        // { id: 'payments', icon: <CreditCard size={18} />, label: 'Ví & Thanh toán' },
        { id: 'security', icon: <ShieldCheck size={18} />, label: 'Bảo mật tài khoản' },
        // { id: 'settings', icon: <Settings size={18} />, label: 'Cài đặt' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="w-full md:w-64 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] overflow-hidden h-fit">
            {/* User Profile Summary */}
            <div className="p-4 bg-brand-accent flex flex-col items-center gap-2">
                <img 
                    src={(!user?.avatar || user.avatar === 'null' || user.avatar === 'undefined') 
                        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'Default'}` 
                        : user.avatar} 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="text-center">
                    <h3 className="text-sm font-bold text-[#222222]">{user?.fullName || 'Khách'}</h3>
                    <p className="text-[10px] font-medium text-black/60">
                        Thành viên từ {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-1.5">
                <ul className="flex flex-col gap-0.5">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                    activeTab === item.id 
                                        ? 'bg-brand-accent/10 text-[#222222] font-bold' 
                                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                            >
                                <span className={activeTab === item.id ? 'text-brand-accent' : 'text-gray-400'}>
                                    {item.icon}
                                </span>
                                <span className="text-xs">{item.label}</span>
                            </button>
                        </li>
                    ))}
                    <li className="mt-2 pt-2 border-t border-gray-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 font-bold transition-all text-xs cursor-pointer"
                        >
                            <LogOut size={18} />
                            Đăng xuất
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ProfileSidebar;
