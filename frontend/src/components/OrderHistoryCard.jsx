import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Eye, CreditCard, XCircle, Star, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBuyerOrders, cancelOrder } from '../api/orderApi';
import OrderDetailModal from './OrderDetailModal';
import ReviewModal from './ReviewModal';

const OrderHistoryCard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getBuyerOrders(user.userId);
      setOrders(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Cancel Order
  const handleCancelOrder = async () => {
    if (!cancellingOrderId || !user?.userId) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancellingOrderId, user.userId);
      alert('Hủy đơn hàng thành công!');
      setCancellingOrderId(null);
      // Refresh list
      fetchOrders();
      // If the detail modal is open, close or update it
      setSelectedOrder(null);
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
      const errMsg = err.response?.data?.message || err.message || 'Không thể hủy đơn hàng.';
      alert(`Lỗi: ${errMsg}`);
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle Pay Now (VNPay)
  const handlePayNow = (paymentUrl) => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      alert('Không tìm thấy liên kết thanh toán VNPAY.');
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0đ';
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filter Tabs
  const filters = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
    { id: 'PENDING', label: 'Chờ xác nhận' },
    { id: 'COMPLETED', label: 'Hoàn thành' },
    { id: 'CANCELLED', label: 'Đã hủy' }
  ];

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'ALL') return true;
    return order.status?.toUpperCase() === activeFilter;
  });

  // Get status badge colors
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING_PAYMENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Chờ thanh toán</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">Chờ xác nhận</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">Đã hủy</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="flex-1 space-y-6 w-full">
      {/* Tabs list */}
      <div className="bg-white rounded-xl shadow-[0px_2px_12px_rgba(34,34,34,0.06)] border border-gray-100 p-1.5 flex gap-1 overflow-x-auto scrollbar-thin">
        {filters.map((filter) => {
          const count = filter.id === 'ALL' 
            ? orders.length 
            : orders.filter(o => o.status?.toUpperCase() === filter.id).length;
          
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === filter.id
                  ? 'bg-brand-accent/10 text-brand-accent'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeFilter === filter.id
                    ? 'bg-brand-accent text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main List Area */}
      {loading ? (
        // Loading Skeleton
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 space-y-4 animate-pulse">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/4 h-3 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                <div className="w-20 h-4 bg-gray-200 rounded" />
                <div className="w-24 h-8 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.08)] border border-gray-100 p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <ShoppingBag size={40} className="stroke-1 text-gray-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#222222]">Chưa có đơn hàng</h4>
            <p className="text-gray-500 text-xs mt-1 max-w-xs leading-relaxed">
              Bạn chưa có đơn hàng nào thuộc bộ lọc này. Hãy tham khảo các món đồ hữu ích quanh trường nhé!
            </p>
          </div>
        </div>
      ) : (
        // Orders List
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.orderId}
              className="bg-white rounded-xl shadow-[0px_2px_12px_rgba(34,34,34,0.04)] border border-gray-100 p-5 hover:shadow-[0px_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col gap-4"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={order.seller?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${order.seller?.fullName || 'S'}`} 
                    alt="Seller avatar" 
                    className="w-6 h-6 rounded-full border border-gray-200"
                  />
                  <span className="text-[11px] font-bold text-gray-700">{order.seller?.fullName || 'Người bán'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400">#{order.orderCode}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Product Info */}
              {order.product ? (
                <div className="flex gap-4">
                  <img 
                    src={order.product.imageUrl || 'https://placehold.co/80'} 
                    alt={order.product.title} 
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{order.product.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        Đặt ngày: {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-[10px] text-gray-500">Đơn giá: {formatPrice(order.product.price)}</span>
                      <span className="text-xs font-bold text-brand-accent">{formatPrice(order.product.price)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Sản phẩm đã bị xóa hoặc ẩn.</p>
              )}

              {/* Order Footer & Actions */}
              <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-1">
                {/* Total Price */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="font-bold text-brand-accent text-sm">{formatPrice(order.totalPrice)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  {/* Detailed Modal Button */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-250 transition-all flex items-center gap-1"
                  >
                    <Eye size={13} />
                    Chi tiết
                  </button>

                  {/* COD or Pending Payment Cancellation */}
                  {(order.status?.toUpperCase() === 'PENDING' || order.status?.toUpperCase() === 'PENDING_PAYMENT') && (
                    <button
                      onClick={() => setCancellingOrderId(order.orderId)}
                      className="px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-all flex items-center gap-1"
                    >
                      Hủy đơn
                    </button>
                  )}

                  {/* VNPay Pay Now */}
                  {order.status?.toUpperCase() === 'PENDING_PAYMENT' && order.paymentUrl && (
                    <button
                      onClick={() => handlePayNow(order.paymentUrl)}
                      className="px-3 py-1.5 text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition-all flex items-center gap-1"
                    >
                      <CreditCard size={13} />
                      Thanh toán
                    </button>
                  )}

                  {/* Write Review */}
                  {order.status?.toUpperCase() === 'COMPLETED' && order.product && (() => {
                    const baseDateStr = order.statusDate || order.orderDate;
                    const baseDate = baseDateStr ? new Date(baseDateStr) : null;
                    const isWithin7Days = baseDate && (new Date().getTime() - baseDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
                    
                    return isWithin7Days ? (
                      <button
                        onClick={() => setReviewingProduct(order.product)}
                        className="px-3 py-1.5 text-[11px] font-bold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-lg shadow-sm transition-all flex items-center gap-1"
                      >
                        <Star size={13} />
                        Đánh giá
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-lg select-none cursor-default flex items-center gap-1">
                        Hết hạn đánh giá
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal 
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onPayNow={handlePayNow}
        onCancelOrder={(orderId) => {
          setCancellingOrderId(orderId);
        }}
      />

      {/* Review Modal */}
      <ReviewModal 
        isOpen={!!reviewingProduct}
        onClose={() => setReviewingProduct(null)}
        product={reviewingProduct}
        reviewerId={user?.userId}
        onSubmitSuccess={() => {
          alert('Gửi đánh giá thành công! Cảm ơn nhận xét của bạn.');
          fetchOrders();
        }}
      />

      {/* Cancel Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancellingOrderId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-[0px_8px_24px_rgba(0,0,0,0.12)] p-5 border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-gray-900">Xác nhận hủy đơn hàng</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này sẽ hoàn tác sản phẩm đăng bán của người bán về trạng thái sẵn sàng để người khác mua.
            </p>
            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => setCancellingOrderId(null)}
                disabled={isCancelling}
                className="px-4 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                Không, giữ lại
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all flex items-center gap-1"
              >
                {isCancelling ? 'Đang hủy...' : 'Đúng, hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
