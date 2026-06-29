import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  X, 
  Info, 
  Upload, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const MyReviewsCard = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State Toast thông báo
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State cho Modal báo cáo
  const [selectedReview, setSelectedReview] = useState(null);
  const [reportReasonType, setReportReasonType] = useState('Đánh giá không đúng sự thật');
  const [customReason, setCustomReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // States cho Upload bằng chứng
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [proofVideoUrl, setProofVideoUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (user?.userId) {
      fetchReviews();
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reviews/seller/${user.userId}`);
      setReviews(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Không thể kết nối đến máy chủ để lấy danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReportModal = (review) => {
    setSelectedReview(review);
    setReportReasonType('Đánh giá không đúng sự thật');
    setCustomReason('');
    setProofImageUrl('');
    setProofVideoUrl('');
    setUploadError('');
    setSuccessMessage('');
  };

  const handleCloseReportModal = () => {
    setSelectedReview(null);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = type === 'video' ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File quá lớn. Tối đa cho phép là ${type === 'video' ? '20MB' : '5MB'}.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      if (type === 'image') {
        setUploadingImage(true);
      } else {
        setUploadingVideo(true);
      }
      setUploadError('');

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reviews/upload-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { fileUrl } = response.data;
      if (type === 'image') {
        setProofImageUrl(fileUrl);
      } else {
        setProofVideoUrl(fileUrl);
      }
    } catch (err) {
      console.error('Upload proof error:', err);
      setUploadError(err.response?.data?.message || 'Tải file lên thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
      setUploadingVideo(false);
    }
  };

  const removeProof = (type) => {
    if (type === 'image') {
      setProofImageUrl('');
    } else {
      setProofVideoUrl('');
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedReview || !user?.userId) return;

    let finalReason = reportReasonType;
    if (reportReasonType === 'Khác' && customReason.trim() !== '') {
      finalReason = customReason.trim();
    } else if (reportReasonType === 'Khác') {
      showToast('Vui lòng nhập lý do cụ thể.', 'error');
      return;
    }

    try {
      setSubmittingReport(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reviews/${selectedReview.reviewId}/report`, {
        reason: finalReason,
        reporterId: user.userId,
        proofImage: proofImageUrl || null,
        proofVideo: proofVideoUrl || null
      });

      setSuccessMessage(response.data.message || 'Đã gửi báo cáo thành công!');
      // Reload reviews sau khi báo cáo
      setTimeout(() => {
        fetchReviews();
        handleCloseReportModal();
      }, 1500);

    } catch (err) {
      console.error('Error reporting review:', err);
      showToast(err.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo.', 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  // Tính điểm đánh giá trung bình và tỷ lệ các mức sao
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : 0.0;

  const starsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      starsCount[r.rating]++;
    }
  });

  const getStarPercentage = (starNum) => {
    if (totalReviews === 0) return 0;
    return Math.round((starsCount[starNum] / totalReviews) * 100);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-accent mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Đang tải đánh giá...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6 space-y-6 relative">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#222222]">Đánh giá từ khách hàng</h2>
          <p className="text-xs text-gray-500 mt-1">Xem phản hồi của người mua về sản phẩm bạn đã đăng bán</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100 text-xs">
          <Info size={16} />
          <span>{error}</span>
        </div>
      )}

      {totalReviews === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
            <MessageSquare size={32} className="text-gray-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#222222]">Chưa có đánh giá nào</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Bạn chưa nhận được phản hồi nào từ người mua. Đánh giá sẽ xuất hiện khi các giao dịch hoàn thành thành công.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <div className="text-center shrink-0 w-full sm:w-auto pb-4 sm:pb-0 sm:pr-6 sm:border-r sm:border-gray-200">
              <h3 className="text-4xl font-extrabold text-amber-500">{averageRating}</h3>
              <div className="flex gap-0.5 justify-center mt-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={14} 
                    className={s <= Math.round(averageRating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-bold block mt-2">{totalReviews} đánh giá</span>
            </div>

            <div className="flex-1 w-full text-[11px] text-gray-500 space-y-2">
              {[5, 4, 3, 2, 1].map((starNum) => (
                <div key={starNum} className="flex items-center gap-2">
                  <span className="w-8 shrink-0">{starNum} sao</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                      style={{ width: `${getStarPercentage(starNum)}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right shrink-0 font-bold">{getStarPercentage(starNum)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.map((review) => {
              const formattedDate = review.createdAt 
                ? new Date(review.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  })
                : '';

              return (
                <div key={review.reviewId} className="p-4 rounded-xl border border-gray-100 space-y-3 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={(!review.user?.avatar || review.user.avatar === 'null') 
                          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?.fullName || 'Reviewer'}` 
                          : review.user.avatar} 
                        alt={review.user?.fullName} 
                        className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0" 
                      />
                      <div>
                        <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5 flex-wrap">
                          {review.user?.fullName}
                          <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-full shrink-0">
                            <ShieldCheck size={10} /> Người mua
                          </span>
                        </h4>
                        <p className="text-[10px] text-gray-400">Đã giao dịch thành công</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{formattedDate}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={13} 
                          className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed italic">
                      "{review.content}"
                    </p>
                  </div>

                  {/* Hiển thị bằng chứng nếu đã báo cáo */}
                  {(review.proofImage || review.proofVideo) && (
                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2 text-xs">
                      <p className="font-bold text-gray-500 text-[10px] uppercase">Bằng chứng đã cung cấp:</p>
                      <div className="flex gap-4">
                        {review.proofImage && (
                          <div className="relative group rounded-lg overflow-hidden border border-gray-200 w-16 h-16 bg-gray-100 shrink-0">
                            <img src={review.proofImage} alt="Bằng chứng ảnh" className="w-full h-full object-cover" />
                            <a 
                              href={review.proofImage} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                        {review.proofVideo && (
                          <div className="relative group rounded-lg overflow-hidden border border-gray-200 w-16 h-16 bg-gray-100 flex items-center justify-center shrink-0">
                            <VideoIcon size={20} className="text-gray-500" />
                            <a 
                              href={review.proofVideo} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold gap-0.5"
                            >
                              Xem <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="bg-gray-50 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-gray-500 border border-gray-100/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare size={12} className="text-gray-400 shrink-0" />
                      <span className="font-semibold shrink-0">Sản phẩm:</span>
                      <span className="text-blue-600 font-bold truncate max-w-[200px] sm:max-w-xs">{review.productTitle}</span>
                    </div>

                    {/* Report Action Section */}
                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-auto">
                      {review.reportStatus === 'PENDING' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                          <Clock size={11} className="animate-pulse" /> Báo cáo: Chờ xử lý
                        </span>
                      ) : review.reportStatus === 'REJECTED' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                            Báo cáo bị từ chối
                          </span>
                          <button 
                            onClick={() => handleOpenReportModal(review)}
                            className="flex items-center gap-1 text-[10px] font-bold text-brand-price hover:bg-red-50 border border-brand-price/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                          >
                            <AlertTriangle size={11} /> Báo cáo lại
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleOpenReportModal(review)}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer"
                        >
                          <AlertTriangle size={11} /> Báo cáo sai sự thật
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal báo cáo vi phạm */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-sm text-[#222222] flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" /> Báo cáo đánh giá sai sự thật
              </h3>
              <button 
                onClick={handleCloseReportModal}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitReport} className="p-5 space-y-4">
              {successMessage ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <ShieldCheck size={28} />
                  </div>
                  <p className="text-xs font-bold text-green-700">{successMessage}</p>
                  <p className="text-[10px] text-gray-400">Giao diện sẽ tự động cập nhật...</p>
                </div>
              ) : (
                <>
                  {/* Trích dẫn đánh giá */}
                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-[11px] space-y-1">
                    <p className="text-gray-400 font-semibold">Đánh giá của: <span className="text-gray-700 font-bold">{selectedReview.user?.fullName}</span></p>
                    <p className="text-gray-600 italic">"{selectedReview.content}"</p>
                  </div>

                  {/* Lựa chọn lý do */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-700 block">Chọn lý do báo cáo:</label>
                    <div className="space-y-2 text-xs text-gray-600">
                      {[
                        'Đánh giá không đúng sự thật',
                        'Chứa thông tin xuyên tạc, vu khống',
                        'Ngôn từ thô tục, xúc phạm danh dự',
                        'Spam, quảng cáo, không liên quan đến giao dịch',
                        'Khác'
                      ].map((reasonOption) => (
                        <label key={reasonOption} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all">
                          <input 
                            type="radio" 
                            name="reportReason" 
                            value={reasonOption} 
                            checked={reportReasonType === reasonOption}
                            onChange={(e) => setReportReasonType(e.target.value)}
                            className="text-brand-accent focus:ring-brand-accent shrink-0"
                          />
                          <span>{reasonOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Nhập lý do khác */}
                  {reportReasonType === 'Khác' && (
                    <div className="space-y-1.5 animate-slide-down">
                      <label className="text-[11px] font-bold text-gray-700 block">Lý do chi tiết:</label>
                      <textarea 
                        required
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Vui lòng nhập lý do cụ thể vì sao đánh giá này không đúng sự thật..."
                        className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none min-h-[80px] resize-none"
                      />
                    </div>
                  )}

                  {/* Tải bằng chứng chứng minh (Ảnh, Video) */}
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-[11px] font-bold text-gray-700 block">Bằng chứng chứng minh (Không bắt buộc):</label>
                    
                    {uploadError && (
                      <p className="text-[10px] text-red-500 font-medium">{uploadError}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {/* Bằng chứng Ảnh */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-semibold text-gray-500">Hình ảnh bằng chứng</span>
                        {proofImageUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-gray-200 h-24 bg-gray-50">
                            <img src={proofImageUrl} alt="Bằng chứng" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeProof('image')}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-24 cursor-pointer hover:bg-gray-50 transition-colors">
                            {uploadingImage ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-accent border-t-transparent"></div>
                            ) : (
                              <>
                                <ImageIcon size={20} className="text-gray-400 mb-1" />
                                <span className="text-[9px] text-gray-400 font-bold">Chọn ảnh (&lt;5MB)</span>
                              </>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(e, 'image')}
                              disabled={uploadingImage}
                            />
                          </label>
                        )}
                      </div>

                      {/* Bằng chứng Video */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-semibold text-gray-500">Video bằng chứng</span>
                        {proofVideoUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border border-gray-200 h-24 bg-gray-50 flex items-center justify-center">
                            <VideoIcon size={28} className="text-gray-500" />
                            <span className="absolute bottom-1.5 text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded-full font-bold">Đã tải lên</span>
                            <button 
                              type="button" 
                              onClick={() => removeProof('video')}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-24 cursor-pointer hover:bg-gray-50 transition-colors">
                            {uploadingVideo ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-accent border-t-transparent"></div>
                            ) : (
                              <>
                                <VideoIcon size={20} className="text-gray-400 mb-1" />
                                <span className="text-[9px] text-gray-400 font-bold">Chọn video (&lt;20MB)</span>
                              </>
                            )}
                            <input 
                              type="file" 
                              accept="video/*" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(e, 'video')}
                              disabled={uploadingVideo}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nút thao tác */}
                  <div className="flex gap-3 pt-3 border-t border-gray-50">
                    <button 
                      type="button"
                      onClick={handleCloseReportModal}
                      disabled={submittingReport || uploadingImage || uploadingVideo}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingReport || uploadingImage || uploadingVideo}
                      className="flex-1 py-2 bg-brand-primary hover:bg-brand-hover text-gray-900 text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {submittingReport ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                      ) : 'Gửi báo cáo'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-5 right-5 z-[9999] bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.12)] border p-4 flex items-center gap-3 animate-slide-in-right min-w-[300px] max-w-sm ${
          toast.type === 'success' ? 'border-emerald-100' : 
          toast.type === 'error' ? 'border-red-100' : 'border-blue-100'
        }`}>
          <div className={`p-1.5 rounded-full shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
            toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
          }`}>
            {toast.type === 'success' ? <ShieldCheck size={16} /> :
             toast.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
          </div>
          <p className="text-xs font-bold text-gray-700 flex-1 leading-normal">{toast.message}</p>
          <button 
            type="button"
            onClick={() => setToast({ ...toast, show: false })}
            className="text-gray-400 hover:text-gray-650 p-0.5 rounded-full hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyReviewsCard;
