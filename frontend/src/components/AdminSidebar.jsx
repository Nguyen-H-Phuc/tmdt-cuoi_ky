import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList,
  Users, 
  FolderTree, 
  AlertTriangle, 
  Landmark, 
  ShoppingBag, 
  LogOut,
  X,
  BarChart2
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reviews/reports');
        const count = response.data.filter(r => r.status === 'PENDING').length;
        setPendingCount(count);
      } catch (error) {
        console.error('Error fetching reports count for sidebar:', error);
      }
    };
    fetchPendingCount();
  }, []);

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/statistics',
      label: 'Thống kê chi tiết',
      icon: BarChart2,
    },
    {
      path: '/admin/products',
      label: 'Sản phẩm',
      icon: Package,
    },
    {
      path: '/admin/orders',
      label: 'Đơn hàng',
      icon: ClipboardList,
    },
    {
      path: '/admin/users',
      label: 'Thành viên',
      icon: Users,
    },
    {
      path: '/admin/categories',
      label: 'Danh mục',
      icon: FolderTree,
    },
    {
      path: '/admin/reports',
      label: 'Báo cáo đánh giá',
      icon: AlertTriangle,
    },
    {
      path: '/admin/transactions',
      label: 'Lịch sử giao dịch',
      icon: Landmark,
    },
  ];

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-45 flex flex-col w-72 bg-gray-900 text-gray-300 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800/80">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center font-bold text-gray-950 font-display text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-bold text-white font-display text-base tracking-wide">
                Chợ Sinh Viên
              </span>
              <span className="block text-[10px] text-brand-primary font-bold tracking-widest uppercase">
                Admin Panel
              </span>
            </div>
          </div>
          {/* Close button on Mobile */}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors lg:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all group cursor-pointer
                  ${isActive 
                    ? 'bg-brand-primary text-gray-950 shadow-[0_4px_12px_rgba(255,212,0,0.15)] font-extrabold' 
                    : 'hover:bg-gray-850 hover:text-white text-gray-400'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      size={18} 
                      className={`transition-colors shrink-0 ${
                        isActive ? 'text-gray-950' : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.path === '/admin/reports' && pendingCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 animate-pulse transition-all ${
                        isActive 
                          ? 'bg-gray-950 text-brand-primary' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {pendingCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-gray-800/80 space-y-1.5">
          <button
            onClick={() => {
              onClose();
              navigate('/');
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-850 hover:text-white transition-all cursor-pointer"
          >
            <ShoppingBag size={18} className="text-gray-500 shrink-0" />
            <span>Về Cửa Hàng</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut size={18} className="text-red-500/80 shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
