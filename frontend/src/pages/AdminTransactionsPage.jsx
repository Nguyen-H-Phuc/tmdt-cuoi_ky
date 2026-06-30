import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import AdminTable from '../components/AdminTable';
import AdminStatCard from '../components/AdminStatCard';
import { Landmark, ArrowUpRight, TrendingUp, DollarSign, Calendar, Search } from 'lucide-react';

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/api/boosts/transactions');
        setTransactions(res.data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Stats derivation
  const totalRevenue = transactions.filter(t => t.status === 'SUCCESS').reduce((sum, t) => sum + t.amount, 0);
  const successTransactions = transactions.filter(t => t.status === 'SUCCESS').length;

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    const seller = t.sellerName || '';
    const title = t.productTitle || '';
    const id = t.transactionId || '';
    
    const matchesSearch = seller.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || t.paymentMethod === filterMethod;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Sort Logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'createdAt') {
      aVal = aVal ? new Date(aVal) : 0;
      bVal = bVal ? new Date(bVal) : 0;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortConfig.direction === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const columns = [
    {
      key: 'transactionId',
      label: 'Mã Giao dịch',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-gray-800">{row.transactionId}</span>
      )
    },
    {
      key: 'sellerName',
      label: 'Người mua gói',
      render: (row) => (
        <div>
          <span className="font-bold text-gray-900 block truncate max-w-[120px]">
            {row.sellerName}
          </span>
          <span className="text-[10px] text-gray-400 block truncate max-w-[150px] font-semibold mt-0.5">
            {row.productTitle}
          </span>
        </div>
      )
    },
    {
      key: 'packageName',
      label: 'Gói dịch vụ',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 font-bold bg-yellow-50 border border-yellow-150 px-2 py-0.5 rounded-lg">
          {row.packageName}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Số tiền',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-gray-900">
          {formatVND(row.amount)}
        </span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Hình thức',
      render: (row) => (
        <span className="text-[10px] text-gray-500 font-extrabold bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-lg">
          {row.paymentMethod}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => {
        const isSuccess = row.status === 'SUCCESS';
        const isFailed = row.status === 'FAILED';
        return (
          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
            isSuccess 
              ? 'bg-green-50 border-green-150 text-green-700' 
              : isFailed
              ? 'bg-red-50 border-red-150 text-red-700'
              : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            {row.status === 'SUCCESS' ? 'Thành công' : row.status === 'FAILED' ? 'Thất bại' : 'Chờ xử lý'}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Thời gian',
      sortable: true,
      render: (row) => (
        <span className="text-[10px] text-gray-400 font-bold block">
          {new Date(row.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-display">Lịch sử giao dịch</h2>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi doanh thu từ dịch vụ đẩy bài đăng của sinh viên lên đầu trang tìm kiếm.
        </p>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <AdminStatCard
          title="Tổng doanh thu thực nhận"
          value={formatVND(totalRevenue)}
          icon={DollarSign}
          color="green"
        />
        <AdminStatCard
          title="Giao dịch thành công"
          value={`${successTransactions} giao dịch`}
          icon={TrendingUp}
          color="blue"
        />
        <AdminStatCard
          title="Tổng lượt đẩy bài"
          value={`${transactions.length} lượt`}
          icon={Landmark}
          color="indigo"
        />
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={currentItems}
        isLoading={isLoading}
        onSort={(key, dir) => setSortConfig({ key, direction: dir })}
        currentSort={sortConfig}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
        search={{
          placeholder: 'Tìm theo ID giao dịch, người bán hoặc sản phẩm...',
          value: searchTerm,
          onChange: (val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }
        }}
        filters={[
          {
            key: 'paymentMethod',
            label: 'Hình thức',
            value: filterMethod,
            onChange: (val) => {
              setFilterMethod(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả hình thức' },
              { value: 'VNPay', label: 'VNPay' },
              { value: 'Momo', label: 'Momo' },
              { value: 'Bank Transfer', label: 'Bank Transfer' }
            ]
          },
          {
            key: 'status',
            label: 'Trạng thái',
            value: filterStatus,
            onChange: (val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'SUCCESS', label: 'Thành công' },
              { value: 'FAILED', label: 'Thất bại' },
              { value: 'PENDING', label: 'Chờ thanh toán' }
            ]
          }
        ]}
      />

    </div>
  );
};

export default AdminTransactionsPage;
