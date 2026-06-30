import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  AreaChart, Area, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, Package, DollarSign, Calendar, Info, Landmark
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AdminStatisticsPage = () => {
  const { showToast } = useToast();
  
  // Data States
  const [revenueData, setRevenueData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [boostTransactions, setBoostTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time Filter States per Chart
  const [revenuePeriod, setRevenuePeriod] = useState('30');
  const [revenueStartDate, setRevenueStartDate] = useState('');
  const [revenueEndDate, setRevenueEndDate] = useState('');

  const [boostPeriod, setBoostPeriod] = useState('30');
  const [boostStartDate, setBoostStartDate] = useState('');
  const [boostEndDate, setBoostEndDate] = useState('');

  const [productPeriod, setProductPeriod] = useState('30');
  const [productStartDate, setProductStartDate] = useState('');
  const [productEndDate, setProductEndDate] = useState('');

  const [userPeriod, setUserPeriod] = useState('30');
  const [userStartDate, setUserStartDate] = useState('');
  const [userEndDate, setUserEndDate] = useState('');

  // Stats Counters
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBoostRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Revenue (completed orders value)
      const revRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/statistics/admin/revenue`);
      setRevenueData(revRes.data);

      // 2. Fetch Products
      const prodRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/products/admin`);
      setProductsData(prodRes.data);

      // 3. Fetch Users
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users`);
      setUsersData(userRes.data);

      // 4. Fetch Boost Transactions
      const boostRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/boosts/transactions`);
      setBoostTransactions(boostRes.data || []);

      // Calculate overall stats
      const totalRev = revRes.data.reduce((sum, item) => sum + item.revenue, 0);
      const totalBoost = (boostRes.data || []).filter(t => t.status === 'SUCCESS').reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalRevenue: totalRev,
        totalBoostRevenue: totalBoost,
        totalProducts: prodRes.data.length,
        totalUsers: userRes.data.length
      });

    } catch (error) {
      console.error("Error fetching stats data:", error);
      showToast("Không thể tải đầy đủ dữ liệu thống kê.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${Number((value / 1000000).toFixed(1))}Tr`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value;
  };

  // 1. Process Sales Revenue Data (from database)
  const processedRevenue = useMemo(() => {
    if (!revenueData.length) return [];
    let result = [...revenueData];
    if (revenuePeriod === 'custom') {
      if (revenueStartDate) {
        result = result.filter(item => item.date >= revenueStartDate);
      }
      if (revenueEndDate) {
        result = result.filter(item => item.date <= revenueEndDate);
      }
    } else if (revenuePeriod !== 'all') {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - parseInt(revenuePeriod, 10));
      const limitStr = limitDate.toISOString().split('T')[0];
      result = result.filter(item => item.date >= limitStr);
    }
    return result;
  }, [revenueData, revenuePeriod, revenueStartDate, revenueEndDate]);

  // 2. Process Boost Revenue Data (from VIP transactions)
  const processedBoost = useMemo(() => {
    const counts = {};
    boostTransactions.forEach(t => {
      if (t.status !== 'SUCCESS') return;
      const dateStr = t.createdAt.split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + t.amount;
    });

    const sortedDates = Object.keys(counts).sort();
    let result = sortedDates.map(date => ({ date, revenue: counts[date] }));

    if (boostPeriod === 'custom') {
      if (boostStartDate) {
        result = result.filter(item => item.date >= boostStartDate);
      }
      if (boostEndDate) {
        result = result.filter(item => item.date <= boostEndDate);
      }
    } else if (boostPeriod !== 'all') {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - parseInt(boostPeriod, 10));
      const limitStr = limitDate.toISOString().split('T')[0];
      result = result.filter(item => item.date >= limitStr);
    }
    return result;
  }, [boostTransactions, boostPeriod, boostStartDate, boostEndDate]);

  // 3. Process Products Data (group by creation date)
  const processedProducts = useMemo(() => {
    if (!productsData.length) return [];
    
    // Group products by creation date (YYYY-MM-DD)
    const counts = {};
    productsData.forEach(p => {
      if (!p.createdAt) return;
      const dateStr = p.createdAt.split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const sortedDates = Object.keys(counts).sort();
    let result = sortedDates.map(date => ({ date, count: counts[date] }));

    if (productPeriod === 'custom') {
      if (productStartDate) {
        result = result.filter(item => item.date >= productStartDate);
      }
      if (productEndDate) {
        result = result.filter(item => item.date <= productEndDate);
      }
    } else if (productPeriod !== 'all') {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - parseInt(productPeriod, 10));
      const limitStr = limitDate.toISOString().split('T')[0];
      result = result.filter(item => item.date >= limitStr);
    }
    return result;
  }, [productsData, productPeriod, productStartDate, productEndDate]);

  // 4. Process Users Data (group by creation date)
  const processedUsers = useMemo(() => {
    if (!usersData.length) return [];

    const counts = {};
    usersData.forEach(u => {
      if (!u.createdAt) return;
      const dateStr = u.createdAt.split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const sortedDates = Object.keys(counts).sort();
    let result = sortedDates.map(date => ({ date, count: counts[date] }));

    if (userPeriod === 'custom') {
      if (userStartDate) {
        result = result.filter(item => item.date >= userStartDate);
      }
      if (userEndDate) {
        result = result.filter(item => item.date <= userEndDate);
      }
    } else if (userPeriod !== 'all') {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - parseInt(userPeriod, 10));
      const limitStr = limitDate.toISOString().split('T')[0];
      result = result.filter(item => item.date >= limitStr);
    }
    return result;
  }, [usersData, userPeriod, userStartDate, userEndDate]);

  // Insights Calculations
  const revenueStats = useMemo(() => {
    if (!processedRevenue.length) return null;
    const total = processedRevenue.reduce((sum, item) => sum + item.revenue, 0);
    const maxVal = Math.max(...processedRevenue.map(i => i.revenue));
    const maxItem = processedRevenue.find(i => i.revenue === maxVal);
    const avg = total / processedRevenue.length;
    return { total, maxItem, avg };
  }, [processedRevenue]);

  const boostStats = useMemo(() => {
    if (!processedBoost.length) return null;
    const total = processedBoost.reduce((sum, item) => sum + item.revenue, 0);
    const maxVal = Math.max(...processedBoost.map(i => i.revenue));
    const maxItem = processedBoost.find(i => i.revenue === maxVal);
    const avg = total / processedBoost.length;
    return { total, maxItem, avg };
  }, [processedBoost]);

  const productStats = useMemo(() => {
    if (!processedProducts.length) return null;
    const total = processedProducts.reduce((sum, item) => sum + item.count, 0);
    const maxVal = Math.max(...processedProducts.map(i => i.count));
    const maxItem = processedProducts.find(i => i.count === maxVal);
    const avg = total / processedProducts.length;
    return { total, maxItem, avg };
  }, [processedProducts]);

  const userStats = useMemo(() => {
    if (!processedUsers.length) return null;
    const total = processedUsers.reduce((sum, item) => sum + item.count, 0);
    const maxVal = Math.max(...processedUsers.map(i => i.count));
    const maxItem = processedUsers.find(i => i.count === maxVal);
    const avg = total / processedUsers.length;
    return { total, maxItem, avg };
  }, [processedUsers]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent mb-4"></div>
        <p className="text-gray-500 font-medium">Đang thu thập dữ liệu thống kê...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">Trung tâm Thống kê</h2>
          <p className="text-xs text-gray-500 mt-1">
            Phân tích hoạt động tài chính, tin đăng và tăng trưởng thành viên trên toàn hệ thống.
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-xs cursor-pointer"
        >
          Tải lại dữ liệu
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <DollarSign size={20} className="stroke-2" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Doanh thu đã bán</span>
            <span className="text-base font-extrabold text-gray-900 mt-0.5 block">{formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Landmark size={20} className="stroke-2" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Doanh thu đẩy bài</span>
            <span className="text-base font-extrabold text-gray-900 mt-0.5 block">{formatCurrency(stats.totalBoostRevenue)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package size={20} className="stroke-2" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Tổng tin đăng bán</span>
            <span className="text-base font-extrabold text-gray-900 mt-0.5 block">{stats.totalProducts} sản phẩm</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={20} className="stroke-2" />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Tổng số thành viên</span>
            <span className="text-base font-extrabold text-gray-900 mt-0.5 block">{stats.totalUsers} người dùng</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="space-y-6">
        
        {/* CHART 1: Sales Revenue Chart (Doanh thu đã bán) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-green-50 text-green-600"><DollarSign size={16} /></span>
                <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider">Doanh thu sản phẩm đã bán (Tổng giá trị giao dịch)</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">Dựa trên các đơn hàng mua bán giữa sinh viên ở trạng thái hoàn thành (COMPLETED)</p>
            </div>
            
            {/* Period selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <select 
                  value={revenuePeriod}
                  onChange={(e) => setRevenuePeriod(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-brand-accent cursor-pointer bg-white text-gray-770"
                >
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">90 ngày qua</option>
                  <option value="180">6 tháng qua</option>
                  <option value="all">Tất cả thời gian</option>
                  <option value="custom">Tự chọn khoảng ngày</option>
                </select>
              </div>

              {revenuePeriod === 'custom' && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 animate-in fade-in slide-in-from-left-2 duration-200">
                  <input 
                    type="date" 
                    value={revenueStartDate} 
                    onChange={(e) => setRevenueStartDate(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                  />
                  <span>đến</span>
                  <input 
                    type="date" 
                    value={revenueEndDate} 
                    onChange={(e) => setRevenueEndDate(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Chart */}
            <div className="lg:col-span-3 h-[300px]">
              {processedRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedRevenue} margin={{ top: 10, right: 10, left: 15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={10} />
                    <YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dx={-5} />
                    <Tooltip 
                      formatter={(val) => [formatCurrency(val), 'Doanh thu']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28}>
                      {processedRevenue.map((entry, index) => {
                        let color = '#10b981'; // green-500
                        if (revenueStats && entry.revenue === revenueStats.maxItem?.revenue) color = '#047857'; // dark green for peak
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  <span className="text-2xl mb-1">📊</span>
                  <p className="text-xs font-semibold">Chưa có dữ liệu giao dịch trong khoảng thời gian này</p>
                </div>
              )}
            </div>

            {/* Analysis card */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4 h-full flex flex-col justify-center">
              <h4 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Info size={12} /> Phân tích doanh thu đã bán
              </h4>
              {revenueStats ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Tổng doanh thu kỳ lọc</span>
                    <span className="text-base font-bold text-gray-900">{formatCurrency(revenueStats.total)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Trung bình / ngày</span>
                    <span className="text-xs font-bold text-gray-800">{formatCurrency(revenueStats.avg)}</span>
                  </div>
                  {revenueStats.maxItem && (
                    <div>
                      <span className="text-[10px] text-gray-500 block">Ngày cao điểm nhất</span>
                      <span className="text-xs font-bold text-emerald-600 block">{revenueStats.maxItem.date}</span>
                      <span className="text-xs font-bold text-gray-800">({formatCurrency(revenueStats.maxItem.revenue)})</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400">Không thể phân tích dữ liệu rỗng</p>
              )}
            </div>
          </div>
        </div>

        {/* CHART 2: Boost/Push Revenue Chart (Doanh thu phí đẩy bài) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-50 text-amber-600"><Landmark size={16} /></span>
                <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider">Doanh thu phí dịch vụ đẩy tin đăng (Mô hình kinh doanh)</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">Nguồn thu chính của hệ thống thu phí đẩy tin của người bán lên vị trí ưu tiên</p>
            </div>
            
            {/* Period selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <select 
                  value={boostPeriod}
                  onChange={(e) => setBoostPeriod(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-brand-accent cursor-pointer bg-white text-gray-770"
                >
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">90 ngày qua</option>
                  <option value="all">Tất cả thời gian</option>
                  <option value="custom">Tự chọn khoảng ngày</option>
                </select>
              </div>

              {boostPeriod === 'custom' && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 animate-in fade-in slide-in-from-left-2 duration-200">
                  <input 
                    type="date" 
                    value={boostStartDate} 
                    onChange={(e) => setBoostStartDate(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                  />
                  <span>đến</span>
                  <input 
                    type="date" 
                    value={boostEndDate} 
                    onChange={(e) => setBoostEndDate(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Chart */}
            <div className="lg:col-span-3 h-[300px]">
              {processedBoost.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedBoost} margin={{ top: 10, right: 10, left: 15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={10} />
                    <YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dx={-5} />
                    <Tooltip 
                      formatter={(val) => [formatCurrency(val), 'Phí dịch vụ']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
                    />
                    <Bar dataKey="revenue" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={28}>
                      {processedBoost.map((entry, index) => {
                        let color = '#fbbf24'; // amber-400
                        if (boostStats && entry.revenue === boostStats.maxItem?.revenue) color = '#d97706'; // dark amber for peak
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  <span className="text-2xl mb-1">📊</span>
                  <p className="text-xs font-semibold">Chưa có giao dịch đẩy bài trong khoảng thời gian này</p>
                </div>
              )}
            </div>

            {/* Analysis card */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4 h-full flex flex-col justify-center">
              <h4 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Info size={12} /> Phân tích phí dịch vụ
              </h4>
              {boostStats ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Tổng phí dịch vụ kỳ lọc</span>
                    <span className="text-base font-bold text-gray-900">{formatCurrency(boostStats.total)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Trung bình / ngày</span>
                    <span className="text-xs font-bold text-gray-800">{formatCurrency(boostStats.avg)}</span>
                  </div>
                  {boostStats.maxItem && (
                    <div>
                      <span className="text-[10px] text-gray-500 block">Ngày cao điểm nhất</span>
                      <span className="text-xs font-bold text-amber-600 block">{boostStats.maxItem.date}</span>
                      <span className="text-xs font-bold text-gray-800">({formatCurrency(boostStats.maxItem.revenue)})</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400">Không thể phân tích dữ liệu rỗng</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* CHART 3: New Products Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-50 text-blue-600"><Package size={16} /></span>
                  <h3 className="font-extrabold text-xs text-gray-850 uppercase tracking-wider">Lượng tin đăng sản phẩm mới</h3>
                </div>
                <p className="text-[10px] text-gray-455 mt-1">Số lượng bài đăng mới được sinh viên tạo trên hệ thống</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select 
                  value={productPeriod}
                  onChange={(e) => setProductPeriod(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-brand-accent cursor-pointer bg-white text-gray-755"
                >
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">90 ngày qua</option>
                  <option value="all">Tất cả thời gian</option>
                  <option value="custom">Tự chọn ngày</option>
                </select>

                {productPeriod === 'custom' && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 animate-in fade-in slide-in-from-left-2 duration-200">
                    <input 
                      type="date" 
                      value={productStartDate} 
                      onChange={(e) => setProductStartDate(e.target.value)}
                      className="px-1.5 py-0.5 border border-gray-200 rounded-md text-[10px] focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                    />
                    <span>-</span>
                    <input 
                      type="date" 
                      value={productEndDate} 
                      onChange={(e) => setProductEndDate(e.target.value)}
                      className="px-1.5 py-0.5 border border-gray-200 rounded-md text-[10px] focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-[250px] w-full">
              {processedProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedProducts} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dx={-5} />
                    <Tooltip 
                      formatter={(val) => [`${val} sản phẩm`, 'Tin đăng mới']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
                    />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProd)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  <span className="text-2xl mb-1">📦</span>
                  <p className="text-xs font-semibold">Chưa có sản phẩm đăng trong kỳ lọc</p>
                </div>
              )}
            </div>

            {/* Product Meta Stats */}
            {productStats && (
              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Tổng tin đăng mới</span>
                  <span className="text-base font-bold text-gray-800">{productStats.total} món</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Đăng trung bình / ngày</span>
                  <span className="text-base font-bold text-gray-800">{productStats.avg.toFixed(1)} món</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Đỉnh điểm một ngày</span>
                  <span className="text-base font-bold text-blue-600">{productStats.maxItem?.count || 0} món</span>
                </div>
              </div>
            )}
          </div>

          {/* CHART 4: New Users Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-purple-50 text-purple-600"><Users size={16} /></span>
                  <h3 className="font-extrabold text-xs text-gray-850 uppercase tracking-wider">Đăng ký thành viên mới</h3>
                </div>
                <p className="text-[10px] text-gray-450 mt-1">Lượng tài khoản sinh viên đăng ký mới hàng ngày</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select 
                  value={userPeriod}
                  onChange={(e) => setUserPeriod(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-brand-accent cursor-pointer bg-white text-gray-755"
                >
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">90 ngày qua</option>
                  <option value="all">Tất cả thời gian</option>
                  <option value="custom">Tự chọn ngày</option>
                </select>

                {userPeriod === 'custom' && (
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 animate-in fade-in slide-in-from-left-2 duration-200">
                    <input 
                      type="date" 
                      value={userStartDate} 
                      onChange={(e) => setUserStartDate(e.target.value)}
                      className="px-1.5 py-0.5 border border-gray-200 rounded-md text-[10px] focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                    />
                    <span>-</span>
                    <input 
                      type="date" 
                      value={userEndDate} 
                      onChange={(e) => setUserEndDate(e.target.value)}
                      className="px-1.5 py-0.5 border border-gray-200 rounded-md text-[10px] focus:outline-none focus:border-brand-accent text-gray-700 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-[250px] w-full">
              {processedUsers.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedUsers} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dx={-5} />
                    <Tooltip 
                      formatter={(val) => [`${val} tài khoản`, 'Thành viên mới']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
                    />
                    <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                  <span className="text-2xl mb-1">👥</span>
                  <p className="text-xs font-semibold">Chưa có lượt đăng ký mới trong kỳ lọc</p>
                </div>
              )}
            </div>

            {/* User Meta Stats */}
            {userStats && (
              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Tổng thành viên mới</span>
                  <span className="text-base font-bold text-gray-800">{userStats.total} người</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Đăng ký trung bình / ngày</span>
                  <span className="text-base font-bold text-gray-800">{userStats.avg.toFixed(1)} người</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Đỉnh điểm một ngày</span>
                  <span className="text-base font-bold text-purple-600">{userStats.maxItem?.count || 0} người</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminStatisticsPage;
