import React from 'react';
import { Star, MessageSquare, ShieldCheck } from 'lucide-react';

const MOCK_REVIEWS = [
  {
    id: 1,
    reviewer: {
      name: 'Trần Minh Quân',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quan',
      university: 'Đại học Sư Phạm Kỹ Thuật'
    },
    rating: 5,
    comment: 'Xe máy đi rất êm, bạn chủ nhiệt tình hỗ trợ dắt đi sang tên đổi chủ giấy tờ nhanh gọn. Uy tín luôn!',
    productTitle: 'Ex xuống áo 2010 vàng đen siêu đẹp nợ xấu đưa 8tr5',
    date: '21/05/2026'
  },
  {
    id: 2,
    reviewer: {
      name: 'Lê Thị Hồng',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hong',
      university: 'Đại học Quốc Gia'
    },
    rating: 4,
    comment: 'Tủ nhựa dùng tốt, lắp ghép dễ dàng. Có vài vết xước nhẹ do vận chuyển nhưng không sao, giá siêu rẻ.',
    productTitle: 'Tủ quần áo nhựa lắp ghép đa năng',
    date: '12/05/2026'
  }
];

const MyReviewsCard = () => {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-[#222222]">Đánh giá từ khách hàng</h2>
        <p className="text-xs text-gray-500 mt-1">Xem phản hồi của người mua về sản phẩm bạn đã trao đổi</p>
      </div>

      {/* Stats Summary */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
        <div className="text-center shrink-0">
          <h3 className="text-3xl font-extrabold text-amber-550">4.5</h3>
          <div className="flex gap-0.5 justify-center mt-1">
            {[1, 2, 3, 4].map((s) => (
              <Star key={s} size={12} className="text-amber-400 fill-amber-400" />
            ))}
            <Star size={12} className="text-gray-300" />
          </div>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">2 đánh giá</span>
        </div>

        <div className="flex-1 text-[11px] text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8">5 sao</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-[50%]"></div>
            </div>
            <span className="w-6 text-right">50%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8">4 sao</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-[50%]"></div>
            </div>
            <span className="w-6 text-right">50%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8">3 sao</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-0"></div>
            </div>
            <span className="w-6 text-right">0%</span>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="p-4 rounded-xl border border-gray-100 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <img 
                  src={review.reviewer.avatar} 
                  alt={review.reviewer.name} 
                  className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0" 
                />
                <div>
                  <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    {review.reviewer.name}
                    <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-full">
                      <ShieldCheck size={10} /> Sinh viên
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400">{review.reviewer.university}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400">{review.date}</span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={14} 
                    className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                  />
                ))}
              </div>
              <p className="text-xs text-gray-650 leading-relaxed font-medium">"{review.comment}"</p>
            </div>

            <div className="bg-gray-50/50 rounded-lg p-2.5 flex items-center gap-2 text-[10px] text-gray-500 font-bold border border-gray-100/50">
              <MessageSquare size={12} className="text-gray-400" />
              <span>Sản phẩm:</span>
              <span className="text-blue-600 underline truncate max-w-[200px] sm:max-w-xs">{review.productTitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviewsCard;
