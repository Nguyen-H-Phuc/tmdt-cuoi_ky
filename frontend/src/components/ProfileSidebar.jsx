import React from 'react';
import { 
    User, 
    Settings, 
    Bell, 
    ShieldCheck, 
    Heart, 
    ShoppingBag, 
    LogOut,
    CreditCard
} from 'lucide-react';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'profile', icon: <User size={18} />, label: 'Thông tin cá nhân' },
        { id: 'orders', icon: <ShoppingBag size={18} />, label: 'Quản lý đơn hàng' },
        { id: 'favorites', icon: <Heart size={18} />, label: 'Sản phẩm yêu thích' },
        { id: 'notifications', icon: <Bell size={18} />, label: 'Thông báo' },
        { id: 'payments', icon: <CreditCard size={18} />, label: 'Ví & Thanh toán' },
        { id: 'security', icon: <ShieldCheck size={18} />, label: 'Bảo mật tài khoản' },
        { id: 'settings', icon: <Settings size={18} />, label: 'Cài đặt' },
    ];

    return (
        <div className="w-full md:w-64 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] overflow-hidden h-fit">
            {/* User Profile Summary */}
            <div className="p-4 bg-brand-accent flex flex-col items-center gap-2">
                <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Phuc" 
                    alt="Avatar" 
                    className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
                />
                <div className="text-center">
                    <h3 className="text-sm font-bold text-[#222222]">Nguyễn Hữu Phúc</h3>
                    <p className="text-[10px] font-medium text-black/60">Thành viên từ 2024</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-1.5">
                <ul className="flex flex-col gap-0.5">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
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
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 font-bold transition-all text-xs">
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
