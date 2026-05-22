import React from 'react';
import { ShoppingBag, Lock } from 'lucide-react';

const CheckoutOrderSummary = ({
  product,
  coverImage,
  appliedVoucher,
  shippingFee,
  voucherDiscount,
  totalAmount,
  paymentMethod,
  handlePlaceOrder
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 sticky top-20">
      <h3 className="font-bold text-sm text-gray-800 mb-4 pb-2 border-b border-neutral-100">Chi tiết sản phẩm</h3>
      
      {/* Product brief */}
      <div className="flex gap-3 mb-4">
        <img src={coverImage} alt={product.title} className="w-16 h-16 rounded-xl object-cover bg-neutral-100 border border-neutral-100" />
        <div className="min-w-0">
          <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">{product.title}</h4>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Người bán: {product.seller?.fullName || "Ẩn danh"}</p>
          <p className="text-sm font-bold text-brand-price mt-1">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
        </div>
      </div>

      {/* Student Voucher Alert */}
      {appliedVoucher && (
        <div className="bg-brand-primary-50 border border-brand-primary-100 rounded-xl p-3 mb-5 flex items-start gap-2.5">
          <ShoppingBag className="w-4 h-4 text-brand-accent shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="font-bold text-xs text-brand-accent">Mã Sinh Viên Mới</p>
            <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">Đã áp dụng mã giảm giá 10.000đ dành cho giao dịch đầu tiên.</p>
          </div>
        </div>
      )}

      {/* Price list breakdown */}
      <div className="space-y-3 pt-3 border-t border-dashed border-neutral-100 text-xs">
        <div className="flex justify-between text-gray-500">
          <span>Giá sản phẩm</span>
          <span className="font-semibold text-gray-700">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-gray-700">
            {shippingFee > 0 ? `+${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}` : 'Miễn phí'}
          </span>
        </div>

        {appliedVoucher && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá (Sinh viên)</span>
            <span className="font-semibold">
              -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucherDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm font-bold text-gray-800 pt-3 border-t border-neutral-100">
          <span>Tổng tiền thanh toán</span>
          <span className="text-brand-price text-base font-extrabold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
          </span>
        </div>
      </div>

      {/* CTA Action button */}
      <button
        onClick={handlePlaceOrder}
        className="w-full mt-6 py-3 bg-brand-primary hover:bg-brand-hover text-neutral-900 font-bold rounded-xl transition duration-150 uppercase text-xs tracking-wider shadow-sm flex items-center justify-center gap-2"
      >
        <Lock size={14} /> 
        {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPAY' : 'Xác nhận đặt hàng (COD)'}
      </button>

      <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
        Bằng việc bấm xác nhận, bạn đồng ý với Quy chế Giao dịch và Chính sách Bảo mật của Chợ Sinh Viên.
      </p>
    </div>
  );
};

export default CheckoutOrderSummary;
