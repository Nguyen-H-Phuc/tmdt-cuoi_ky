import React from 'react';

const CheckoutReceiverForm = ({ fullName, setFullName, phone, setPhone, errors }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-50">
      <h2 className="text-[16px] font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-neutral-100">
        <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
        Thông tin người nhận hàng
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Họ và Tên</label>
          <input 
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên"
            className={`w-full px-4 py-2.5 bg-neutral-50/50 border ${errors.fullName ? 'border-red-400 focus:border-red-400' : 'border-neutral-200 focus:border-brand-accent'} rounded-xl outline-none text-sm transition`}
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Số điện thoại liên hệ</label>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            className={`w-full px-4 py-2.5 bg-neutral-50/50 border ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-neutral-200 focus:border-brand-accent'} rounded-xl outline-none text-sm transition`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutReceiverForm;
