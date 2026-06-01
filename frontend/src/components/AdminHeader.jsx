import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, User, LogOut, Settings, ShoppingBag, Shield } from 'lucide-react';

const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/admin/dashboard')) return 'Tổng quan hệ thống';
    if (path.startsWith('/admin/products')) return 'Quản lý sản phẩm';
    if (path.startsWith('/admin/orders')) return 'Quản lý đơn hàng';
    if (path.startsWith('/admin/users')) return 'Quản lý người dùng';
    if (path.startsWith('/admin/categories')) return 'Quản lý danh mục';
    if (path.startsWith('/admin/reports')) return 'Quản lý báo cáo';
    if (path.startsWith('/admin/transactions')) return 'Lịch sử giao dịch';
    return 'Quản trị hệ thống';
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <header className="h-20 bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
      
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-950 transition-colors lg:hidden cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900 font-display">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Icon (Mock) */}
        <button className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-950 transition-colors relative cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 px-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-yellow-600" />
              )}
            </div>

            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-gray-800 line-clamp-1">
                {user?.fullName || 'Quản trị viên'}
              </span>
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-yellow-600 bg-yellow-50 border border-yellow-100 px-1 rounded">
                <Shield size={8} className="fill-yellow-600/10" /> {user?.role || 'admin'}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <span className="block text-xs font-bold text-gray-800 truncate">
                  {user?.fullName || 'Admin Account'}
                </span>
                <span className="block text-[10px] text-gray-400 truncate mt-0.5">
                  {user?.email || 'admin@tmdt.com'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Settings size={15} className="text-gray-400" />
                  <span>Cá nhân & Bảo mật</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ShoppingBag size={15} className="text-gray-400" />
                  <span>Về cửa hàng</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={15} className="text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
