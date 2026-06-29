import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminStatCard from '../components/AdminStatCard';
import RevenueChart from '../components/RevenueChart';
import { DollarSign, Package, Users, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeProducts: 0,
    pendingProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent reports to show on dashboard overview
        const reportsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reviews/reports`);
        setRecentReports(reportsRes.data.slice(0, 3)); // Only show top 3 on dashboard

        // Fetch dashboard statistics from backend
        const statsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/statistics/admin`);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-indigo-950 p-6 md:p-8 rounded-3xl border border-gray-800 shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold font-display">Chào mừng trở lại, Quản trị viên!</h2>
          <p className="text-xs text-gray-400">
            Dưới đây là tổng quan hiệu suất và các yêu cầu phê duyệt mới nhất trên sàn giao dịch sinh viên.
          </p>
        </div>
        <div className="text-[10px] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shrink-0">
          Phiên bản 1.0.0
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Tổng doanh thu đẩy bài"
          value={formatVND(stats.totalRevenue)}
          icon={DollarSign}
          trend={{ type: 'up', value: '18.4%' }}
          description="so với tháng trước"
          color="green"
        />
        <AdminStatCard
          title="Sản phẩm đang bán"
          value={`${stats.activeProducts} món`}
          icon={Package}
          trend={{ type: 'up', value: '5.2%' }}
          description="hoạt động hôm nay"
          color="blue"
        />
        <AdminStatCard
          title="Bài chờ phê duyệt"
          value={`${stats.pendingProducts} yêu cầu`}
          icon={Clock}
          description="cần xử lý ngay"
          color={stats.pendingProducts > 0 ? 'yellow' : 'indigo'}
        />
        <AdminStatCard
          title="Tổng thành viên"
          value={`${stats.totalUsers} tài khoản`}
          icon={Users}
          trend={{ type: 'up', value: '12.8%' }}
          description="đã xác minh"
          color="purple"
        />
      </div>

      {/* Analytics Chart & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart View */}
        <div className="lg:col-span-2 h-full">
          <RevenueChart isAdmin={true} />
        </div>

        {/* Action Center Sidebar Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[400px]">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-2xs">
              <AlertTriangle size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 font-display">Báo cáo đánh giá chưa xử lý</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Thành viên có thể gửi báo cáo đánh giá tiêu cực hoặc sai lệch thông tin. Kiểm tra danh sách báo cáo đánh giá để duy trì môi trường trao đổi an toàn, trung thực.
              </p>
            </div>

            {/* List of recent reports */}
            <div className="space-y-3 pt-2">
              {recentReports.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-[11px] text-gray-400 font-medium">Không có báo cáo chờ duyệt</p>
                </div>
              ) : (
                recentReports.map(report => (
                  <div key={report.reportId} className="flex justify-between items-center text-xs p-3 bg-gray-50/60 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                    <div className="truncate pr-3 space-y-0.5">
                      <span className="font-bold text-gray-800 block truncate">{report.reviewerName}</span>
                      <span className="text-[10px] text-gray-450 truncate block">Lý do: "{report.reason}"</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">
                      Chờ duyệt
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/reports')}
            className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors hover:underline cursor-pointer pt-4 mt-4 border-t border-gray-100"
          >
            Quản lý tất cả báo cáo <ArrowRight size={14} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
