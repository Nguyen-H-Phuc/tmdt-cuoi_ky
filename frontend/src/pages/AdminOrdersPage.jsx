import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTable from '../components/AdminTable';
import OrderDetailModal from '../components/OrderDetailModal';
import AdminConfirmModal from '../components/AdminConfirmModal';
import { useToast } from '../context/ToastContext';
import { Eye, Check, X, ClipboardList, User, Package, Calendar, MapPin, CreditCard, HelpCircle } from 'lucide-react';

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  // Detail Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Confirm Modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8080/api/orders/admin');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback
      setOrders(getMockOrders());
      showToast('Không thể kết nối đến backend, đang hiển thị dữ liệu mẫu.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleForceCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setConfirmOpen(true);
  };

  const confirmForceCancel = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/orders/${orderId}/force-cancel`);
      const updatedOrder = response.data;
      setOrders(prev => prev.map(o => o.orderId === orderId ? updatedOrder : o));
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder(updatedOrder);
      }
      showToast(`Admin đã hủy cưỡng chế đơn hàng ${updatedOrder.orderCode} thành công.`, 'success');
    } catch (error) {
      console.error('Error force cancelling order:', error);
      showToast('Lỗi khi hủy cưỡng chế đơn hàng.', 'error');
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.buyer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || order.paymentMethod === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const formatVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const columns = [
    {
      key: 'orderCode',
      label: 'Mã đơn hàng',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-gray-800">{row.orderCode}</span>
      )
    },
    {
      key: 'buyer',
      label: 'Khách mua',
      render: (row) => (
        <div>
          <span className="font-bold text-gray-900 block truncate max-w-[120px]">
            {row.buyer?.fullName}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            {row.buyer?.phone || 'Không có SĐT'}
          </span>
        </div>
      )
    },
    {
      key: 'seller',
      label: 'Người bán',
      render: (row) => (
        <div>
          <span className="font-bold text-gray-800 block truncate max-w-[120px]">
            {row.seller?.fullName}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            {row.seller?.phone || 'Không có SĐT'}
          </span>
        </div>
      )
    },
    {
      key: 'product',
      label: 'Sản phẩm',
      render: (row) => (
        <span className="font-semibold text-gray-700 block truncate max-w-[150px]" title={row.product.title}>
          {row.product.title}
        </span>
      )
    },
    {
      key: 'totalPrice',
      label: 'Tổng giá trị',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-gray-950">
          {formatVND(row.totalPrice)}
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
            status === 'COMPLETED' 
              ? 'bg-green-50 border-green-150 text-green-700'
              : status === 'CANCELLED'
              ? 'bg-red-50 border-red-150 text-red-700'
              : status === 'ACCEPTED'
              ? 'bg-blue-50 border-blue-150 text-blue-700'
              : 'bg-amber-55 bg-amber-50 border border-amber-100 text-amber-600'
          }`}>
            {status === 'COMPLETED' ? 'Hoàn tất' : status === 'CANCELLED' ? 'Đã hủy' : status === 'ACCEPTED' ? 'Đã nhận' : 'Chờ xác nhận'}
          </span>
        );
      }
    },
    {
      key: 'paymentMethod',
      label: 'Thanh toán',
      render: (row) => (
        <span className="text-[10px] text-gray-500 font-extrabold bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-lg whitespace-nowrap uppercase">
          {row.paymentMethod}
        </span>
      )
    },
    {
      key: 'orderDate',
      label: 'Ngày đặt',
      sortable: true,
      render: (row) => (
        <span className="text-[10px] text-gray-400 font-bold block whitespace-nowrap">
          {new Date(row.orderDate).toLocaleDateString('vi-VN')}
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
              setSelectedOrder(row);
              setModalOpen(true);
            }}
            className="p-1.5 rounded-lg border border-gray-250 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title="Chi tiết đơn hàng"
          >
            <Eye size={13} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 font-display">Quản lý đơn hàng</h2>
        <p className="text-xs text-gray-500 mt-1">
          Theo dõi trạng thái giao dịch, phương thức nhận đồ và thông tin thanh toán của tất cả đơn hàng trên sàn.
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
          placeholder: 'Tìm theo mã đơn, người mua, người bán hoặc sản phẩm...',
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
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'PENDING', label: 'Chờ xác nhận' },
              { value: 'ACCEPTED', label: 'Đã nhận đơn' },
              { value: 'COMPLETED', label: 'Đã hoàn tất' },
              { value: 'CANCELLED', label: 'Đã hủy' }
            ]
          },
          {
            key: 'paymentMethod',
            label: 'Thanh toán',
            value: filterMethod,
            onChange: (val) => {
              setFilterMethod(val);
              setCurrentPage(1);
            },
            options: [
              { value: 'all', label: 'Tất cả hình thức' },
              { value: 'vnpay', label: 'VNPay' },
              { value: 'cod', label: 'COD' }
            ]
          }
        ]}
      />

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        onCancelOrder={handleForceCancelOrder}
        isAdminView={true}
      />

      {/* Confirm Force Cancel Modal */}
      <AdminConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setOrderToCancel(null);
        }}
        onConfirm={() => {
          if (orderToCancel) {
            confirmForceCancel(orderToCancel);
          }
        }}
        title="Xác nhận hủy cưỡng chế"
        message="CẢNH BÁO: Bạn đang thực hiện HỦY CƯỠNG CHẾ đơn hàng này dưới quyền Admin. Hành động này chỉ nên dùng để giải quyết tranh chấp hoặc vi phạm chính sách. Bạn có chắc chắn muốn tiếp tục?"
        confirmText="Đồng ý hủy"
        cancelText="Hủy bỏ"
        type="danger"
      />

    </div>
  );
};

