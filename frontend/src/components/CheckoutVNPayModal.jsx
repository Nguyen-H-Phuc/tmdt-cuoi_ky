import React from 'react';
import { QrCode, CreditCard, Wallet, Lock } from 'lucide-react';

const CheckoutVNPayModal = ({
  showVNPayModal,
  vnpayTab,
  setVnpayTab,
  selectedBank,
  setSelectedBank,
  vnpayProcessing,
  orderId,
  productTitle,
  totalAmount,
  handleVNPayPayment
}) => {
  if (!showVNPayModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[600px] animate-scale-up">
        
        {/* VNPay Modal Left Side: Form Options */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto flex flex-col">
          
          {/* VNPay Mockup Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5 shrink-0">
            <div className="flex items-center gap-1.5">
              {/* Styled mock logo */}
              <span className="text-lg tracking-tighter text-blue-800 font-extrabold italic">VN<span className="text-red-500 font-extrabold">Pay</span></span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1.5 border-l border-neutral-200">Cổng thanh toán</span>
            </div>
            <div className="bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide animate-pulse">
              SANDBOX MÔ PHỎNG
            </div>
          </div>

          {/* Selection Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 shrink-0 text-xs font-bold text-gray-600">
            <button 
              onClick={() => setVnpayTab('qr')}
              className={`flex-1 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${vnpayTab === 'qr' ? 'bg-white text-blue-800 shadow-sm' : 'hover:text-gray-800'}`}
            >
              <QrCode size={14} /> VNPAY-QR
            </button>
            <button 
              onClick={() => setVnpayTab('atm')}
              className={`flex-1 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${vnpayTab === 'atm' ? 'bg-white text-blue-800 shadow-sm' : 'hover:text-gray-800'}`}
            >
              <CreditCard size={14} /> Thẻ ATM
            </button>
            <button 
              onClick={() => setVnpayTab('wallet')}
              className={`flex-1 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${vnpayTab === 'wallet' ? 'bg-white text-blue-800 shadow-sm' : 'hover:text-gray-800'}`}
            >
              <Wallet size={14} /> Ví điện tử
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 flex flex-col justify-center items-center">
            
            {/* 1. VNPAY QR Tab */}
            {vnpayTab === 'qr' && (
              <div className="text-center w-full max-w-xs animate-fade-in flex flex-col items-center">
                <p className="text-[11px] text-gray-500 mb-3 font-semibold">Quét mã bằng ứng dụng Ngân hàng hoặc Ví VNPAY</p>
                
                {/* Simulated QR Box */}
                <div className="relative w-44 h-44 bg-neutral-50 border-4 border-blue-500 rounded-2xl flex items-center justify-center p-3 shadow-md mb-4 overflow-hidden">
                  {/* Fake QR image using SVG */}
                  <svg className="w-full h-full text-neutral-800" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M5,5 h30 v30 h-30 z M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" />
                    <path d="M65,5 h30 v30 h-30 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" />
                    <path d="M5,65 h30 v30 h-30 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" />
                    <rect x="45" y="45" width="10" height="10" className="text-blue-600" />
                    <rect x="5" y="40" width="5" height="5" />
                    <rect x="40" y="5" width="5" height="5" />
                    <rect x="55" y="55" width="15" height="15" />
                    <rect x="80" y="80" width="15" height="15" />
                    <rect x="85" y="55" width="5" height="10" />
                    <rect x="55" y="85" width="10" height="5" />
                    <rect x="40" y="80" width="5" height="15" />
                    <rect x="80" y="40" width="15" height="5" />
                  </svg>
                  {/* Brand indicator in QR center */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white border border-blue-100 rounded-lg flex items-center justify-center shadow">
                    <span className="text-[8px] font-extrabold text-blue-800 italic tracking-tighter">VN<span className="text-red-500">P</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-xl text-[10px] leading-relaxed max-w-[260px] mx-auto text-left font-medium">
                  <Lock size={12} className="shrink-0 text-blue-600" />
                  <p>Mở app ngân hàng, chọn quét mã QR. Sau đó bấm nút "Xác nhận đã quét" bên dưới để hoàn tất.</p>
                </div>
              </div>
            )}

            {/* 2. ATM/Bank Tab */}
            {vnpayTab === 'atm' && (
              <div className="w-full animate-fade-in flex flex-col gap-4">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Chọn ngân hàng nội địa:</p>
                
                {/* Bank Grid selection */}
                <div className="grid grid-cols-3 gap-2">
                  {['Vietcombank', 'Techcombank', 'BIDV', 'Vietinbank', 'Agribank', 'VPBank'].map((bankName) => (
                    <div 
                      key={bankName}
                      onClick={() => setSelectedBank(bankName)}
                      className={`p-2.5 border rounded-xl text-center cursor-pointer transition text-xs font-bold ${selectedBank === bankName ? 'border-blue-600 bg-blue-50/50 text-blue-800' : 'border-neutral-200 hover:border-neutral-300 text-gray-600'}`}
                    >
                      {bankName}
                    </div>
                  ))}
                </div>

                {selectedBank && (
                  <div className="mt-2 bg-neutral-50 rounded-xl p-3 border border-neutral-200/60 text-[11px] space-y-2 animate-fade-in">
                    <p className="font-bold text-gray-700">Thông tin thẻ demo:</p>
                    <div className="grid grid-cols-2 gap-2 text-gray-500">
                      <div>Số thẻ: <span className="font-semibold text-gray-800">9704 1987 5643 2130</span></div>
                      <div>Tên: <span className="font-semibold text-gray-800">NGUYEN VAN A</span></div>
                      <div>Ngày phát hành: <span className="font-semibold text-gray-800">07/20</span></div>
                      <div>Mã OTP: <span className="font-semibold text-gray-800">123456</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. E-Wallet Tab */}
            {vnpayTab === 'wallet' && (
              <div className="text-center w-full max-w-xs animate-fade-in flex flex-col items-center gap-3">
                <Wallet size={36} className="text-blue-800" />
                <h4 className="font-bold text-sm text-gray-800">Ví điện tử VNPAY</h4>
                <p className="text-[11px] text-gray-400 max-w-[200px]">Đăng nhập ví điện tử VNPAY bằng số điện thoại để thực hiện thanh toán trực tiếp.</p>
                
                <div className="w-full space-y-2.5 text-left mt-2">
                  <input 
                    type="tel" 
                    disabled 
                    placeholder="Số điện thoại ví (Mặc định)" 
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs outline-none cursor-not-allowed" 
                  />
                  <input 
                    type="password" 
                    disabled 
                    placeholder="Mật khẩu ví (Mặc định)" 
                    className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            )}

          </div>

          {/* Bottom Actions inside gateway */}
          <div className="mt-8 pt-4 border-t border-neutral-100 flex gap-2 shrink-0">
            <button 
              onClick={() => handleVNPayPayment('fail')}
              className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition uppercase"
            >
              Hủy giao dịch
            </button>
            <button 
              onClick={() => handleVNPayPayment('success')}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition uppercase shadow-md shadow-blue-500/20"
            >
              {vnpayTab === 'qr' ? 'Xác nhận đã quét' : 'Thanh toán ngay'}
            </button>
          </div>
        </div>

        {/* VNPay Modal Right Side: Cart Invoice details */}
        <div className="w-full md:w-[260px] bg-slate-50 border-t md:border-t-0 md:border-l border-neutral-100 p-5 md:p-6 flex flex-col justify-between select-none">
          <div className="space-y-4">
            <h3 className="font-extrabold text-[12px] uppercase text-gray-400 tracking-wider">Thông tin đơn hàng</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-medium">Nhà cung cấp</span>
                <p className="font-bold text-gray-800 mt-0.5">CHỢ SINH VIÊN</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-medium">Mã giao dịch</span>
                <p className="font-bold text-gray-800 mt-0.5">{orderId}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-medium">Sản phẩm thanh toán</span>
                <p className="font-bold text-gray-800 mt-0.5 line-clamp-2 leading-relaxed">{productTitle}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-medium">Số tiền thanh toán</span>
                <p className="text-lg font-black text-blue-800 mt-0.5">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Safe Checkout badge */}
          <div className="mt-8 border-t border-neutral-200/60 pt-4 flex items-center gap-2.5 text-blue-800">
            <Lock size={16} className="shrink-0" />
            <div className="text-[10px] leading-relaxed text-gray-500">
              <span className="font-bold text-gray-700 block">Thanh toán bảo mật</span>
              Hệ thống mã hóa SSL 256-bit chuẩn quốc tế.
            </div>
          </div>
        </div>

        {/* VNPAY PROCESSING SCREEN OVERLAY */}
        {vnpayProcessing && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-4 z-50 animate-fade-in">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="font-bold text-sm text-gray-800">Đang xử lý giao dịch...</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Vui lòng không tắt hoặc tải lại trang web.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutVNPayModal;
