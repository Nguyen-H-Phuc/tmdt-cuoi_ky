import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { submitReview } from '../api/orderApi';

const ReviewModal = ({ isOpen, onClose, product, reviewerId, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Vui lòng chọn số sao đánh giá (1-5 sao).');
      return;
    }
    if (!comment.trim()) {
      setError('Vui lòng nhập nhận xét của bạn.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitReview(product.productId, reviewerId, rating, comment.trim());
      onSubmitSuccess();
      onClose();
      // Reset form
      setRating(5);
      setComment('');
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
      const errMsg = err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi gửi đánh giá.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Đánh giá sản phẩm</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Product Summary */}
          <div className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <img 
              src={product.imageUrl || 'https://placehold.co/80'} 
              alt={product.title} 
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-xs font-bold text-gray-800 truncate">{product.title}</h4>
              <p className="text-[11px] text-gray-500 mt-1">Được bán bởi: <span className="font-semibold text-gray-700">{product.seller?.fullName || 'Người bán'}</span></p>
            </div>
          </div>

          {/* Star Selection */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs font-semibold text-gray-600">Đánh giá chất lượng sản phẩm</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform active:scale-95 duration-100"
                >
                  <Star 
                    size={28} 
                    className={`transition-colors duration-150 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-medium text-amber-500">
              {rating === 1 && 'Rất tệ'}
              {rating === 2 && 'Không tốt'}
              {rating === 3 && 'Bình thường'}
              {rating === 4 && 'Tốt'}
              {rating === 5 && 'Tuyệt vời'}
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="review-comment" className="text-xs font-semibold text-gray-600">Viết nhận xét của bạn</label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm mua hàng và chất lượng món đồ của bạn để giúp các bạn sinh viên khác nhé..."
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-all resize-none text-gray-800"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[11px] text-red-500 font-medium text-center">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
