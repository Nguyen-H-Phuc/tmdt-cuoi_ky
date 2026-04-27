import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  Menu,
  MapPin,
  Search,
  X,
  Heart,
  Bell,
  MessageCircle,
  User,
  ChevronDown,
} from 'lucide-react';
import '../index.css';

const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  return (
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Container giới hạn chiều rộng tối đa 1920px */}
        <div className="max-w-[1920px] mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-4">

          {/* LEFT: Logo & Menu Icon */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu size={24} className="text-gray-800" />
            </button>
            <img
                src={logo}
                alt="Chợ Sinh Viên"
                onClick={() => navigate('/')}
                className="h-10 w-auto object-contain cursor-pointer"
            />
          </div>

          {/* MIDDLE: Search Bar (Responsive: ẩn bớt trên mobile cực nhỏ) */}
          <div className="flex-1 max-w-4xl hidden sm:flex items-center gap-0">
            {/* Location Selector */}
            <div className="h-10 flex items-center gap-1 bg-[#F4F4F4] rounded-l-full px-4 border-r border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors shrink-0">
              <MapPin size={18} className="text-[#FFBA00]" fill="currentColor" fillOpacity={0.2} />
              <span className="text-sm font-semibold whitespace-nowrap hidden lg:inline">Toàn quốc</span>
              <ChevronDown size={14} />
            </div>

            {/* Input Search */}
            <div className="flex-1 h-10 flex items-center bg-[#F4F4F4] rounded-r-full px-3 relative group">
              <Search size={18} className="text-gray-500 shrink-0" />
              <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm trên Chợ Tốt"
                  className="bg-transparent w-full h-full px-2 text-sm outline-none text-gray-800"
              />
              {searchValue && (
                  <button
                      onClick={() => setSearchValue('')}
                      className="p-1 hover:bg-gray-300 rounded-full transition-colors"
                  >
                    <X size={14} className="text-gray-600" />
                  </button>
              )}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            {/* Icons chỉ hiện trên desktop/tablet */}
            <div className="hidden lg:flex items-center gap-1">
              <HeaderButton icon={<Heart size={20} />} />
              <HeaderButton icon={<Bell size={20} />} />
              <HeaderButton icon={<MessageCircle size={20} />} label="Liên hệ" />
            </div>

            {/* Login Button */}
            {!isLogin && (
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-2 hidden sm:flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-semibold text-gray-900">Đăng nhập</span>
              </button>
            )}

            {/* Đăng tin Button - Màu vàng đặc trưng */}
            <button className="px-4 py-2 sm:flex items-center justify-center gap-1 bg-[#FFD400] hover:bg-[#e6bf00] rounded-full transition-all shadow-sm">
              <span className="text-sm font-semibold text-gray-900">Đăng tin</span>
            </button>

            {/* User Profile Dropdown */}
            <button className="w-[77px] h-10 flex items-center justify-center gap-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
              <User size={18} className="text-gray-900"/>
              <ChevronDown size={18} className="hidden md:block text-gray-900"/>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Chỉ hiện trên mobile dưới thanh chính) */}
        <div className="p-2 sm:hidden border-t border-gray-50">
          <div className="flex items-center bg-[#F4F4F4] rounded-lg px-3 h-10">
            <Search size={18} className="text-gray-400" />
            <input
                type="text"
                placeholder="Tìm kiếm trên Chợ Tốt"
                className="bg-transparent w-full h-full px-2 text-sm outline-none"
            />
          </div>
        </div>
      </header>
  );
};

// Sub-component cho các nút icon trên Header
const HeaderButton = ({ icon, label }) => (
    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors group">
    <span className="text-gray-700 group-hover:text-black">
      {icon}
    </span>
      {label && <span className="text-sm font-semibold text-gray-700">{label}</span>}
    </button>
);

export default Header;