export default AdminOrdersPage;

const getMockOrders = () => [
  {
    orderId: 101,
    orderCode: 'ORD-5849-231',
    buyer: { userId: 5, fullName: 'Nguyen Van Admin', email: 'a@gmail.com', phone: '0900000000', avatar: null },
    seller: { userId: 1, fullName: 'Xe Máy Cũ Hải Nguyễn', email: 'hainguyen@example.com', phone: '0901234567', avatar: 'https://placehold.co/100x100/333333/FFFFFF?text=XM' },
    product: { productId: 1, title: 'Ex xuống áo 2010 vàng đen siêu đẹp nợ xấu đưa 8tr5', price: 26800000, imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80' },
    totalPrice: 26800000,
    status: 'PENDING',
    paymentMethod: 'vnpay',
    receiverName: 'Nguyen Van Admin',
    receiverPhone: '0900000000',
    deliveryMethod: 'home',
    university: 'Đại học Bách Khoa Đà Nẵng',
    dormInfo: 'Ký túc xá khu B, Phòng 402',
    specificAddress: '54 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu',
    notes: 'Gọi điện trước khi giao hàng tầm 15 phút giúp mình.',
    orderDate: '2026-05-28T09:15:00',
    statusDate: '2026-05-28T09:15:00'
  },
  {
    orderId: 102,
    orderCode: 'ORD-9821-492',
    buyer: { userId: 1, fullName: 'Xe Máy Cũ Hải Nguyễn', email: 'hainguyen@example.com', phone: '0901234567', avatar: 'https://placehold.co/100x100/333333/FFFFFF?text=XM' },
    seller: { userId: 2, fullName: 'Nhơn', email: 'nhon@example.com', phone: '0987654321', avatar: 'https://placehold.co/100x100/FFCC00/000000?text=N' },
    product: { productId: 3, title: 'Nghỉ bán thanh lý đồ Nam shop', price: 120000, imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80' },
    totalPrice: 120000,
    status: 'COMPLETED',
    paymentMethod: 'cod',
    receiverName: 'Hải Nguyễn',
    receiverPhone: '0901234567',
    deliveryMethod: 'campus',
    university: 'Đại học Sư phạm Kỹ thuật TP.HCM',
    dormInfo: null,
    specificAddress: '1 Võ Văn Ngân, Linh Chiểu, Thủ Đức',
    notes: 'Hẹn gặp ở cổng phụ đường Lê Văn Chí.',
    orderDate: '2026-05-29T14:40:00',
    statusDate: '2026-05-29T17:30:00'
  },
  {
    orderId: 103,
    orderCode: 'ORD-1209-847',
    buyer: { userId: 7, fullName: 'Ngô Mỹ Linh', email: 'linhnm@student.vn', phone: '0922334455', avatar: null },
    seller: { userId: 3, fullName: 'Cửa Hàng Xưởng Thành Phát', email: 'thanhphat@example.com', phone: '0912345678', avatar: 'https://placehold.co/100x100/ADD8E6/FFFFFF?text=CH' },
    product: { productId: 4, title: 'Tủ quần áo nhựa lắp ghép đa năng', price: 1900000, imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80' },
    totalPrice: 1900000,
    status: 'ACCEPTED',
    paymentMethod: 'vnpay',
    receiverName: 'Mỹ Linh',
    receiverPhone: '0922334455',
    deliveryMethod: 'campus',
    university: 'Đại học Kinh Tế TP.HCM',
    dormInfo: 'KTX Nguyễn Chí Thanh, Phòng 309',
    specificAddress: '275 Nguyễn Chí Thanh, Quận 5',
    notes: null,
    orderDate: '2026-05-30T10:11:00',
    statusDate: '2026-05-30T11:00:00'
  },
  {
    orderId: 104,
    orderCode: 'ORD-4310-994',
    buyer: { userId: 6, fullName: 'Lê Hoài Nam', email: 'namlh@student.vn', phone: '0955667788', avatar: null },
    seller: { userId: 4, fullName: 'Nội Thất Diễn Phát', email: 'dienphat@example.com', phone: '0998877665', avatar: 'https://placehold.co/100x100/FFCC00/000000?text=N' },
    product: { productId: 5, title: 'Tủ gỗ mdf thanh lý sale 50%', price: 3000000, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' },
    totalPrice: 3000000,
    status: 'CANCELLED',
    paymentMethod: 'vnpay',
    receiverName: 'Hoài Nam',
    receiverPhone: '0955667788',
    deliveryMethod: 'home',
    university: 'Đại học Cần Thơ',
    dormInfo: null,
    specificAddress: 'Khu II, Đường 3/2, Xuân Khánh, Ninh Kiều',
    notes: 'Đặt nhầm kích thước tủ nên muốn hủy đơn.',
    orderDate: '2026-05-31T09:20:00',
    statusDate: '2026-05-31T10:05:00'
  }
];
