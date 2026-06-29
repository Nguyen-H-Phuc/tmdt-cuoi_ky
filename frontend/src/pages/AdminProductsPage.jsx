import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import AdminConfirmModal from '../components/AdminConfirmModal';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Check, X, Trash2, Tag, AlertCircle } from 'lucide-react';

const AdminProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
    return `/${url}`;
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproval, setFilterApproval] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Modal details state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

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

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/products/admin');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products from backend:', err);
      // Fallback: in case backend is offline, load mock products
      setProducts(getMockProducts());
      showToast('Không thể kết nối đến backend, đang hiển thị dữ liệu mẫu.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleToggleHide = async (productId, currentHidden) => {
    try {
      const newHidden = !currentHidden;
      await axios.put(`http://localhost:8080/api/products/${productId}/hidden?hidden=${newHidden}`);
      
      setProducts(prev => 
        prev.map(p => p.productId === productId ? { ...p, isHidden: newHidden } : p)
      );
      if (selectedProduct?.productId === productId) {
        setSelectedProduct(prev => ({ ...prev, isHidden: newHidden }));
      }
      showToast(newHidden ? 'Đã ẩn sản phẩm thành công!' : 'Đã hiển thị sản phẩm trở lại!', 'success');
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái ẩn:", error);
      showToast("Không thể thay đổi trạng thái ẩn của sản phẩm.", "error");
    }
  };

  const handleApprove = async (productId) => {
    try {
      await axios.put(`http://localhost:8080/api/products/${productId}/approval`, null, { params: { status: 'approved' } });
      setProducts(prev => 
        prev.map(p => p.productId === productId ? { ...p, approvalStatus: 'approved', status: 'available' } : p)
      );
      if (selectedProduct?.productId === productId) {
        setSelectedProduct(prev => ({ ...prev, approvalStatus: 'approved', status: 'available' }));
      }
      showToast('Đã phê duyệt sản phẩm thành công!', 'success');
    } catch (err) {
      console.error('Error approving product:', err);
      showToast('Không thể kết nối với máy chủ để phê duyệt.', 'error');
    }
  };

  const handleReject = (productId) => {
    triggerConfirm(
      () => executeReject(productId),
      {
        title: 'Từ chối bài đăng',
        message: 'Bạn có chắc chắn từ chối bài đăng này? Tin đăng này sẽ chuyển sang trạng thái từ chối.',
        type: 'warning',
        confirmText: 'Từ chối',
        cancelText: 'Hủy bỏ'
      }
    );
  };

  const executeReject = async (productId) => {
    try {
      await axios.put(`http://localhost:8080/api/products/${productId}/approval`, null, { params: { status: 'rejected' } });
      setProducts(prev => 
        prev.map(p => p.productId === productId ? { ...p, approvalStatus: 'rejected' } : p)
      );
      if (selectedProduct?.productId === productId) {
        setSelectedProduct(prev => ({ ...prev, approvalStatus: 'rejected' }));
      }
      showToast('Đã từ chối bài đăng này.', 'warning');
    } catch (err) {
      console.error('Error rejecting product:', err);
      showToast('Không thể kết nối với máy chủ để từ chối bài đăng.', 'error');
    }
  };

  const handleDelete = (productId) => {
    triggerConfirm(
      () => executeDelete(productId),
      {
        title: 'Xóa vĩnh viễn sản phẩm',
        message: 'Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này khỏi sàn? Dữ liệu này không thể khôi phục.',
        type: 'danger',
        confirmText: 'Xóa vĩnh viễn',
        cancelText: 'Hủy bỏ'
      }
    );
  };

  const executeDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${productId}`);
      setProducts(prev => prev.filter(p => p.productId !== productId));
      if (selectedProduct?.productId === productId) {
        setSelectedProduct(null);
        setModalOpen(false);
      }
      showToast('Đã xóa sản phẩm thành công.', 'info');
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Không thể kết nối với máy chủ để xóa sản phẩm.', 'error');
    }
  };

  // Helper mock values
  const getMockProducts = () => [
    {
      productId: 1,
      title: 'Ex xuống áo 2010 vàng đen siêu đẹp nợ xấu đưa 8tr5',
      price: 26800000,
      category: 'Xe cộ',
      status: 'available',
      approvalStatus: 'approved',
      quantity: 1,
      viewCount: 120,
      description: 'Máy móc nguyên bản êm ru, đi giữ gìn kỹ.',
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'],
      seller: { fullName: 'Xe Máy Cũ Hải Nguyễn', email: 'hainguyen@example.com', phone: '0901234567' }
    },
    {
      productId: 3,
      title: 'Nghỉ bán thanh lý đồ Nam shop',
      price: 120000,
      category: 'Thời trang, Đồ dùng cá nhân',
      status: 'available',
      approvalStatus: 'approved',
      quantity: 1,
      viewCount: 45,
      description: 'Chất vải đũi mát mẻ cho mùa hè.',
      images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80'],
      seller: { fullName: 'Nhơn', email: 'nhon@example.com', phone: '0987654321' }
    },
    {
      productId: 991,
      title: 'Sách Giải Tích 1 + 2 Bách Khoa',
      price: 50000,
      category: 'Giải trí, Thể thao, Sở thích',
      status: 'available',
      approvalStatus: 'pending',
      quantity: 1,
      viewCount: 0,
      description: 'Sách còn mới 95%, không viết vẽ bậy.',
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'],
      seller: { fullName: 'Trần Văn Hoàng', email: 'hoangtv@student.edu.vn', phone: '0933221144' }
    }
  ];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.seller?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesApproval = filterApproval === 'all' || product.approvalStatus === filterApproval;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || 
                            product.categoryId === parseInt(filterCategory, 10) ||
                            (product.category && (
                              (typeof product.category === 'object' && product.category.categoryId === parseInt(filterCategory, 10)) ||
                              (typeof product.category === 'string' && product.category === categories.find(c => c.categoryId === parseInt(filterCategory, 10))?.categoryName)
                            ));
    return matchesSearch && matchesApproval && matchesStatus && matchesCategory;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Table columns definition
  const columns = [
    {
      key: 'image',
      label: 'Ảnh',
      render: (row) => {
        const rawImage = row.images?.[0] || row.imageUrl;
        const itemImage = resolveImageUrl(rawImage) || 'https://placehold.co/100x100?text=No+Img';
        return (
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
            <img 
              src={itemImage} 
              alt={row.title} 
              className="w-full h-full object-cover"
            />
          </div>
        );
      }
    },
    {
      key: 'title',
      label: 'Sản phẩm',
      sortable: true,
      render: (row) => (
        <div className="max-w-xs md:max-w-sm">
          <span className="font-bold text-gray-900 block truncate hover:text-yellow-600 transition-colors">
            {row.title}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-gray-400">
              Mã sản phẩm: #{row.productId}
            </span>
            {row.isHidden && (
              <span className="bg-amber-100 text-amber-700 text-[8px] font-extrabold px-1 py-0.5 rounded uppercase tracking-wider">
                Đã ẩn
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
          <Tag size={12} className="text-gray-400 shrink-0" />
          {typeof row.category === 'object' ? row.category.categoryName : row.category}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Giá',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-brand-price">
          {row.price === 0 ? 'Cho tặng' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.price)}
        </span>
      )
    },
    {
      key: 'seller',
      label: 'Người đăng',
      render: (row) => (
        <div>
          <span className="font-bold text-gray-800 block truncate max-w-[120px]">
            {row.seller?.fullName || 'Ẩn danh'}
          </span>
          <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">
            {row.seller?.email || '-'}
          </span>
        </div>
      )
    },
    {
      key: 'approvalStatus',
      label: 'Duyệt bài',
      render: (row) => {
        const status = row.approvalStatus || 'pending';
        return (
          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
            status === 'approved' 
              ? 'bg-green-50 border-green-150 text-green-700'
              : status === 'rejected'
              ? 'bg-red-50 border-red-150 text-red-700'
              : 'bg-amber-55 bg-amber-50 border border-amber-100 text-amber-600'
          }`}>
            {status === 'approved' ? 'Đã duyệt' : status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Hành động',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setSelectedProduct(row);
              setModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Xem chi tiết"
          >
            <Eye size={13} />
          </button>

          <button
            onClick={() => handleToggleHide(row.productId, row.isHidden)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              row.isHidden 
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-100 text-amber-600 hover:text-amber-700' 
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-950'
            }`}
            title={row.isHidden ? "Hiện sản phẩm" : "Ẩn sản phẩm"}
          >
            {row.isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          
          {row.approvalStatus === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row.productId)}
                className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-100 hover:border-green-200 text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                title="Phê duyệt bài đăng"
              >
                <Check size={13} />
              </button>
              <button
                onClick={() => handleReject(row.productId)}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                title="Từ chối bài đăng"
              >
                <X size={13} />
              </button>
            </>
          )}

          <button
            onClick={() => handleDelete(row.productId)}
            className="p-1.5 rounded-lg bg-white border border-gray-250 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer"
            title="Xóa sản phẩm"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview stats bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">Danh sách bài đăng</h2>
          <p className="text-xs text-gray-500 mt-1">
            Duyệt các bài đăng của sinh viên hoặc ẩn/xóa bài đăng vi phạm chính sách.
          </p>
        </div>
      </div>

      {/* Main Table Wrapper */}
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
          placeholder: 'Tìm tên sản phẩm hoặc người bán...',
          value: searchTerm,
          onChange: (val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }
        }}
        filters={[
          {
            key: 'approvalStatus',
            label: 'Duyệt bài',
            value: filterApproval,
            onChange: (val) => {
              setFilterApproval(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả trạng thái duyệt' },
              { value: 'pending', label: 'Chờ phê duyệt' },
              { value: 'approved', label: 'Đã phê duyệt' },
              { value: 'rejected', label: 'Đã bị từ chối' }
            ]
          },
          {
            key: 'status',
            label: 'Trạng thái bán',
            value: filterStatus,
            onChange: (val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả trạng thái bán' },
              { value: 'available', label: 'Đang bán' },
              { value: 'sold', label: 'Đã bán' }
            ]
          },
          {
            key: 'categoryId',
            label: 'Danh mục',
            value: filterCategory,
            onChange: (val) => {
              setFilterCategory(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả danh mục' },
              ...categories.map(cat => ({
                value: cat.categoryId.toString(),
                label: cat.categoryName
              }))
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

      {/* Details Modal */}
      {selectedProduct && (
        <AdminModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Chi tiết bài đăng #${selectedProduct.productId}`}
          size="lg"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
              {selectedProduct.approvalStatus === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedProduct.productId);
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-600 hover:text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <X size={14} /> Từ chối
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedProduct.productId);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={14} /> Duyệt bài
                  </button>
                </>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            
            {/* Upper: Images and quick meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Product Image Gallery */}
              <div className="space-y-3">
                <div className="w-full h-56 rounded-xl overflow-hidden border border-gray-150 bg-gray-50 flex items-center justify-center shrink-0 relative">
                  <img 
                    src={resolveImageUrl(selectedProduct.images?.[activeImageIndex] || selectedProduct.imageUrl) || 'https://placehold.co/300x200?text=No+Image'} 
                    alt={selectedProduct.title} 
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.images?.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                      {activeImageIndex + 1} / {selectedProduct.images.length}
                    </div>
                  )}
                </div>
                
                {/* Thumbnails */}
                {selectedProduct.images?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx ? 'border-brand-primary bg-neutral-100 scale-95' : 'border-transparent bg-neutral-50 hover:border-gray-250'
                        }`}
                      >
                        <img 
                          src={resolveImageUrl(img)} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Details */}
              <div className="space-y-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider block">
                    {typeof selectedProduct.category === 'object' ? selectedProduct.category.categoryName : selectedProduct.category}
                  </span>
                  <h4 className="text-sm md:text-base font-extrabold text-gray-900 font-display mt-0.5 leading-snug">
                    {selectedProduct.title}
                  </h4>
                  <div className="text-base md:text-lg font-extrabold text-brand-price mt-2">
                    {selectedProduct.price === 0 ? 'Cho tặng miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price)}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Lượt xem:</span>
                    <span className="font-bold text-gray-800">{selectedProduct.viewCount} lượt</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Tình trạng bán:</span>
                    <span className={`font-bold uppercase text-[10px] ${
                      selectedProduct.status === 'available' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {selectedProduct.status === 'available' ? 'Đang bán' : 'Đã bán'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Trạng thái duyệt:</span>
                    <span className={`font-bold ${
                      selectedProduct.approvalStatus === 'approved' ? 'text-green-600' : selectedProduct.approvalStatus === 'rejected' ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {selectedProduct.approvalStatus === 'approved' ? 'Đã duyệt' : selectedProduct.approvalStatus === 'rejected' ? 'Đã từ chối' : 'Chờ phê duyệt'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Lower: Description & Seller info */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              
              {/* Product description */}
              <div className="space-y-1.5">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Mô tả chi tiết</h5>
                <p className="text-xs text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-100 leading-relaxed font-medium">
                  {selectedProduct.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
                </p>
              </div>

              {/* Seller Information */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Thông tin người đăng bài</h5>
                <div className="bg-yellow-50/40 rounded-xl p-4 border border-yellow-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-xs font-semibold text-gray-650">
                    Họ và tên: <span className="font-bold text-gray-900">{selectedProduct.seller?.fullName || 'Ẩn danh'}</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-650">
                    Số điện thoại: <span className="font-bold text-gray-900">{selectedProduct.seller?.phone || 'Chưa cung cấp'}</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-650 sm:col-span-2">
                    Email: <span className="font-bold text-gray-900">{selectedProduct.seller?.email || '-'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </AdminModal>
      )}

    </div>
  );
};

export default AdminProductsPage;
