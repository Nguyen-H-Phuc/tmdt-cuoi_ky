import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import AdminConfirmModal from '../components/AdminConfirmModal';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, Tag, Upload } from 'lucide-react';

const AdminCategoriesPage = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Form states for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', type: 'danger' });

  const triggerConfirm = (callback, config) => {
    setConfirmCallback(() => callback);
    setConfirmConfig(config);
    setConfirmOpen(true);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('default.png');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback dummy categories if server is offline
      setCategories([
        { categoryId: 1, categoryName: 'Bất động sản', categoryImage: 'home.png' },
        { categoryId: 2, categoryName: 'Xe cộ', categoryImage: 'vehicle.png' },
        { categoryId: 3, categoryName: 'Thú cưng', categoryImage: 'pet.png' },
        { categoryId: 4, categoryName: 'Đồ gia dụng, nội thất', categoryImage: 'appliance.png' },
        { categoryId: 5, categoryName: 'Giải trí, Thể thao, Sở thích', categoryImage: 'entertainment.png' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('Kích thước ảnh không được vượt quá 3MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/products/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCategoryImage(res.data.imageUrl);
      showToast('Đã tải hình ảnh lên thành công!', 'success');
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi khi tải ảnh lên.';
      showToast(errMsg, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditMode(false);
    setSelectedCategory(null);
    setCategoryName('');
    setCategoryImage('default.png');
    setModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditMode(true);
    setSelectedCategory(category);
    setCategoryName(category.categoryName);
    setCategoryImage(category.categoryImage || 'default.png');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      showToast('Vui lòng điền tên danh mục.', 'error');
      return;
    }

    try {
      if (editMode && selectedCategory) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories/${selectedCategory.categoryId}`, {
          categoryName,
          categoryImage
        });
        const updatedCategory = response.data;
        setCategories(prev => 
          prev.map(c => c.categoryId === selectedCategory.categoryId ? updatedCategory : c)
        );
        showToast('Đã cập nhật danh mục thành công!', 'success');
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories`, {
          categoryName,
          categoryImage
        });
        const newCategory = response.data;
        setCategories(prev => [newCategory, ...prev]);
        showToast('Đã thêm danh mục mới thành công!', 'success');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      const errMsg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục.';
      showToast(errMsg, 'error');
    }
  };

  const handleDelete = (categoryId, name) => {
    triggerConfirm(
      () => executeDelete(categoryId),
      {
        title: 'Xóa danh mục sản phẩm',
        message: `Bạn có chắc chắn muốn xóa danh mục "${name}"? Các bài đăng thuộc danh mục này có thể bị ảnh hưởng.`,
        type: 'danger',
        confirmText: 'Xóa danh mục',
        cancelText: 'Hủy bỏ'
      }
    );
  };

  const executeDelete = async (categoryId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories/${categoryId}`);
      setCategories(prev => prev.filter(c => c.categoryId !== categoryId));
      showToast('Đã xóa danh mục thành công.', 'info');
    } catch (error) {
      console.error('Error deleting category:', error);
      const errMsg = error.response?.data?.message || 'Không thể xóa danh mục này.';
      showToast(errMsg, 'error');
    }
  };

  // Sort Logic
  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
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
  const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  const columns = [
    {
      key: 'categoryId',
      label: 'Mã ID',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-gray-800">#{row.categoryId}</span>
      )
    },
    {
      key: 'categoryName',
      label: 'Tên danh mục',
      sortable: true,
      render: (row) => {
        const catImage = row.categoryImage?.startsWith('http') || row.categoryImage?.startsWith('/')
          ? row.categoryImage
          : `/assets/category/${row.categoryImage || 'default.png'}`;
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-150 overflow-hidden shrink-0">
              <img 
                src={catImage} 
                alt={row.categoryName} 
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/32x32?text=No+Img';
                }}
              />
            </div>
            <span className="font-bold text-gray-900">{row.categoryName}</span>
          </div>
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
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 rounded-lg border border-gray-250 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Chỉnh sửa danh mục"
          >
            <Edit2 size={13} />
          </button>
          
          <button
            onClick={() => handleDelete(row.categoryId, row.categoryName)}
            className="p-1.5 rounded-lg bg-white border border-gray-250 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-gray-400 transition-colors cursor-pointer"
            title="Xóa danh mục"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header with action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display">Quản lý danh mục</h2>
          <p className="text-xs text-gray-500 mt-1">
            Thiết lập danh mục sản phẩm của sàn giao dịch sinh viên.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
        >
          <Plus size={16} /> Thêm danh mục mới
        </button>
      </div>

      {/* Categories Table */}
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

      {/* Add / Edit Category Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? `Sửa danh mục #${selectedCategory?.categoryId}` : 'Thêm danh mục sản phẩm mới'}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-250 hover:bg-gray-55 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-gray-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {editMode ? 'Lưu thay đổi' : 'Thêm danh mục'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Category Name Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Tên danh mục</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Đồ dùng học tập, Điện tử, Thú cưng..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-medium border border-gray-250 rounded-xl focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800"
            />
          </div>

          {/* Icon/Image File Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Hình ảnh biểu tượng (Icon)</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 relative">
                {categoryImage ? (
                  <img 
                    src={categoryImage.startsWith('http') || categoryImage.startsWith('/') ? categoryImage : `/assets/category/${categoryImage}`} 
                    alt="Category Preview" 
                    className="w-full h-full object-contain p-1.5"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/64x64?text=No+Img';
                    }}
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Chưa có</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-750 hover:text-gray-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={14} /> Tải ảnh lên
                </button>
                <span className="block text-[10px] text-gray-400">
                  Hỗ trợ định dạng JPG, PNG, WEBP tối đa 3MB.
                </span>
              </div>
            </div>
          </div>

        </form>
      </AdminModal>

    </div>
  );
};

export default AdminCategoriesPage;
