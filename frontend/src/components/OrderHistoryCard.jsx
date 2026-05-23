import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  CreditCard, 
  XCircle, 
  Star, 
  Calendar, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  MapPin, 
  User as UserIcon,
  Phone,
  Truck,
  ShieldCheck,
  AlertTriangle,
  X,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getBuyerOrders, 
  cancelOrder, 
  getSellerOrders, 
  acceptOrder, 
  rejectOrder 
} from '../api/orderApi';
import OrderDetailModal from './OrderDetailModal';
import ReviewModal from './ReviewModal';

const OrderHistoryCard = () => {
  const { user } = useAuth();
  
  // Tab lớn: 'buyer' (Đơn mua) hoặc 'seller' (Đơn bán)
  const [mainTab, setMainTab] = useState('buyer'); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  
  // Hủy đơn (người mua)
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Phê duyệt / Từ chối (người bán)
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError('');
    try {
      const data = mainTab === 'buyer' 
        ? await getBuyerOrders(user.userId) 
        : await getSellerOrders(user.userId);
      setOrders(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [user, mainTab]);

  useEffect(() => {
    fetchOrders();
    setActiveFilter('ALL');
  }, [fetchOrders, mainTab]);

  // Handle Cancel Order (Buyer)
  const handleCancelOrder = async () => {
    if (!cancellingOrderId || !user?.userId) return;
    setIsCancelling(true);
    try {
      await cancelOrder(cancellingOrderId, user.userId);
      showToast('Hủy đơn hàng thành công!', 'success');
      setCancellingOrderId(null);
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
      const errMsg = err.response?.data?.message || err.message || 'Không thể hủy đơn hàng.';
      showToast(`Lỗi: ${errMsg}`, 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle Accept Order (Seller)
  const handleAcceptOrder = async () => {
    if (!acceptingOrderId || !user?.userId) return;
    setIsProcessing(true);
    try {
      await acceptOrder(acceptingOrderId, user.userId);
      showToast('Xác nhận đồng ý bán đơn hàng thành công!', 'success');
      setAcceptingOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error('Lỗi khi xác nhận đơn hàng:', err);
      const errMsg = err.response?.data?.message || err.message || 'Không thể xác nhận đơn hàng.';
      showToast(`Lỗi: ${errMsg}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reject Order (Seller)
  const handleRejectOrder = async () => {
    if (!rejectingOrderId || !user?.userId) return;
    setIsProcessing(true);
    try {
      await rejectOrder(rejectingOrderId, user.userId);
      showToast('Từ chối đơn hàng thành công!', 'success');
      setRejectingOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error('Lỗi khi từ chối đơn hàng:', err);
      const errMsg = err.response?.data?.message || err.message || 'Không thể từ chối đơn hàng.';
      showToast(`Lỗi: ${errMsg}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Pay Now (VNPay)
  const handlePayNow = (paymentUrl) => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      showToast('Không tìm thấy liên kết thanh toán VNPAY.', 'error');
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
      {/* Tab lớn: Đơn Mua / Đơn Bán */}
      <div className="flex bg-neutral-100 p-1 rounded-xl w-full max-w-xs border border-gray-200/50">
        <button
          onClick={() => setMainTab('buyer')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mainTab === 'buyer'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ArrowDownLeft size={14} className={mainTab === 'buyer' ? 'text-brand-accent' : ''} /> 
          Đơn mua
        </button>
        <button
          onClick={() => setMainTab('seller')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mainTab === 'seller'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ArrowUpRight size={14} className={mainTab === 'seller' ? 'text-brand-accent' : ''} /> 
          Đơn bán
        </button>
      </div>

      {/* Bộ lọc trạng thái */}
      <div className="bg-white rounded-xl shadow-[0px_2px_12px_rgba(34,34,34,0.06)] border border-gray-100 p-1.5 flex gap-1 overflow-x-auto scrollbar-thin">
        {filters.map((filter) => {
          // VNPay payment only exists in Buyer mode for unpaid state
          if (mainTab === 'seller' && filter.id === 'PENDING_PAYMENT') return null;

          const count = filter.id === 'ALL' 
            ? orders.length 
            : orders.filter(o => o.status?.toUpperCase() === filter.id).length;
          
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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

      {/* Danh sách đơn hàng */}
      {loading ? (
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
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.08)] border border-gray-100 p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <ShoppingBag size={40} className="stroke-1 text-gray-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#222222]">
              {mainTab === 'buyer' ? 'Chưa có đơn hàng đã mua' : 'Chưa có đơn hàng được đặt'}
            </h4>
            <p className="text-gray-500 text-xs mt-1 max-w-xs leading-relaxed">
              {mainTab === 'buyer' 
                ? 'Bạn chưa mua món đồ nào. Hãy tham khảo các món đồ hữu ích quanh trường nhé!' 
                : 'Hiện chưa có sinh viên nào đặt mua sản phẩm của bạn.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.orderId}
              className="bg-white rounded-xl shadow-[0px_2px_12px_rgba(34,34,34,0.04)] border border-gray-100 p-5 hover:shadow-[0px_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col gap-4"
            >
              {/* Header của Đơn hàng */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  {mainTab === 'buyer' ? (
                    <>
                      <img 
                        src={order.seller?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${order.seller?.fullName || 'S'}`} 
                        alt="Seller avatar" 
                        className="w-6 h-6 rounded-full border border-gray-200"
                      />
                      <span className="text-[11px] font-bold text-gray-700">Người bán: {order.seller?.fullName || 'Không tên'}</span>
                    </>
                  ) : (
                    <>
                      <img 
                        src={order.buyer?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${order.buyer?.fullName || 'B'}`} 
                        alt="Buyer avatar" 
                        className="w-6 h-6 rounded-full border border-gray-200"
                      />
                      <span className="text-[11px] font-bold text-gray-700">Người mua: {order.buyer?.fullName || 'Không tên'}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400">#{order.orderCode}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Thông tin sản phẩm */}
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
                <p className="text-xs text-gray-400 italic">Sản phẩm đã bị ẩn hoặc xóa.</p>
              )}

              {/* Thông tin giao nhận (Hiển thị chi tiết hơn đối với Người bán) */}
              {mainTab === 'seller' && (
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-[11px] space-y-1.5 text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-gray-400 shrink-0" />
                    <span><b>Phương thức nhận đồ:</b> {order.deliveryMethod === 'home' ? 'Giao tận nơi (+20.000đ)' : `Nhận tại ký túc xá/Trường: ${order.university || ''}`}</span>
                  </div>
                  {order.deliveryMethod === 'home' ? (
                    <div className="flex items-start gap-1.5">
                      <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                      <span><b>Địa chỉ giao hàng:</b> {order.specificAddress}</span>
                    </div>
                  ) : (
                    order.dormInfo && (
                      <div className="flex items-start gap-1.5">
                        <MapPin size={12} className="text-gray-400 shrink-0 mt-0.5" />
                        <span><b>Thông tin phòng KTX:</b> {order.dormInfo}</span>
                      </div>
                    )
                  )}
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-gray-400 shrink-0" />
                    <span><b>Số điện thoại người nhận:</b> {order.receiverPhone || order.buyer?.phone} ({order.receiverName})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={12} className="text-gray-400 shrink-0" />
                    <span><b>Thanh toán:</b> {order.paymentMethod?.toUpperCase()}</span>
                  </div>
                </div>
              )}

              {/* Footer của Đơn hàng và các nút hành động */}
              <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-1">
                {/* Total Price */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="font-bold text-brand-accent text-sm">{formatPrice(order.totalPrice)}</span>
                </div>

                {/* Các nút hành động */}
                <div className="flex gap-2 justify-end">
                  {/* Nút Chi tiết */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-250 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} />
                    Chi tiết
                  </button>

                  {/* Hành động của NGƯỜI MUA */}
                  {mainTab === 'buyer' && (
                    <>
                      {/* Hủy đơn (người mua) */}
                      {(order.status?.toUpperCase() === 'PENDING' || order.status?.toUpperCase() === 'PENDING_PAYMENT') && (
                        <button
                          onClick={() => setCancellingOrderId(order.orderId)}
                          className="px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Hủy đơn
                        </button>
                      )}

                      {/* Thanh toán lại qua VNPay */}
                      {order.status?.toUpperCase() === 'PENDING_PAYMENT' && order.paymentUrl && (
                        <button
                          onClick={() => handlePayNow(order.paymentUrl)}
                          className="px-3 py-1.5 text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard size={13} />
                          Thanh toán
                        </button>
                      )}

                      {/* Đánh giá sản phẩm */}
                      {order.status?.toUpperCase() === 'COMPLETED' && order.product && (() => {
                        const baseDateStr = order.statusDate || order.orderDate;
                        const baseDate = baseDateStr ? new Date(baseDateStr) : null;
                        const isWithin7Days = baseDate && (new Date().getTime() - baseDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
                        
                        return isWithin7Days ? (
                          <button
                            onClick={() => setReviewingProduct(order.product)}
                            className="px-3 py-1.5 text-[11px] font-bold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
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
                    </>
                  )}

                  {/* Hành động của NGƯỜI BÁN */}
                  {mainTab === 'seller' && (
                    <>
                      {/* Đồng ý bán hoặc Từ chối */}
                      {order.status?.toUpperCase() === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRejectingOrderId(order.orderId)}
                            className="px-3 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            Từ chối đơn
                          </button>
                          <button
                            onClick={() => setAcceptingOrderId(order.orderId)}
                            className="px-3 py-1.5 text-[11px] font-bold text-white bg-brand-accent hover:bg-brand-accent/95 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle size={13} />
                            Đồng ý bán
                          </button>
                        </div>
                      )}

                      {/* Cho phép seller hủy đơn nếu khách chưa thanh toán VNPay */}
                      {order.status?.toUpperCase() === 'PENDING_PAYMENT' && (
                        <button
                          onClick={() => setRejectingOrderId(order.orderId)}
                          className="px-3 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Từ chối bán
                        </button>
                      )}
                    </>
                  )}
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
          showToast('Gửi đánh giá thành công! Cảm ơn nhận xét của bạn.', 'success');
          fetchOrders();
        }}
      />

      {/* Modal Xác nhận hủy đơn hàng (Người mua) */}
      {cancellingOrderId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[1000] p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-gray-900">Xác nhận hủy đơn hàng</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này sẽ hoàn tác sản phẩm đăng bán của người bán về trạng thái sẵn sàng để người khác mua.
            </p>
            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => setCancellingOrderId(null)}
                disabled={isCancelling}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Không, giữ lại
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="px-4 py-1.5 text-white bg-red-500 hover:bg-red-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                {isCancelling ? 'Đang hủy...' : 'Đúng, hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận đồng ý bán (Người bán) */}
      {acceptingOrderId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[1000] p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-gray-900">Đồng ý bán sản phẩm</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn xác nhận đồng ý giao dịch sản phẩm này với người mua? Đơn hàng sẽ được chuyển sang trạng thái <b>Hoàn thành</b>.
            </p>
            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => setAcceptingOrderId(null)}
                disabled={isProcessing}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-750 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleAcceptOrder}
                disabled={isProcessing}
                className="px-4 py-1.5 text-white bg-brand-accent hover:bg-brand-accent/90 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                {isProcessing ? 'Đang duyệt...' : 'Đồng ý bán'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận từ chối đơn (Người bán) */}
      {rejectingOrderId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[1000] p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-in fade-in zoom-in duration-150">
            <h3 className="text-sm font-bold text-gray-950">Từ chối bán đơn hàng</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Bạn có chắc chắn muốn từ chối bán sản phẩm cho đơn hàng này? Đơn hàng sẽ bị hủy, sản phẩm sẽ được hiển thị sẵn sàng cho sinh viên khác tìm mua.
            </p>
            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => setRejectingOrderId(null)}
                disabled={isProcessing}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-750 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Không, giữ lại
              </button>
              <button
                onClick={handleRejectOrder}
                disabled={isProcessing}
                className="px-4 py-1.5 text-white bg-red-500 hover:bg-red-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                {isProcessing ? 'Đang huỷ...' : 'Đúng, từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-[9999] bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.12)] border p-4 flex items-center gap-3 animate-slide-in-right min-w-[300px] max-w-sm ${
          toast.type === 'success' ? 'border-emerald-100' : 
          toast.type === 'error' ? 'border-red-100' : 'border-blue-100'
        }`}>
          <div className={`p-1.5 rounded-full shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
            toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
          }`}>
            {toast.type === 'success' ? <ShieldCheck size={16} /> :
             toast.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
          </div>
          <p className="text-xs font-bold text-gray-700 flex-1 leading-normal">{toast.message}</p>
          <button 
            type="button"
            onClick={() => setToast({ ...toast, show: false })}
            className="text-gray-400 hover:text-gray-650 p-0.5 rounded-full hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryCard;
