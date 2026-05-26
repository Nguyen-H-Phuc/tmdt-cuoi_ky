import React from 'react';
import { X, MapPin, User, Phone, CreditCard, Clock, Truck, Calendar, FileText, ShoppingBag, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderDetailModal = ({ isOpen, onClose, order, onCancelOrder, onPayNow }) => {
  const navigate = useNavigate();
  if (!isOpen || !order) return null;

  // Format currency helper
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0đ';
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // Format Date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Calculate pricing
  const productPrice = order.product?.price || 0;
  const shippingFee = order.deliveryMethod === 'home' ? 20000 : 0;
  // Backend OrderService has standard 10,000đ discount
  const voucherDiscount = 10000;
  const finalPrice = order.totalPrice;

  // Status mapping details
  const getStatusDetails = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING_PAYMENT':
        return { label: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-600 border-amber-200', desc: 'Đơn hàng đang chờ thanh toán qua cổng VNPAY.' };
      case 'PENDING':
        return { label: 'Chờ xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-200', desc: 'Đã tạo đơn hàng thành công, chờ người bán xác nhận.' };
      case 'COMPLETED':
        return { label: 'Hoàn thành', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', desc: 'Đơn hàng đã được thanh toán và giao dịch thành công.' };
      case 'CANCELLED':
        return { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-200', desc: 'Đơn hàng đã bị hủy.' };
      default:
        return { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200', desc: '' };
    }
  };

  const statusInfo = getStatusDetails(order.status);

  // Navigate to chat
  const handleChatWithSeller = () => {
    if (order.seller?.userId) {
      navigate('/chat', { state: { startWithUser: order.seller } });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Chi tiết đơn hàng</h3>
              <span className="text-xs font-mono font-bold text-brand-accent bg-brand-accent/5 px-2 py-0.5 rounded border border-brand-accent/10">
                {order.orderCode}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
              <Calendar size={12} />
              Ngày đặt: {formatDate(order.orderDate)}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Message & Timeline */}
          <div className={`p-4 rounded-xl border ${statusInfo.color} flex flex-col gap-3`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-xs font-bold">{statusInfo.label}</span>
              </div>
              {statusInfo.desc && (
                <p className="text-[11px] leading-relaxed opacity-90">{statusInfo.desc}</p>
              )}
            </div>
            
            {/* Timeline */}
            <div className="border-t border-black/10 pt-2.5 space-y-1.5 text-[10px] opacity-80">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                <span>Thời gian tạo đơn: {formatDate(order.orderDate)}</span>
              </div>
              {order.statusDate && (
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 animate-ping"></span>
                  <span>
                    {order.status?.toUpperCase() === 'COMPLETED' && 'Thời gian hoàn thành: '}
                    {order.status?.toUpperCase() === 'CANCELLED' && 'Thời gian hủy đơn: '}
                    {order.status?.toUpperCase() === 'PENDING_PAYMENT' && 'Cập nhật thanh toán: '}
                    {order.status?.toUpperCase() === 'PENDING' && 'Cập nhật trạng thái: '}
                    {formatDate(order.statusDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Grid sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Receiver Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <Truck size={14} className="text-brand-accent" />
                Thông tin nhận hàng
              </h4>
              <div className="space-y-2 text-[11px] text-gray-600">
                <div className="flex items-start gap-2">
                  <User size={13} className="text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">Người nhận:</span> {order.receiverName}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={13} className="text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">Số điện thoại:</span> {order.receiverPhone}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">Nơi nhận:</span> {order.deliveryMethod === 'home' ? 'Giao hàng tận nơi' : 'Nhận tại trường (Campus)'}
                    {order.deliveryMethod === 'campus' && (
                      <div className="mt-1 text-gray-500 bg-gray-50 p-1.5 rounded border border-gray-100">
                        <span className="font-medium text-gray-700">Trường:</span> {order.university} <br />
                        <span className="font-medium text-gray-700">Ký túc xá:</span> {order.dormInfo || 'Không có'}
                      </div>
                    )}
                    {order.deliveryMethod === 'home' && order.specificAddress && (
                      <div className="mt-1 text-gray-500 bg-gray-50 p-1.5 rounded border border-gray-100">
                        <span className="font-medium text-gray-700">Địa chỉ cụ thể:</span> {order.specificAddress}
                      </div>
                    )}
                  </div>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1">
                    <FileText size={13} className="text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-700 block mb-0.5">Ghi chú:</span>
                      <p className="text-gray-500 italic leading-relaxed">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <CreditCard size={14} className="text-brand-accent" />
                Phương thức thanh toán
              </h4>
              <div className="space-y-2 text-[11px] text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Hình thức:</span> {
                    order.paymentMethod === 'vnpay' ? 'Thanh toán trực tuyến qua VNPAY' : 'Thanh toán khi nhận hàng (COD)'
                  }
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Trạng thái giao dịch:</span> {
                    order.status === 'COMPLETED' ? 'Đã thanh toán thành công' : 'Chưa hoàn thành thanh toán'
                  }
                </div>
              </div>
            </div>

          </div>

          {/* Product section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
              <ShoppingBag size={14} className="text-brand-accent" />
              Sản phẩm mua
            </h4>
            {order.product ? (
              <div className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                <img 
                  src={order.product.imageUrl || 'https://placehold.co/100'} 
                  alt={order.product.title} 
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h5 className="text-xs font-bold text-gray-800 line-clamp-1">{order.product.title}</h5>
                    <p className="text-[10px] text-gray-500 mt-1">Đăng bán bởi: <span className="font-semibold text-gray-700">{order.seller?.fullName || 'Người bán'}</span></p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-accent">{formatPrice(order.product.price)}</span>
                    <button
                      onClick={handleChatWithSeller}
                      className="text-[10px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border border-gray-200"
                    >
                      <MessageSquare size={12} />
                      Chat với người bán
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">Không có thông tin sản phẩm.</p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between text-[11px] text-gray-600">
              <span>Giá sản phẩm:</span>
              <span className="font-medium text-gray-800">{formatPrice(productPrice)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-gray-800">+{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600">
              <span>Giảm giá Voucher:</span>
              <span className="font-medium text-emerald-600">-{formatPrice(voucherDiscount)}</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-xs font-bold text-gray-850">
              <span className="text-gray-800">Tổng thanh toán:</span>
              <span className="text-brand-accent text-sm">{formatPrice(finalPrice)}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          
          {/* Secondary / Danger Actions on Left */}
          <div>
            {(order.status?.toUpperCase() === 'PENDING' || order.status?.toUpperCase() === 'PENDING_PAYMENT') && (
              <button
                onClick={() => onCancelOrder(order.orderId)}
                className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-200"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>

          {/* Primary Actions on Right */}
          <div className="flex gap-2">
            {order.status?.toUpperCase() === 'PENDING_PAYMENT' && order.paymentUrl && (
              <button
                onClick={() => onPayNow(order.paymentUrl)}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <CreditCard size={14} />
                Thanh toán ngay
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-250 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
            >
              Đóng
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailModal;
