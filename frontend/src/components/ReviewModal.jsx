import React, { useState, useEffect } from 'react';
import { Star, X, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { submitReview, checkReviewEligibility } from '../api/orderApi';

const ReviewModal = ({ isOpen, onClose, product, reviewerId, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [eligibility, setEligibility] = useState({
    eligible: true,
    message: '',
    remainingEdits: 2,
    deadline: null,
    isEdit: false
  });

  // Fetch eligibility when modal opens
  useEffect(() => {
    if (isOpen && product?.productId && reviewerId) {
      const fetchEligibility = async () => {
        setLoading(true);
        setError('');
        try {
          const data = await checkReviewEligibility(product.productId, reviewerId);
          setEligibility({
            eligible: data.eligible,
            message: data.message || '',
            remainingEdits: data.remainingEdits !== undefined ? data.remainingEdits : 2,
            deadline: data.deadline,
            isEdit: !!data.review
          });

          if (data.review) {
            setRating(data.review.rating || 5);
            setComment(data.review.content || '');
          } else {
            setRating(5);
            setComment('');
          }

          if (!data.eligible) {
            setError(data.message || 'Bạn không đủ điều kiện để đánh giá sản phẩm này.');
          }
        } catch (err) {
          console.error('Lỗi khi kiểm tra điều kiện đánh giá:', err);
          setError('Không thể kiểm tra điều kiện đánh giá sản phẩm. Vui lòng thử lại sau.');
        } finally {
          setLoading(false);
        }
      };

      fetchEligibility();
    }
  }, [isOpen, product, reviewerId]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eligibility.eligible) {
      setError(eligibility.message || 'Bạn không thể đánh giá sản phẩm này.');
      return;
    }
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

  const formatDeadline = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h3 className="text-base font-bold text-gray-900">
            {eligibility.isEdit ? 'Cập nhật đánh giá' : 'Đánh giá sản phẩm'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-brand-accent" size={32} />
            <span className="text-xs text-gray-500 font-medium">Đang kiểm tra điều kiện đánh giá...</span>
          </div>
        ) : (
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

            {/* Warnings and Edit Limits info */}
            {eligibility.eligible && (
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 flex gap-2.5 text-[11px] text-amber-800 leading-relaxed">
                <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">
                    {eligibility.isEdit 
                      ? `Bạn còn ${eligibility.remainingEdits} lần chỉnh sửa đánh giá này.`
                      : 'Đánh giá của bạn có thể chỉnh sửa tối đa 2 lần.'}
                  </p>
                  {eligibility.deadline && (
                    <p className="text-amber-700/80">
                      Hạn cuối chỉnh sửa: <span className="font-semibold">{formatDeadline(eligibility.deadline)}</span> (7 ngày từ khi hoàn thành đơn).
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Star Selection */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-semibold text-gray-600">Đánh giá chất lượng sản phẩm</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!eligibility.eligible}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform active:scale-95 duration-100 disabled:opacity-50"
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
                disabled={!eligibility.eligible}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm mua hàng và chất lượng món đồ của bạn để giúp các bạn sinh viên khác nhé..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-all resize-none text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 text-[11px] text-red-700 leading-relaxed">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
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
                disabled={isSubmitting || !eligibility.eligible}
                className="px-5 py-2 text-xs font-bold text-white bg-brand-accent hover:bg-brand-accent/90 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5 text-white" />
                    Đang gửi...
                  </>
                ) : eligibility.isEdit ? (
                  'Cập nhật'
                ) : (
                  'Gửi đánh giá'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
