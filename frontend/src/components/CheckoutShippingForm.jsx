import React from 'react';
import { Building, Truck } from 'lucide-react';

const CheckoutShippingForm = ({
  deliveryMethod,
  setDeliveryMethod,
  university,
  setUniversity,
  dormInfo,
  setDormInfo,
  specificAddress,
  setSpecificAddress,
  notes,
  setNotes,
  errors
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-50">
      <h2 className="text-[16px] font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-neutral-100">
        <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
        Phương thức nhận hàng
      </h2>

      {/* Switchable delivery methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div 
          onClick={() => setDeliveryMethod('campus')}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${deliveryMethod === 'campus' ? 'border-brand-primary bg-brand-primary/5' : 'border-neutral-100 hover:border-neutral-200'}`}
        >
          <Building className={`w-5 h-5 mt-0.5 ${deliveryMethod === 'campus' ? 'text-brand-accent' : 'text-gray-400'}`} />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Nhận tại Trường học / KTX</h4>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Hẹn gặp tại khuôn viên trường hoặc phòng ký túc xá. (Không tốn phí)</p>
          </div>
        </div>

        <div 
          onClick={() => setDeliveryMethod('home')}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${deliveryMethod === 'home' ? 'border-brand-primary bg-brand-primary/5' : 'border-neutral-100 hover:border-neutral-200'}`}
        >
          <Truck className={`w-5 h-5 mt-0.5 ${deliveryMethod === 'home' ? 'text-brand-accent' : 'text-gray-400'}`} />
          <div>
            <h4 className="font-bold text-xs text-gray-800">Giao hàng tận nơi</h4>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Giao đến địa chỉ riêng bên ngoài thông qua dịch vụ giao vận (+20.000đ)</p>
          </div>
        </div>
      </div>

      {/* Render address fields based on selection */}
      {deliveryMethod === 'campus' ? (
        <div className="space-y-4 animate-fade-in mt-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Tên trường đại học</label>
            <input 
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
              className={`w-full px-4 py-2.5 bg-neutral-50/50 border ${errors.university ? 'border-red-400' : 'border-neutral-200'} rounded-xl outline-none focus:border-brand-accent text-sm transition`}
            />
            {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Điểm hẹn chi tiết (Ký túc xá, tòa nhà, số phòng)</label>
            <input 
              type="text"
              value={dormInfo}
              onChange={(e) => setDormInfo(e.target.value)}
              placeholder="Ví dụ: Phòng 402 - KTX B10, hoặc Cổng Parabol"
              className={`w-full px-4 py-2.5 bg-neutral-50/50 border ${errors.dormInfo ? 'border-red-400' : 'border-neutral-200'} rounded-xl outline-none focus:border-brand-accent text-sm transition`}
            />
            {errors.dormInfo && <p className="text-red-500 text-xs mt-1">{errors.dormInfo}</p>}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in mt-2">
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Địa chỉ chi tiết nhận hàng</label>
          <textarea 
            rows="3"
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
            placeholder="Số nhà, ngõ/ngách, tên đường, phường/xã, quận/huyện..."
            className={`w-full px-4 py-2.5 bg-neutral-50/50 border ${errors.specificAddress ? 'border-red-400' : 'border-neutral-200'} rounded-xl outline-none focus:border-brand-accent text-sm transition resize-none`}
          />
          {errors.specificAddress && <p className="text-red-500 text-xs mt-1">{errors.specificAddress}</p>}
        </div>
      )}
      
      <div className="mt-4">
        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Ghi chú cho người bán</label>
        <textarea 
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Lời nhắn đặc biệt, thời gian giao hàng thuận tiện..."
          className="w-full px-4 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl outline-none focus:border-brand-accent text-sm transition resize-none"
        />
      </div>
    </div>
  );
};

export default CheckoutShippingForm;
