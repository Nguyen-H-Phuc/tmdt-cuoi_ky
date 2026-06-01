import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import AdminConfirmModal from '../components/AdminConfirmModal';
import { useToast } from '../context/ToastContext';
import { ShieldAlert, AlertTriangle, Eye, Check, X, Star, ExternalLink, Video as VideoIcon, Calendar } from 'lucide-react';

const AdminReportsPage = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Detail Modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', type: 'danger' });

  const triggerConfirm = (callback, config) => {
    setConfirmCallback(() => callback);
    setConfirmConfig(config);
    setConfirmOpen(true);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/reviews/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Không thể kết nối đến máy chủ để lấy danh sách báo cáo đánh giá.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleApproveReport = (reportId) => {
    triggerConfirm(
      () => executeApproveReport(reportId),
      {
        title: 'Chấp nhận báo cáo',
        message: 'Bạn có chắc chắn chấp nhận báo cáo này? Việc này sẽ XÓA đánh giá bị báo cáo khỏi hệ thống.',
        type: 'danger',
        confirmText: 'Chấp nhận & Xóa',
        cancelText: 'Hủy bỏ'
      }
    );
  };

  const executeApproveReport = async (reportId) => {
    try {
      setProcessingId(reportId);
      await axios.post(`http://localhost:8080/api/reviews/reports/${reportId}/approve`);
      
      // Update local state
      setReports(prev => prev.map(r => r.reportId === reportId ? { ...r, status: 'APPROVED' } : r));
      if (selectedReport?.reportId === reportId) {
        setSelectedReport(prev => ({ ...prev, status: 'APPROVED' }));
      }
      showToast('Đã chấp nhận báo cáo và xóa đánh giá vi phạm thành công.', 'success');
    } catch (err) {
      console.error('Error approving report:', err);
      showToast('Có lỗi xảy ra khi phê duyệt báo cáo.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectReport = (reportId) => {
    triggerConfirm(
      () => executeRejectReport(reportId),
      {
        title: 'Từ chối báo cáo',
        message: 'Bạn có chắc chắn từ chối báo cáo này? Đánh giá bị báo cáo vẫn sẽ được giữ lại.',
        type: 'warning',
        confirmText: 'Từ chối báo cáo',
        cancelText: 'Hủy bỏ'
      }
    );
  };

  const executeRejectReport = async (reportId) => {
    try {
      setProcessingId(reportId);
      await axios.post(`http://localhost:8080/api/reviews/reports/${reportId}/reject`);
      
      // Update local state
      setReports(prev => prev.map(r => r.reportId === reportId ? { ...r, status: 'REJECTED' } : r));
      if (selectedReport?.reportId === reportId) {
        setSelectedReport(prev => ({ ...prev, status: 'REJECTED' }));
      }
      showToast('Đã từ chối báo cáo.', 'info');
    } catch (err) {
      console.error('Error rejecting report:', err);
      showToast('Có lỗi xảy ra khi từ chối báo cáo.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reviewerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.reporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.productTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort Logic
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'createdAt') {
      aVal = aVal ? new Date(aVal) : 0;
      bVal = bVal ? new Date(bVal) : 0;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortConfig.direction === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);

  const columns = [
    {
      key: 'reportId',
      label: 'Mã ID',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-gray-800">#{row.reportId}</span>
      )
    },
    {
      key: 'reporterName',
      label: 'Người báo cáo',
      render: (row) => (
        <div>
          <span className="font-bold text-gray-900 block truncate max-w-[120px]">
            {row.reporterName}
          </span>
          <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider mt-0.5">
            Bán hàng
          </span>
        </div>
      )
    },
    {
      key: 'reviewerName',
      label: 'Đánh giá bị báo cáo',
      render: (row) => (
        <div className="max-w-xs md:max-w-sm">
          <div className="flex items-center gap-1.5 text-xs text-gray-700">
            <span className="font-bold text-gray-850">{row.reviewerName}</span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] text-gray-500 italic max-w-[150px] truncate">"{row.reviewComment}"</span>
          </div>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={10} 
                className={s <= row.reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
              />
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'reason',
      label: 'Lý do báo cáo',
      render: (row) => (
        <span className="text-xs text-red-650 font-semibold truncate max-w-[180px] block">
          "{row.reason}"
        </span>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => {
        const status = row.status || 'PENDING';
        return (
          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
            status === 'PENDING' 
              ? 'bg-amber-50 border-amber-100 text-amber-600'
              : status === 'REJECTED'
              ? 'bg-gray-50 border-gray-150 text-gray-500'
              : 'bg-green-50 border-green-150 text-green-700'
          }`}>
            {status === 'PENDING' ? 'Chờ xử lý' : status === 'REJECTED' ? 'Bác bỏ' : 'Chấp nhận'}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Thời gian',
      sortable: true,
      render: (row) => (
        <span className="text-[10px] text-gray-400 font-bold block">
          {row.createdAt 
            ? new Date(row.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
              })
            : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Hành động',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setSelectedReport(row);
              setModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-gray-250 bg-white hover:bg-gray-55 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Chi tiết đối chiếu"
          >
            <Eye size={13} />
          </button>
          
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApproveReport(row.reportId)}
                disabled={processingId === row.reportId}
                className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-100 hover:border-green-200 text-green-600 hover:text-green-700 transition-colors cursor-pointer disabled:opacity-50"
                title="Chấp nhận & Xóa đánh giá"
              >
                <Check size={13} />
              </button>
              <button
                onClick={() => handleRejectReport(row.reportId)}
                disabled={processingId === row.reportId}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
                title="Bác bỏ báo cáo"
              >
                <X size={13} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-display">Báo cáo đánh giá</h2>
        <p className="text-xs text-gray-500 mt-1">
          Xét duyệt các báo cáo đánh giá tiêu cực từ người bán đối với khách mua hàng.
        </p>
      </div>

      {/* Overview stats & description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 items-start shadow-2xs">
          <div className="p-2.5 bg-red-50 text-red-500 rounded-xl shrink-0">
            <ShieldAlert size={22} className="text-red-500 shrink-0" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Quản trị Đánh giá & Báo cáo vi phạm</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Người bán có thể báo cáo các đánh giá không khách quan hoặc sai sự thật. Hãy đối chiếu chi tiết nội dung đánh giá của người mua với lý do báo cáo và bằng chứng của người bán để đưa ra quyết định xử lý phù hợp nhằm đảm bảo môi trường giao dịch công bằng.
            </p>
          </div>
        </div>

        <div className="bg-linear-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-5 text-white flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Báo cáo chưa xử lý</span>
            <span className="text-2xl font-extrabold text-brand-primary block mt-1">
              {reports.filter(r => r.status === 'PENDING').length} yêu cầu
            </span>
          </div>
          <div className="text-[10px] text-gray-400 font-medium mt-2 pt-2 border-t border-gray-800 flex justify-between">
            <span>Tổng số: {reports.length}</span>
            <span className="text-emerald-400">Đã duyệt: {reports.filter(r => r.status === 'APPROVED').length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs">
          {error}
        </div>
      )}

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={currentItems}
        isLoading={isLoading}
        onSort={(key, dir) => setSortConfig({ key, direction: dir })}
        currentSort={sortConfig}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
        search={{
          placeholder: 'Tìm người báo cáo, đánh giá, sản phẩm...',
          value: searchTerm,
          onChange: (val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }
        }}
        filters={[
          {
            key: 'status',
            label: 'Trạng thái',
            value: filterStatus,
            onChange: (val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả báo cáo' },
              { value: 'PENDING', label: 'Chờ xử lý' },
              { value: 'APPROVED', label: 'Đã chấp nhận (Xóa đánh giá)' },
              { value: 'REJECTED', label: 'Đã bác bỏ' }
            ]
          }
        ]}
      />

      {/* Reusable Confirm Modal */}
      <AdminConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setConfirmCallback(null);
        }}
        onConfirm={confirmCallback || (() => {})}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        type={confirmConfig.type}
      />

      {/* Detail & Action Modal */}
      {selectedReport && (
        <AdminModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Đối chiếu báo cáo #${selectedReport.reportId}`}
          size="lg"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-255 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
              {selectedReport.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      handleRejectReport(selectedReport.reportId);
                    }}
                    disabled={processingId === selectedReport.reportId}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-600 hover:text-rose-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <X size={14} /> Bác bỏ báo cáo
                  </button>
                  <button
                    onClick={() => {
                      handleApproveReport(selectedReport.reportId);
                    }}
                    disabled={processingId === selectedReport.reportId}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={14} /> Chấp nhận & Xóa đánh giá
                  </button>
                </>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            
            {/* Header: Report Status Banner */}
            <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1 text-gray-500 font-medium">
                <Calendar size={14} className="text-gray-400" />
                <span>Thời gian: {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleString('vi-VN') : '-'}</span>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  selectedReport.status === 'PENDING' 
                    ? 'bg-amber-50 border-amber-100 text-amber-600'
                    : selectedReport.status === 'REJECTED'
                    ? 'bg-gray-50 border-gray-150 text-gray-500'
                    : 'bg-green-50 border-green-150 text-green-700'
                }`}>
                  {selectedReport.status === 'PENDING' ? 'Đang chờ xử lý' : selectedReport.status === 'REJECTED' ? 'Đã bác bỏ' : 'Đã chấp nhận'}
                </span>
              </div>
            </div>

            {/* Split Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Review card */}
              <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Nội dung đánh giá</h4>
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-700 font-semibold">
                    Người mua: <span className="font-bold text-gray-900">{selectedReport.reviewerName}</span>
                  </div>
                  <div className="text-xs text-gray-700 font-semibold">
                    Đăng tại sản phẩm: <span className="font-bold text-blue-600">{selectedReport.productTitle}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={12} 
                        className={s <= selectedReport.reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-650 bg-white border border-gray-100 rounded-lg p-2.5 italic">
                    "{selectedReport.reviewComment || 'Không ghi nội dung.'}"
                  </p>
                </div>
              </div>

              {/* Report card */}
              <div className="border border-red-150/60 rounded-xl p-4 bg-red-50/20 space-y-3">
                <h4 className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider block">Lý do báo cáo vi phạm</h4>
                <div className="space-y-1.5">
                  <div className="text-xs text-gray-700 font-semibold">
                    Người báo cáo (Người bán): <span className="font-bold text-gray-900">{selectedReport.reporterName}</span>
                  </div>
                  <p className="text-xs text-red-650 font-medium bg-white border border-red-100 rounded-lg p-2.5 leading-relaxed">
                    "{selectedReport.reason}"
                  </p>
                </div>
              </div>

            </div>

            {/* Proof Area */}
            {(selectedReport.proofImage || selectedReport.proofVideo) && (
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Bằng chứng đính kèm từ người bán</h4>
                <div className="flex gap-3">
                  {selectedReport.proofImage && (
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-24 h-24 bg-gray-100 shrink-0">
                      <img src={selectedReport.proofImage} alt="Ảnh bằng chứng" className="w-full h-full object-cover" />
                      <a 
                        href={selectedReport.proofImage} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                  {selectedReport.proofVideo && (
                    <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-24 h-24 bg-gray-150 flex flex-col items-center justify-center shrink-0">
                      <VideoIcon size={24} className="text-gray-500 mb-1" />
                      <a 
                        href={selectedReport.proofVideo} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[9px] text-blue-600 font-bold hover:underline"
                      >
                        Mở xem Video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </AdminModal>
      )}

    </div>
  );
};

export default AdminReportsPage;
