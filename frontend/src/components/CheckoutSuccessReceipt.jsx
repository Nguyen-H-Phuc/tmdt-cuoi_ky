import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const CheckoutSuccessReceipt = ({
  paymentMethod,
  orderId,
  checkoutItems = [],
  fullName,
  phone,
  deliveryMethod,
  dormInfo,
  university,
  specificAddress,
  totalAmount
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-8 max-w-[600px] mx-auto shadow-sm border border-neutral-100 text-center animate-scale-up">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-500 rounded-full mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        {paymentMethod === 'vnpay' 
          ? "Giao dịch thanh toán qua VNPAY đã hoàn tất. Người bán đã nhận được đơn hàng của bạn." 
          : "Đơn hàng COD của bạn đã được gửi thành công đến người bán."}
      </p>

      {/* Receipt detail box */}
      <div className="bg-neutral-50 rounded-2xl p-5 text-left text-xs mb-8 space-y-3.5 border border-neutral-100">
        <div className="flex justify-between items-center pb-2.5 border-b border-neutral-200">
          <span className="text-gray-400 uppercase font-semibold">Mã đơn hàng</span>
          <span className="font-bold text-gray-800">{orderId}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-400 shrink-0">Sản phẩm đặt mua</span>
          <div className="text-right max-w-[250px] space-y-1">
            {checkoutItems.map((item, idx) => (
              <div key={item.productId || idx} className="font-semibold text-gray-800 truncate" title={item.title}>
                {item.title} {item.quantity > 1 ? `(x${item.quantity})` : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-400 shrink-0">Người bán</span>
          <span className="font-semibold text-gray-800 text-right max-w-[250px]">
            {Array.from(new Set(checkoutItems.map(item => item.seller?.fullName || item.sellerName || "Ẩn danh"))).join(', ')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Người nhận</span>
          <span className="font-semibold text-gray-800">{fullName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Số điện thoại</span>
          <span className="font-semibold text-gray-800">{phone}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-400 shrink-0">Điểm nhận hàng</span>
          <span className="font-semibold text-gray-800 text-right leading-relaxed max-w-[250px]">
            {deliveryMethod === 'campus' 
              ? `${dormInfo}, ${university}` 
              : specificAddress}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Phương thức thanh toán</span>
          <span className="font-semibold text-gray-800">
            {paymentMethod === 'vnpay' ? 'Ví điện tử VNPAY (Đã thanh toán)' : 'Tiền mặt khi nhận hàng (COD)'}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-neutral-200 text-sm font-bold text-gray-800">
          <span>Số tiền đã thanh toán</span>
          <span className="text-brand-price text-base font-extrabold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
          </span>
        </div>
      </div>

      {/* Stepper controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          to="/" 
          className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition uppercase tracking-wider"
        >
          Tiếp tục mua sắm
        </Link>
        <button 
          onClick={() => navigate('/chat')}
          className="px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-neutral-900 font-bold rounded-xl text-xs transition uppercase tracking-wider shadow-sm"
        >
          Chat với người bán
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccessReceipt;
