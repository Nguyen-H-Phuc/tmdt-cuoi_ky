import React from 'react';
import { Wallet } from 'lucide-react';

const CheckoutPaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-50">
      <h2 className="text-[16px] font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-neutral-100">
        <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        {/* VNPay Option */}
        <div 
          onClick={() => setPaymentMethod('vnpay')}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'vnpay' ? 'border-brand-primary bg-brand-primary/5' : 'border-neutral-100 hover:border-neutral-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
              <span className="text-sm tracking-tighter text-blue-800 font-extrabold italic">VN<span className="text-red-500">Pay</span></span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                Thanh toán online qua cổng VNPAY
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded-full font-bold">Khuyên dùng</span>
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Ví VNPay, Thẻ ATM nội địa, Thẻ quốc tế, quét mã QR.</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vnpay' ? 'border-brand-accent bg-brand-primary' : 'border-gray-300'}`}>
            {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full" />}
          </div>
        </div>

        {/* COD Option */}
        <div 
          onClick={() => setPaymentMethod('cod')}
          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary/5' : 'border-neutral-100 hover:border-neutral-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 font-bold shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-800">Thanh toán khi nhận hàng (COD)</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Giao dịch trực tiếp với người bán tại khuôn viên trường.</p>
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-accent bg-brand-primary' : 'border-gray-300'}`}>
            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentMethod;
