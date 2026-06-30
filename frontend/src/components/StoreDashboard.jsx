import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { Calendar, DollarSign, Tag, TrendingUp, AlertCircle, RefreshCw, Zap } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

const StoreDashboard = ({ sellerId = 1 }) => {
  // Bộ lọc khoảng thời gian (AreaChart)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [revenueData, setRevenueData] = useState([]);
  
  // Bộ lọc tháng/năm (PieChart)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categoryData, setCategoryData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [boostExpenses, setBoostExpenses] = useState(0);

  // Fetch dữ liệu doanh thu theo ngày
  const fetchRevenue = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch sales revenue
      const response = await apiClient.get(`/api/store/reports/revenue-period`, {
        params: { sellerId, startDate, endDate }
      });
      
      // 2. Fetch boost history
      const boostResponse = await apiClient.get(`/api/boosts/user?userId=${sellerId}`);
      const boosts = boostResponse.data || [];

      // Calculate total boosts in this period
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);

      const periodBoosts = boosts.filter(tx => {
        if (tx.status !== 'SUCCESS') return false;
        const txDate = new Date(tx.createdAt);
        return txDate >= sDate && txDate <= eDate;
      });

      const totalBoostSpend = periodBoosts.reduce((sum, tx) => sum + tx.amount, 0);
      setBoostExpenses(totalBoostSpend);

      // Create a map for boost costs grouped by date format DD/MM
      const boostMap = {};
      periodBoosts.forEach(tx => {
        const dateKey = new Date(tx.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        boostMap[dateKey] = (boostMap[dateKey] || 0) + tx.amount;
      });

      if (response.data && response.data.length > 0) {
        const formatted = response.data.map(item => {
          const dateKey = new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          return {
            date: dateKey,
            'Doanh thu': item.revenue,
            'Chi phí đẩy tin': boostMap[dateKey] || 0
          };
        });
        setRevenueData(formatted);
      } else {
        const allDates = new Set(Object.keys(boostMap));
        const formatted = Array.from(allDates).map(dateKey => ({
          date: dateKey,
          'Doanh thu': 0,
          'Chi phí đẩy tin': boostMap[dateKey] || 0
        }));
        setRevenueData(formatted.sort((a,b) => a.date.localeCompare(b.date)));
      }
    } catch (error) {
      console.error("Lỗi fetch doanh thu thật:", error);
      setRevenueData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dữ liệu doanh thu theo danh mục
  const fetchCategoryRevenue = async () => {
    try {
      const response = await apiClient.get(`/api/store/reports/revenue-category`, {
        params: { sellerId, year: selectedYear, month: selectedMonth }
      });
      if (response.data && response.data.length > 0) {
        const formatted = response.data.map(item => ({
          name: item.categoryName,
          value: item.revenue
        }));
        setCategoryData(formatted);
      } else {
        setCategoryData([]);
      }
    } catch (error) {
      console.error("Lỗi fetch danh mục thật:", error);
      setCategoryData([]);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [sellerId, startDate, endDate]);

  useEffect(() => {
    fetchCategoryRevenue();
  }, [sellerId, selectedMonth, selectedYear]);

  const totalRevenue = revenueData.reduce((sum, item) => sum + (item['Doanh thu'] || 0), 0);

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2024, 2025, 2026];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#222222]">Thống kê doanh thu cửa hàng</h2>
          <p className="text-xs text-gray-500 mt-1">
            Xem báo cáo doanh số bán đồ cũ và cơ cấu danh mục hàng hóa
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50/50 to-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Doanh thu bán hàng</span>
            <h3 className="text-lg font-extrabold text-blue-600">{formatVND(totalRevenue)}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-amber-50/50 to-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chi phí đẩy tin</span>
            <h3 className="text-lg font-extrabold text-amber-600">{formatVND(boostExpenses)}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Zap size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-emerald-50/50 to-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tổng số giao dịch</span>
            <h3 className="text-lg font-extrabold text-emerald-600">{revenueData.length} Đơn hàng</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50/50 to-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Danh mục bán tốt nhất</span>
            <h3 className="text-lg font-extrabold text-purple-600">
              {categoryData.length > 0 ? categoryData[0].name : 'Chưa có'}
            </h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
            <Tag size={20} />
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ 1: DOANH THU THEO THỜI GIAN */}
      <div className="p-4 rounded-xl border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-blue-500 rounded-full"></span>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Biểu đồ doanh thu ngày</h3>
          </div>
          
          {/* Bộ lọc thời gian */}
          <div className="flex items-center gap-2 text-xs">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-gray-700 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="text-gray-400">đến</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 text-gray-700 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="h-[250px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorBoost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${val / 1000000}Tr`;
                  if (val >= 1000) return `${val / 1000}k`;
                  return val;
                }} 
              />
              <Tooltip 
                formatter={(value, name) => [formatVND(value), name]}
                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Area type="monotone" dataKey="Doanh thu" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="Chi phí đẩy tin" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBoost)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BIỂU ĐỒ 2: BIỂU ĐỒ TRÒN THEO LOẠI HÀNG HÓA */}
      <div className="p-4 rounded-xl border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cơ cấu doanh thu theo danh mục</h3>
          </div>

          {/* Bộ lọc tháng/năm */}
          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1 text-gray-700 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="0">Toàn thời gian (Tháng)</option>
              {months.map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1 text-gray-700 font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="0">Toàn thời gian (Năm)</option>
              {years.map(y => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Biểu đồ tròn */}
          <div className="h-[240px] flex justify-center items-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatVND(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400 font-medium">Không có dữ liệu trong khoảng thời gian này</p>
            )}
          </div>

          {/* Chú thích dữ liệu (Legend) tự tùy biến cực đẹp */}
          <div className="space-y-2.5">
            {categoryData.map((item, index) => {
              const totalCatRevenue = categoryData.reduce((s, c) => s + c.value, 0);
              const percentage = totalCatRevenue > 0 ? ((item.value / totalCatRevenue) * 100).toFixed(1) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="font-medium text-gray-600 truncate max-w-[150px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800">{formatVND(item.value)}</span>
                    <span className="font-semibold text-gray-400 w-10 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoreDashboard;
