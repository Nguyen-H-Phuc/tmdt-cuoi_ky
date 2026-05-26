import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../components/RevenueChart';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  BarChart3, 
  AlertTriangle, 
  Check, 
  X, 
  ShieldAlert, 
  Clock, 
  RefreshCw, 
  Star, 
  MessageSquare, 
  ArrowRight,
  ExternalLink,
  Video as VideoIcon
} from 'lucide-react';
import axios from 'axios';

const DashboardPage = () => {
    const { user, isLogin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' hoặc 'reports'
    
    // States cho quản lý báo cáo
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Kiểm tra quyền truy cập (chỉ cho phép admin)
        if (!isLogin) {
            navigate('/login');
        } else if (user && user.role !== 'admin') {
            // Nếu không phải admin thì không có quyền truy cập dashboard này
            setError('Bạn không có quyền truy cập trang quản lý nền tảng.');
        }
    }, [user, isLogin, navigate]);

    useEffect(() => {
        if (user && user.role === 'admin' && activeTab === 'reports') {
            fetchReports();
        }
    }, [user, activeTab]);

    const fetchReports = async () => {
        try {
            setLoadingReports(true);
            const response = await axios.get('http://localhost:8080/api/reviews/reports');
            setReports(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Không thể kết nối đến máy chủ để lấy danh sách báo cáo.');
        } finally {
            setLoadingReports(false);
        }
    };

    const handleApproveReport = async (reportId) => {
        if (!window.confirm('Bạn có chắc chắn chấp nhận báo cáo này? Việc này sẽ XÓA đánh giá bị báo cáo khỏi hệ thống.')) {
            return;
        }

        try {
            setProcessingId(reportId);
            await axios.post(`http://localhost:8080/api/reviews/reports/${reportId}/approve`);
            // Cập nhật danh sách reports cục bộ
            setReports(prev => prev.filter(r => r.reportId !== reportId));
            alert('Đã chấp nhận báo cáo và xóa đánh giá vi phạm thành công.');
        } catch (err) {
            console.error('Error approving report:', err);
            alert('Có lỗi xảy ra khi phê duyệt báo cáo.');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectReport = async (reportId) => {
        if (!window.confirm('Bạn có chắc chắn từ chối báo cáo này? Đánh giá bị báo cáo vẫn sẽ được giữ lại.')) {
            return;
        }

        try {
            setProcessingId(reportId);
            await axios.post(`http://localhost:8080/api/reviews/reports/${reportId}/reject`);
            // Cập nhật trạng thái trong list cục bộ
            setReports(prev => prev.map(r => r.reportId === reportId ? { ...r, status: 'REJECTED' } : r));
            alert('Đã từ chối báo cáo.');
        } catch (err) {
            console.error('Error rejecting report:', err);
            alert('Có lỗi xảy ra khi từ chối báo cáo.');
        } finally {
            setProcessingId(null);
        }
    };

    if (error && user?.role !== 'admin') {
        return (
            <div className="max-w-md mx-auto my-16 bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <ShieldAlert size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Quyền truy cập bị từ chối</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Khu vực này chỉ dành cho quản trị viên của hệ thống. Tài khoản của bạn không có đủ thẩm quyền để xem nội dung này.
                </p>
                <button 
                    onClick={() => navigate('/')} 
                    className="w-full py-2 bg-brand-primary hover:bg-brand-hover text-gray-900 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;

    return (
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-8">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
                <div>
                    <h1 style={{ color: '#111827' }} className="text-3xl font-bold mb-2">
                        Tổng quan nền tảng
                    </h1>
                    <p className="text-base text-gray-600">
                        Theo dõi tổng giá trị giao dịch và quản trị hệ thống trao đổi.
                    </p>
                </div>

                {/* Tab buttons */}
                <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200/50 w-fit shrink-0">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'analytics'
                                ? 'bg-white text-gray-900 shadow-xs'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <BarChart3 size={16} /> Thống kê & Doanh thu
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                            activeTab === 'reports'
                                ? 'bg-white text-gray-900 shadow-xs'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <AlertTriangle size={16} /> Báo cáo Đánh giá
                        {pendingReportsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-bounce">
                                {pendingReportsCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'analytics' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Biểu đồ giao dịch */}
                    <div className="w-full">
                        <RevenueChart />
                    </div>

                    {/* Khối lối tắt tới quản lý báo cáo */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between min-h-[450px]">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Quản trị Đánh giá & Báo cáo</h3>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Người bán có thể báo cáo các đánh giá không khách quan hoặc sai sự thật. Hãy xem xét lý do báo cáo của người bán và tiến hành xử lý để đảm bảo môi trường giao dịch công bằng.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase block">Báo cáo chưa xử lý</span>
                                <span className="text-2xl font-extrabold text-gray-800">{pendingReportsCount} yêu cầu</span>
                            </div>
                            <button 
                                onClick={() => setActiveTab('reports')}
                                className="flex items-center gap-1.5 text-xs font-bold text-brand-price hover:underline cursor-pointer"
                            >
                                Xem ngay <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Toolbar báo cáo */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-base font-bold text-gray-800">Danh sách báo cáo đánh giá ({reports.length})</h2>
                        <button 
                            onClick={fetchReports}
                            disabled={loadingReports}
                            className="p-2 hover:bg-gray-50 border border-gray-200 rounded-lg text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        >
                            <RefreshCw size={14} className={loadingReports ? 'animate-spin' : ''} /> Tải lại
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs">
                            {error}
                        </div>
                    )}

                    {loadingReports ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-accent mb-3"></div>
                            <p className="text-gray-500 font-medium text-xs">Đang tải danh sách báo cáo...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                <Check size={28} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-800">Không có báo cáo nào</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                                    Hệ thống hiện tại không ghi nhận bất kỳ báo cáo đánh giá nào từ phía người bán cần xử lý.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {reports.map((report) => {
                                const formattedDate = report.createdAt 
                                    ? new Date(report.createdAt).toLocaleDateString('vi-VN', {
                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                      })
                                    : '';

                                return (
                                    <div 
                                        key={report.reportId} 
                                        className={`bg-white rounded-xl border p-5 shadow-xs space-y-4 transition-all ${
                                            report.status === 'PENDING' 
                                                ? 'border-l-4 border-l-red-500 border-gray-150' 
                                                : 'border-gray-100 opacity-75'
                                        }`}
                                    >
                                        {/* Báo cáo Meta */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-400">Báo cáo #{report.reportId}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-[10px] text-gray-500 font-medium">{formattedDate}</span>
                                            </div>

                                            {/* Badge trạng thái */}
                                            {report.status === 'PENDING' ? (
                                                <span className="flex items-center gap-1 text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                                    <Clock size={10} /> Chờ xử lý
                                                </span>
                                            ) : report.status === 'REJECTED' ? (
                                                <span className="flex items-center gap-1 text-[9px] font-extrabold text-gray-500 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-full">
                                                    <X size={10} /> Đã bác bỏ báo cáo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[9px] font-extrabold text-green-600 bg-green-50 border border-green-150 px-2 py-0.5 rounded-full">
                                                    <Check size={10} /> Đã chấp nhận
                                                </span>
                                            )}
                                        </div>

                                        {/* Nội dung đối chiếu */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 rounded-xl p-4 border border-gray-100/50">
                                            {/* Phần đánh giá bị báo cáo */}
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Đánh giá bị báo cáo</h4>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-gray-700">
                                                        <span className="font-bold text-gray-800">{report.reviewerName}</span>
                                                        <span className="text-gray-300">đăng trên</span>
                                                        <span className="text-blue-600 font-semibold truncate max-w-[150px]">{report.productTitle}</span>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star 
                                                                key={s} 
                                                                size={11} 
                                                                className={s <= report.reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-600 italic">"{report.reviewComment}"</p>
                                                </div>
                                            </div>

                                            {/* Phần lý do báo cáo */}
                                            <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                                                <h4 className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider">Lý do báo cáo từ người bán</h4>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-gray-700 font-bold">Người bán báo cáo: <span className="font-bold text-gray-800">{report.reporterName}</span></p>
                                                    <p className="text-xs text-red-650 font-medium leading-relaxed">
                                                        "{report.reason}"
                                                    </p>
                                                    {(report.proofImage || report.proofVideo) && (
                                                        <div className="pt-2 mt-2 border-t border-gray-200/60 space-y-1.5">
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Bằng chứng đính kèm:</p>
                                                            <div className="flex gap-3">
                                                                {report.proofImage && (
                                                                    <div className="relative group rounded-lg overflow-hidden border border-gray-200 w-16 h-16 bg-gray-100 shrink-0">
                                                                        <img src={report.proofImage} alt="Bằng chứng ảnh" className="w-full h-full object-cover" />
                                                                        <a 
                                                                            href={report.proofImage} 
                                                                            target="_blank" 
                                                                            rel="noreferrer" 
                                                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                                        >
                                                                            <ExternalLink size={12} />
                                                                        </a>
                                                                    </div>
                                                                )}
                                                                {report.proofVideo && (
                                                                    <div className="relative group rounded-lg overflow-hidden border border-gray-200 w-16 h-16 bg-gray-150 flex flex-col items-center justify-center shrink-0">
                                                                        <VideoIcon size={20} className="text-gray-500 mb-0.5" />
                                                                        <a 
                                                                            href={report.proofVideo} 
                                                                            target="_blank" 
                                                                            rel="noreferrer" 
                                                                            className="text-[8px] text-blue-600 font-bold hover:underline"
                                                                        >
                                                                            Xem video
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hành động xử lý dành cho Admin */}
                                        {report.status === 'PENDING' && (
                                            <div className="flex gap-3 justify-end pt-2">
                                                <button
                                                    onClick={() => handleRejectReport(report.reportId)}
                                                    disabled={processingId === report.reportId}
                                                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <X size={14} /> Bác bỏ báo cáo
                                                </button>
                                                <button
                                                    onClick={() => handleApproveReport(report.reportId)}
                                                    disabled={processingId === report.reportId}
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <Check size={14} /> Chấp nhận & Xóa đánh giá
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;