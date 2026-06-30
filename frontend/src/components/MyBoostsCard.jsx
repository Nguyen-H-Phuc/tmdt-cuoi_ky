import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { Loader2, Zap } from 'lucide-react';

const MyBoostsCard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoosts = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/boosts/user?userId=${user.userId}`);
        setTransactions(res.data || []);
      } catch (err) {
        console.error('Lỗi khi tải lịch sử đẩy tin:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoosts();
  }, [user]);

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#222222] flex items-center gap-1.5">
          <Zap className="text-yellow-500 fill-yellow-500" size={20} />
          Lịch sử đẩy tin đăng
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Xem thông tin lịch sử thanh toán và trạng thái của các gói dịch vụ đẩy tin.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
          <p className="text-xs text-gray-400 font-semibold">Đang tải lịch sử giao dịch...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <Zap size={28} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700">Chưa có giao dịch đẩy tin nào</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[280px] mx-auto">
              Khi bạn mua dịch vụ đẩy tin nổi bật cho sản phẩm, lịch sử thanh toán sẽ xuất hiện ở đây.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-450 uppercase font-black tracking-wider bg-gray-50/50">
                <th className="py-3 px-4 rounded-l-xl">Mã Giao dịch</th>
                <th className="py-3 px-4">Bài đăng</th>
                <th className="py-3 px-4">Gói dịch vụ</th>
                <th className="py-3 px-4">Số tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 rounded-r-xl">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.transactionId} className="hover:bg-gray-50/30 transition-colors text-xs">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{tx.transactionId}</td>
                  <td className="py-3.5 px-4 text-gray-900 font-bold max-w-[150px] truncate" title={tx.productTitle}>
                    {tx.productTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-700 font-bold bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-lg">
                      {tx.packageName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-gray-900">{formatVND(tx.amount)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                      tx.status === 'SUCCESS' 
                        ? 'bg-green-50 border-green-150 text-green-700' 
                        : tx.status === 'FAILED'
                        ? 'bg-red-50 border-red-150 text-red-700'
                        : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      {tx.status === 'SUCCESS' ? 'Thành công' : tx.status === 'FAILED' ? 'Thất bại' : 'Chờ xử lý'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 font-bold">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBoostsCard;
