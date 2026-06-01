import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
  const { user, isLogin, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If token is present but user details are not loaded yet, wait.
  // In a robust application, we should check a loading state.
  // Since our AuthContext checks token on mount, we can verify access.
  if (!token && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  // Double check admin role
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center space-y-5 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quyền truy cập bị từ chối</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Bạn không có đủ thẩm quyền để truy cập phân khu quản trị hệ thống. Khu vực này chỉ dành cho tài khoản quản trị viên.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="w-full py-2.5 bg-brand-primary hover:bg-brand-hover text-gray-900 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} /> Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Admin Sidebar Navigation */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Nested Route Viewport */}
        <main className="grow overflow-y-auto bg-gray-50 p-6 md:p-8 scrollbar-thin">
          <div className="max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
