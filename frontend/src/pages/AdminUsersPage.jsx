import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import AdminConfirmModal from '../components/AdminConfirmModal';
import { useToast } from '../context/ToastContext';
import { User, Shield, ShieldAlert, Ban, CheckCircle, Search, Edit2, Key } from 'lucide-react';

const AdminUsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Edit User modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [selectedRole, setSelectedRole] = useState('member');

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Standard user listing (in a real app, this would query an admin-only user endpoint)
        // Since we don't have it, we use fallback mock data representing the database users
        // as defined in script.sql:
        // User 1 (member), User 2 (admin), User 3 (admin), User 4 (admin), User 5 (member)
        const mockUsers = [
          { userId: 1, fullName: 'Xe Máy Cũ Hải Nguyễn', email: 'hainguyen@example.com', phone: '0901234567', address: 'Đà Nẵng', avatar: 'https://placehold.co/100x100/333333/FFFFFF?text=XM', role: 'member', isActive: true, bio: 'Chuyên trao đổi xe máy cũ chất lượng cho sinh viên', createdAt: '2026-04-12T08:30:00' },
          { userId: 2, fullName: 'Nhơn', email: 'nhon@example.com', phone: '0987654321', address: 'Tp Hồ Chí Minh', avatar: 'https://placehold.co/100x100/FFCC00/000000?text=N', role: 'admin', isActive: true, bio: 'Admin chính hệ thống', createdAt: '2026-04-13T10:15:00' },
          { userId: 3, fullName: 'Cửa Hàng Xưởng Thành Phát', email: 'thanhphat@example.com', phone: '0912345678', address: 'Tp Hồ Chí Minh', avatar: 'https://placehold.co/100x100/ADD8E6/FFFFFF?text=CH', role: 'admin', isActive: true, bio: 'Chủ xưởng nội thất đồ gỗ sinh viên', createdAt: '2026-04-14T11:45:00' },
          { userId: 4, fullName: 'Nội Thất Diễn Phát', email: 'dienphat@example.com', phone: '0998877665', address: 'Tp Hồ Chí Minh', avatar: 'https://placehold.co/100x100/FFCC00/000000?text=N', role: 'admin', isActive: true, bio: 'Cung cấp bàn ghế nhựa lắp ghép giá rẻ', createdAt: '2026-04-15T09:20:00' },
          { userId: 5, fullName: 'Nguyen Van Admin', email: 'a@gmail.com', phone: '0900000000', address: 'Hà Nội', avatar: null, role: 'member', isActive: true, bio: 'Sinh viên năm 4 đam mê công nghệ', createdAt: '2026-04-26T23:31:05' },
          { userId: 6, fullName: 'Lê Hoài Nam', email: 'namlh@student.vn', phone: '0955667788', address: 'Cần Thơ', avatar: null, role: 'member', isActive: false, bio: 'Thích mua bán trao đổi sách giáo trình cũ', createdAt: '2026-05-01T14:30:00' },
          { userId: 7, fullName: 'Ngô Mỹ Linh', email: 'linhnm@student.vn', phone: '0922334455', address: 'Đà Nẵng', avatar: null, role: 'member', isActive: true, bio: 'Tìm kiếm đồ gia dụng phòng trọ', createdAt: '2026-05-03T16:40:00' }
        ];

        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActive = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.userId === userId) {
        const nextActive = !u.isActive;
        showToast(`Tài khoản ${u.fullName} đã bị ${nextActive ? 'KÍCH HOẠT' : 'KHÓA'} thành công.`, 'success');
        return { ...u, isActive: nextActive };
      }
      return u;
    }));
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;
    
    if (!editFullName.trim()) {
      showToast('Họ tên không được để trống.', 'error');
      return;
    }
    if (!editEmail.trim()) {
      showToast('Email không được để trống.', 'error');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.userId === selectedUser.userId) {
        return { 
          ...u, 
          fullName: editFullName,
          email: editEmail,
          phone: editPhone,
          address: editAddress,
          bio: editBio,
          isActive: editIsActive,
          role: selectedRole 
        };
      }
      return u;
    }));

    showToast(`Đã cập nhật thông tin thành viên ${editFullName} thành công.`, 'success');
    setEditModalOpen(false);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    triggerConfirm(
      () => {
        showToast(`Đã đặt lại mật khẩu cho thành viên ${selectedUser.fullName} về mặc định (Student123@) thành công!`, 'success');
      },
      {
        title: 'Đặt lại mật khẩu',
        message: `Bạn có chắc chắn muốn đặt lại mật khẩu cho thành viên "${selectedUser.fullName}"? Mật khẩu mới sẽ mặc định là "Student123@".`,
        type: 'warning',
        confirmText: 'Đặt lại mật khẩu',
        cancelText: 'Hủy bỏ'
      }
    );
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) || 
                         (filterStatus === 'blocked' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const columns = [
    {
      key: 'avatar',
      label: 'Ảnh đại diện',
      render: (row) => (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
          {row.avatar ? (
            <img src={row.avatar} alt={row.fullName} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-gray-400" />
          )}
        </div>
      )
    },
    {
      key: 'fullName',
      label: 'Họ và tên',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-gray-900 block truncate max-w-[180px]">
            {row.fullName}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            Mã thành viên: #{row.userId}
          </span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email / Liên hệ',
      render: (row) => (
        <div>
          <span className="text-gray-700 block truncate max-w-[180px] font-semibold">{row.email}</span>
          <span className="text-[10px] text-gray-400 block mt-0.5">{row.phone || 'Chưa cung cấp SĐT'}</span>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (row) => {
        const isAdmin = row.role === 'admin';
        return (
          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
            isAdmin 
              ? 'bg-yellow-50 border-yellow-150 text-yellow-700' 
              : 'bg-gray-50 border-gray-150 text-gray-650'
          }`}>
            <Shield size={10} className={isAdmin ? 'fill-yellow-600/10' : ''} />
            {isAdmin ? 'Quản trị viên' : 'Thành viên'}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => (
        <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
          row.isActive 
            ? 'bg-green-50 border-green-150 text-green-700' 
            : 'bg-rose-50 border-rose-150 text-rose-700'
        }`}>
          {row.isActive ? 'Hoạt động' : 'Đã khóa'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Ngày gia nhập',
      sortable: true,
      render: (row) => (
        <span className="text-[11px] text-gray-500 font-semibold">
          {new Date(row.createdAt).toLocaleDateString('vi-VN')}
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
              setSelectedUser(row);
              setEditFullName(row.fullName);
              setEditEmail(row.email);
              setEditPhone(row.phone || '');
              setEditAddress(row.address || '');
              setEditBio(row.bio || '');
              setEditIsActive(row.isActive);
              setSelectedRole(row.role);
              setEditModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-gray-255 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Chỉnh sửa thành viên"
          >
            <Edit2 size={13} />
          </button>
          
          <button
            onClick={() => handleToggleActive(row.userId)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              row.isActive 
                ? 'bg-rose-50 hover:bg-rose-100 border-rose-100 text-rose-500 hover:text-rose-700' 
                : 'bg-green-50 hover:bg-green-100 border-green-100 text-green-600 hover:text-green-700'
            }`}
            title={row.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
          >
            {row.isActive ? <Ban size={13} /> : <CheckCircle size={13} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-display">Danh sách thành viên</h2>
        <p className="text-xs text-gray-500 mt-1">
          Quản lý quyền hạn tài khoản, khóa hoặc mở khóa quyền truy cập của người dùng vi phạm quy chế.
        </p>
      </div>

      {/* Main Table */}
      <AdminTable
        columns={columns}
        data={currentItems}
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
        search={{
          placeholder: 'Tìm tên hoặc email thành viên...',
          value: searchTerm,
          onChange: (val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }
        }}
        filters={[
          {
            key: 'role',
            label: 'Vai trò',
            value: filterRole,
            onChange: (val) => {
              setFilterRole(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả vai trò' },
              { value: 'member', label: 'Thành viên' },
              { value: 'admin', label: 'Quản trị viên' }
            ]
          },
          {
            key: 'status',
            label: 'Trạng thái',
            value: filterStatus,
            onChange: (val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Hoạt động' },
              { value: 'blocked', label: 'Đã khóa' }
            ]
          }
        ]}
      />

      {/* Edit User Modal */}
      {selectedUser && (
        <AdminModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Chỉnh sửa thành viên #${selectedUser.userId}`}
          footer={
            <>
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-gray-250 hover:bg-gray-55 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-gray-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </>
          }
        >
          <div className="space-y-5">
            {/* Quick Profile Overview */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 border border-gray-150 flex items-center justify-center shrink-0">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-gray-400" />
                )}
              </div>
              <div className="truncate">
                <span className="font-bold text-gray-800 block truncate">{editFullName || selectedUser.fullName}</span>
                <span className="text-[10px] text-gray-455 block truncate mt-0.5">{editEmail || selectedUser.email}</span>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-255 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Email liên hệ</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-255 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Số điện thoại</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-255 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Địa chỉ</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-255 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Tiểu sử (Bio)</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-255 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all text-gray-800 resize-none"
                  placeholder="Giới thiệu ngắn về thành viên..."
                />
              </div>
            </div>

            {/* Account Status Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Trạng thái tài khoản</label>
              <div className="flex items-center gap-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditIsActive(true)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    editIsActive
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-600'
                  }`}
                >
                  Hoạt động
                </button>
                <button
                  type="button"
                  onClick={() => setEditIsActive(false)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                    !editIsActive
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-600'
                  }`}
                >
                  Bị khóa (Banned)
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Vai trò hệ thống</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('member')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                    selectedRole === 'member'
                      ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <User size={16} className={selectedRole === 'member' ? 'text-white' : 'text-gray-450'} />
                  <div>
                    <span className="font-bold text-xs block">Member</span>
                    <span className={`text-[8px] block mt-0.5 ${selectedRole === 'member' ? 'text-gray-300' : 'text-gray-400'}`}>Tài khoản sinh viên/người dùng</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <Shield size={16} className={selectedRole === 'admin' ? 'text-yellow-600' : 'text-gray-455'} />
                  <div>
                    <span className="font-bold text-xs block">Administrator</span>
                    <span className={`text-[8px] block mt-0.5 ${selectedRole === 'admin' ? 'text-yellow-655/80' : 'text-gray-400'}`}>Quyền quản trị viên</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Password & Security Section */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Mật khẩu & Bảo mật</label>
              <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-800 block">Đặt lại mật khẩu tài khoản</span>
                  <span className="text-[9px] text-gray-500 block leading-tight">Đặt mật khẩu của thành viên này về mật khẩu mặc định của hệ thống.</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-3 py-2 bg-white border border-amber-250 hover:bg-amber-50 text-amber-700 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Key size={12} /> Đặt lại mật khẩu
                </button>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

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

    </div>
  );
};

export default AdminUsersPage;
