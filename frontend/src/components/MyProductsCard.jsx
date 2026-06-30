import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { 
  Edit, Trash2, Eye, PlusCircle, CheckCircle, X, Loader2, 
  Upload, Search, Filter, AlertCircle, ShoppingBag, FileText, Image as ImageIcon,
  EyeOff, Zap
} from 'lucide-react';

const MyProductsCard = () => {
  const { user } = useAuth();
  
  // List states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, available, sold
  const [approvalFilter, setApprovalFilter] = useState('all'); // all, pending, approved, rejected
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // all, visible, hidden
  
  // Alert banner state
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [boostingProduct, setBoostingProduct] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('Cơ Bản');
  
  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [targetUniversity, setTargetUniversity] = useState('Tất cả');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const fileInputRef = useRef(null);

  // Fetch initial data
  const fetchData = async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      // 1. Fetch user products
      const productsRes = await apiClient.get(`/api/products/my-products?userId=${user.userId}`);
      setProducts(productsRes.data || []);
      
      // 2. Fetch categories if not fetched yet
      if (categories.length === 0) {
        const categoriesRes = await apiClient.get('/api/categories');
        setCategories(categoriesRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
      showBanner('error', 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'boost_success') {
      showBanner('success', 'Thanh toán thành công! Tin đăng của bạn đã được đẩy lên đầu trang.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'boost_fail') {
      showBanner('error', 'Thanh toán đẩy tin thất bại hoặc đã bị huỷ.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Helper to show temporary alert banner
  const showBanner = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 4000);
  };

  // Toggle availability status
  const handleToggleStatus = async (productId, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'sold' : 'available';
    try {
      const response = await apiClient.put(`/api/products/${productId}/status?status=${nextStatus}`);
      if (response.status === 200) {
        setProducts(prev => prev.map(p => p.productId === productId ? { ...p, status: nextStatus } : p));
        showBanner('success', `Đã cập nhật trạng thái sản phẩm thành "${nextStatus === 'available' ? 'Đang bán' : 'Đã bán'}"`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showBanner('error', 'Lỗi khi cập nhật trạng thái sản phẩm.');
    }
  };

  // Toggle hidden visibility status
  const handleToggleHidden = async (productId, currentHidden, productTitle) => {
    const nextHidden = !currentHidden;
    try {
      const response = await apiClient.put(`/api/products/${productId}/hidden?hidden=${nextHidden}`);
      if (response.status === 200) {
        setProducts(prev => prev.map(p => p.productId === productId ? { ...p, isHidden: nextHidden } : p));
        showBanner('success', `Đã ${nextHidden ? 'ẩn' : 'hiển thị lại'} bài đăng "${productTitle}" thành công.`);
      }
    } catch (error) {
      console.error('Error toggling hidden status:', error);
      showBanner('error', `Lỗi khi thực hiện thay đổi hiển thị bài đăng.`);
    }
  };

  // Soft delete product
  const handleDeleteProduct = async (productId, productTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${productTitle}"? Tin đăng này sẽ bị ẩn khỏi gian hàng.`)) {
      return;
    }
    
    try {
      const response = await apiClient.delete(`/api/products/${productId}`);
      if (response.status === 200) {
        setProducts(prev => prev.filter(p => p.productId !== productId));
        showBanner('success', 'Đã xóa bài đăng thành công.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showBanner('error', 'Lỗi khi xóa bài đăng.');
    }
  };

  // Open boost modal
  const handleOpenBoostModal = (product) => {
    setBoostingProduct(product);
    setSelectedPackage('Cơ Bản');
    setIsBoostModalOpen(true);
  };

  // Confirm and buy boost
  const handleConfirmBoost = async () => {
    if (!boostingProduct) return;
    try {
      const res = await apiClient.get('/api/boosts/payment-url', {
        params: {
          productId: boostingProduct.productId,
          packageName: selectedPackage
        }
      });
      if (res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      console.error('Error getting boost payment url:', err);
      alert('Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.');
    }
  };

  // Open modal for creating new product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setCategoryId('');
    setQuantity(1);
    setTargetUniversity('Tất cả');
    setUploadedImages([]);
    setIsModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setTitle(product.title || '');
    setPrice(product.price || '');
    setDescription(product.description || '');
    // Find category ID matching category name
    const cat = categories.find(c => c.categoryName === product.category);
    setCategoryId(cat ? cat.categoryId : '');
    setQuantity(product.quantity || 1);
    setTargetUniversity(product.targetUniversity || 'Tất cả');
    setUploadedImages(product.images || []);
    setIsModalOpen(true);
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const remainingSlots = 5 - uploadedImages.length;
    if (files.length > remainingSlots) {
      alert(`Bạn chỉ được tải tối đa 5 hình ảnh. Còn lại ${remainingSlots} chỗ.`);
      return;
    }

    setIsUploadingImage(true);
    const newUploadedUrls = [];

    for (let file of files) {
      // Client-side size limit validation (e.g. 3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (vượt quá 3MB).`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post('/api/products/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.data?.imageUrl) {
          newUploadedUrls.push(response.data.imageUrl);
        }
      } catch (err) {
        console.error('Failed to upload image:', file.name, err);
        alert(`Lỗi upload ảnh "${file.name}": ${err.response?.data?.message || err.message}`);
      }
    }

    setUploadedImages(prev => [...prev, ...newUploadedUrls].slice(0, 5));
    setIsUploadingImage(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove uploaded image preview
  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save product (Add / Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề sản phẩm.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      alert('Vui lòng nhập giá sản phẩm hợp lệ (>= 0).');
      return;
    }
    if (!categoryId) {
      alert('Vui lòng chọn danh mục sản phẩm.');
      return;
    }
    if (Number(quantity) < 1) {
      alert('Số lượng sản phẩm tối thiểu phải là 1.');
      return;
    }
    if (uploadedImages.length === 0) {
      alert('Vui lòng đăng tải ít nhất 1 hình ảnh mô tả.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // Update product
        const requestPayload = {
          title,
          price: Number(price),
          description,
          categoryId: Number(categoryId),
          quantity: Number(quantity),
          targetUniversity: targetUniversity || 'Tất cả',
          images: uploadedImages
        };

        const response = await apiClient.put(`/api/products/${editingProduct.productId}`, requestPayload);
        if (response.status === 200) {
          showBanner('success', 'Đã cập nhật bài đăng thành công. Đang chờ phê duyệt lại từ admin.');
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        // Create product
        const requestPayload = {
          title,
          price: Number(price),
          description,
          categoryId: Number(categoryId),
          sellerId: user.userId,
          quantity: Number(quantity),
          targetUniversity: targetUniversity || 'Tất cả',
          images: uploadedImages
        };

        const response = await apiClient.post('/api/products', requestPayload);
        if (response.status === 200) {
          showBanner('success', 'Đã đăng tin mới thành công. Tin đăng đang được gửi để phê duyệt.');
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert(`Không thể lưu bài đăng: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currencies
  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Filter listings based on user inputs
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'available' && product.status === 'available') ||
      (statusFilter === 'sold' && product.status === 'sold');
      
    const matchesApproval = 
      approvalFilter === 'all' || 
      (approvalFilter === 'pending' && product.approvalStatus === 'pending') ||
      (approvalFilter === 'approved' && product.approvalStatus === 'approved') ||
      (approvalFilter === 'rejected' && product.approvalStatus === 'rejected');

    const matchesVisibility = 
      visibilityFilter === 'all' || 
      (visibilityFilter === 'visible' && !product.isHidden) ||
      (visibilityFilter === 'hidden' && product.isHidden);

    return matchesSearch && matchesStatus && matchesApproval && matchesVisibility;
  });

  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-5 md:p-6 space-y-6 relative">
      
      {/* Alert Banner */}
      {message.text && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-250 animate-bounce-short' 
            : 'bg-rose-50 text-rose-800 border-rose-250'
        }`}>
          <AlertCircle size={18} />
          <span className="text-xs font-bold">{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#222222]">Bài đăng của tôi</h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý các sản phẩm bạn đang bán hoặc cho tặng</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-sm cursor-pointer shrink-0"
        >
          <PlusCircle size={15} />
          Đăng tin mới
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input 
            type="text"
            placeholder="Tìm kiếm bài đăng của bạn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl bg-white shrink-0">
            <ShoppingBag size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold text-gray-600 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">Mọi giao dịch</option>
              <option value="available">Đang bán</option>
              <option value="sold">Đã bán</option>
            </select>
          </div>

          {/* Approval Filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl bg-white shrink-0">
            <FileText size={14} className="text-gray-400" />
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="text-xs font-semibold text-gray-600 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">Mọi trạng thái duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          {/* Visibility Filter */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl bg-white shrink-0">
            <Eye size={14} className="text-gray-400" />
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="text-xs font-semibold text-gray-600 focus:outline-none bg-transparent cursor-pointer"
            >
              <option value="all">Mọi hiển thị</option>
              <option value="visible">Đang hiển thị</option>
              <option value="hidden">Đang ẩn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
          <p className="text-xs text-gray-400 font-semibold">Đang tải danh sách bài viết...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-gray-50 rounded-full text-gray-400">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700">Không tìm thấy bài viết nào</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[280px] mx-auto">
              {searchQuery || statusFilter !== 'all' || approvalFilter !== 'all' || visibilityFilter !== 'all'
                ? 'Hãy thử thay đổi điều kiện tìm kiếm hoặc bộ lọc của bạn.'
                : 'Bạn chưa có bài đăng nào. Hãy đăng tin đầu tiên ngay bây giờ!'}
            </p>
          </div>
          {(!searchQuery && statusFilter === 'all' && approvalFilter === 'all' && visibilityFilter === 'all') && (
            <button 
              onClick={handleOpenAddModal}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle size={14} /> Đăng tin ngay
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.productId} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-[0px_4px_16px_rgba(59,130,246,0.06)] transition-all duration-200">
              
              {/* Product Thumbnail (uses first image) */}
              <Link to={`/product/${product.productId}`} className="relative shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 block">
                <img 
                  src={(product.images && product.images.length > 0) ? product.images[0] : 'https://placehold.co/100x100?text=Product'} 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                />
                
                {/* Image Count Badge */}
                {product.images && product.images.length > 1 && (
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-0.5">
                    <ImageIcon size={8} /> {product.images.length}
                  </span>
                )}
              </Link>
              
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${product.productId}`}>
                        <h3 className="font-bold text-xs text-gray-800 hover:text-blue-600 cursor-pointer truncate transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      {/* Price & Quantity Info */}
                      <div className="flex items-baseline gap-3 mt-1.5">
                        <span className="text-xs font-black text-blue-600">{formatVND(product.price)}</span>
                        <span className="text-[10px] text-gray-400 font-semibold bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded">
                          Kho: {product.quantity} sản phẩm
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {/* Available / Sold Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        product.status === 'available' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {product.status === 'available' ? 'Đang bán' : 'Đã bán'}
                      </span>
                      
                      {/* Approval Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        product.approvalStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : product.approvalStatus === 'approved'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {product.approvalStatus === 'pending' && 'Chờ duyệt'}
                        {product.approvalStatus === 'approved' && 'Đã duyệt'}
                        {product.approvalStatus === 'rejected' && 'Bị từ chối'}
                      </span>

                      {/* Hidden Status Badge */}
                      {product.isHidden && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">
                          Đang ẩn
                        </span>
                      )}

                      {/* Boost Status Badge */}
                      {product.isBoosted && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-yellow-50 text-yellow-700 border border-yellow-100 flex items-center gap-0.5 animate-pulse">
                          <Zap size={8} className="fill-yellow-600 text-yellow-600" /> Đang đẩy
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium border-t border-gray-50 pt-2.5 mt-2.5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Danh mục: <strong className="text-gray-600 font-semibold">{product.category}</strong></span>
                    <span>Ngày đăng: {formatDate(product.createdAt)}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Eye size={12} /> {product.viewCount || 0} lượt xem
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Boost Post Button */}
                    {product.approvalStatus === 'approved' && product.status === 'available' && (
                      <button 
                        onClick={() => handleOpenBoostModal(product)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          product.isBoosted
                            ? 'text-yellow-600 bg-yellow-50 border-yellow-100 hover:bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 border-gray-100 hover:border-yellow-100'
                        }`}
                        title="Đẩy bài đăng lên đầu trang"
                      >
                        <Zap size={13.5} className={product.isBoosted ? 'fill-yellow-500' : ''} />
                      </button>
                    )}

                    {/* Mark Sold Button */}
                    <button 
                      onClick={() => handleToggleStatus(product.productId, product.status)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        product.status === 'available'
                          ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 border-gray-100 hover:border-emerald-100'
                          : 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:text-gray-400 hover:bg-transparent hover:border-gray-100'
                      }`}
                      title={product.status === 'available' ? 'Đánh dấu đã bán' : 'Kích hoạt bán lại'}
                    >
                      <CheckCircle size={13.5} />
                    </button>
                    
                    {/* Toggle Hidden Button */}
                    <button 
                      onClick={() => handleToggleHidden(product.productId, product.isHidden, product.title)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        product.isHidden
                          ? 'text-amber-600 bg-amber-50 border-amber-100 hover:text-gray-400 hover:bg-transparent hover:border-gray-100'
                          : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50 border-gray-100 hover:border-amber-100'
                      }`}
                      title={product.isHidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                    >
                      {product.isHidden ? <Eye size={13.5} /> : <EyeOff size={13.5} />}
                    </button>

                    {/* Edit Button */}
                    <button 
                      onClick={() => handleOpenEditModal(product)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-gray-100 hover:border-blue-100 rounded-lg transition cursor-pointer"
                      title="Sửa bài viết"
                    >
                      <Edit size={13.5} />
                    </button>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDeleteProduct(product.productId, product.title)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-lg transition cursor-pointer"
                      title="Xóa bài viết"
                    >
                      <Trash2 size={13.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MULTIPLE IMAGE & PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-sm text-[#222222]">
                  {editingProduct ? 'Chỉnh sửa bài đăng' : 'Đăng tin rao bán mới'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Vui lòng cung cấp đầy đủ thông tin chi tiết và hình ảnh chính xác của sản phẩm.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Tiêu đề tin đăng *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: Giày Sneaker Nike Air Force 1 size 41 cũ"
                  maxLength={255}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Price & Category & Stock quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Giá sản phẩm (VND) *</label>
                  <input 
                    type="number"
                    required
                    min={0}
                    placeholder="Nhập giá (0 nếu cho tặng)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-blue-600"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Danh mục *</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Số lượng sản phẩm *</label>
                  <input 
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Mô tả chi tiết sản phẩm</label>
                <textarea 
                  rows={4}
                  placeholder="Mô tả cụ thể về hiện trạng sản phẩm, thời gian sử dụng, địa chỉ giao dịch..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Target University Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Ưu tiên hiển thị cho trường học</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={targetUniversity === 'Tất cả' || targetUniversity === 'all' || !targetUniversity ? 'all' : 'custom'}
                    onChange={(e) => {
                      if (e.target.value === 'all') {
                        setTargetUniversity('Tất cả');
                      } else {
                        setTargetUniversity(user?.university || '');
                      }
                    }}
                    className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium bg-white text-gray-700"
                  >
                    <option value="all">Hiển thị cho tất cả mọi người (Không ưu tiên)</option>
                    <option value="custom">Ưu tiên cho sinh viên trường cụ thể</option>
                  </select>
                  
                  {targetUniversity !== 'Tất cả' && targetUniversity !== 'all' && (
                    <input 
                      type="text"
                      placeholder="Nhập tên trường học cần ưu tiên"
                      value={targetUniversity}
                      onChange={(e) => setTargetUniversity(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                    />
                  )}
                </div>
                <p className="text-[9px] text-gray-400">
                  Lựa chọn này giúp sản phẩm xuất hiện ưu tiên ở vị trí đầu tiên đối với các bạn sinh viên học cùng trường với bạn.
                </p>
              </div>

              {/* Product Images (Max 5) */}
              <div className="space-y-2 border border-gray-150 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">Hình ảnh sản phẩm * (Tối đa 5 hình)</label>
                    <p className="text-[9px] text-gray-400 mt-0.5">Hình ảnh đầu tiên sẽ được chọn làm ảnh hiển thị chính.</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {uploadedImages.length} / 5
                  </span>
                </div>

                {/* Image Grid Preview & Upload Button */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                  
                  {/* Uploaded Previews */}
                  {uploadedImages.map((url, idx) => (
                    <div key={idx} className="relative w-full aspect-square border border-gray-200 bg-white rounded-xl overflow-hidden group shadow-sm">
                      <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Main Image Banner */}
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[7px] font-extrabold px-1 py-0.5 rounded shadow">
                          ẢNH CHÍNH
                        </span>
                      )}
                      
                      {/* Remove Button Hover Overlay */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                        title="Xóa hình ảnh"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Upload Slots triggers input */}
                  {uploadedImages.length < 5 && (
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50/25 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer select-none"
                    >
                      {isUploadingImage ? (
                        <Loader2 size={16} className="text-blue-500 animate-spin" />
                      ) : (
                        <Upload size={16} className="text-gray-400" />
                      )}
                      <span className="text-[8px] font-bold text-gray-500 leading-tight">
                        {isUploadingImage ? 'Đang tải...' : 'Tải hình ảnh'}
                      </span>
                    </button>
                  )}

                  {/* Hidden Input file selection */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 text-xs font-bold rounded-xl transition duration-150 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition duration-150 cursor-pointer shadow-sm"
                >
                  {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                  {editingProduct ? 'Cập nhật tin đăng' : 'Đăng tin rao bán'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* BOOST MODAL */}
      {isBoostModalOpen && boostingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-sm text-[#222222] flex items-center gap-1.5">
                  <Zap size={16} className="text-yellow-500 fill-yellow-500" />
                  Đẩy tin đăng lên đầu trang
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Sản phẩm của bạn sẽ luôn hiển thị ưu tiên hàng đầu tại kết quả tìm kiếm.
                </p>
              </div>
              <button 
                onClick={() => setIsBoostModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3">
                <img 
                  src={(boostingProduct.images && boostingProduct.images.length > 0) ? boostingProduct.images[0] : 'https://placehold.co/100x100?text=Product'} 
                  alt={boostingProduct.title}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 truncate">{boostingProduct.title}</h4>
                  <p className="text-[10px] text-blue-600 font-extrabold mt-1">{formatVND(boostingProduct.price)}</p>
                </div>
              </div>

              {/* Package Options */}
              <div className="space-y-2.5">
                <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Chọn gói dịch vụ</span>
                
                {/* Basic Package */}
                <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                  selectedPackage === 'Cơ Bản'
                    ? 'border-yellow-450 bg-yellow-50/30'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="boostPackage" 
                      value="Cơ Bản"
                      checked={selectedPackage === 'Cơ Bản'}
                      onChange={() => setSelectedPackage('Cơ Bản')}
                      className="text-yellow-500 focus:ring-yellow-400"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Gói Cơ Bản (3 ngày)</span>
                      <span className="text-[10px] text-gray-400">Đẩy tin trong vòng 72 giờ</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-800 font-display">5.000đ</span>
                </label>

                {/* Standard Package */}
                <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                  selectedPackage === 'Tiêu Chuẩn'
                    ? 'border-yellow-450 bg-yellow-50/30'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="boostPackage" 
                      value="Tiêu Chuẩn"
                      checked={selectedPackage === 'Tiêu Chuẩn'}
                      onChange={() => setSelectedPackage('Tiêu Chuẩn')}
                      className="text-yellow-500 focus:ring-yellow-400"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Gói Tiêu Chuẩn (7 ngày)</span>
                      <span className="text-[10px] text-gray-400">Tiết kiệm hơn, đẩy tin trong 7 ngày</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-800 font-display">15.000đ</span>
                </label>

                {/* Premium Package */}
                <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                  selectedPackage === 'Premium'
                    ? 'border-yellow-500 bg-yellow-50/30'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="boostPackage" 
                      value="Premium"
                      checked={selectedPackage === 'Premium'}
                      onChange={() => setSelectedPackage('Premium')}
                      className="text-yellow-500 focus:ring-yellow-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block flex items-center gap-1">
                        Gói Premium (14 ngày)
                        <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">Hot</span>
                      </span>
                      <span className="text-[10px] text-gray-400">Ưu tiên tối đa trong vòng 2 tuần</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-800 font-display">30.000đ</span>
                </label>
              </div>

              <div className="text-[10px] text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-gray-100 leading-normal">
                * Sau khi xác nhận, hệ thống sẽ kết nối trực tiếp đến cổng thanh toán VNPay Sandbox để bạn hoàn thành giao dịch an toàn.
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2.5 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsBoostModalOpen(false)}
                className="px-4 py-2 border border-gray-200 hover:border-gray-350 text-gray-505 hover:text-gray-700 text-xs font-bold rounded-xl transition duration-150 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmBoost}
                className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition duration-150 cursor-pointer shadow-sm"
              >
                <Zap size={12} className="fill-gray-900" />
                Thanh toán & Đẩy bài
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyProductsCard;
