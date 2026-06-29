import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const MiniCart = ({ isOpen, onClose }) => {
    const { cart } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const recentItems = cart.slice(-4).reverse(); // Lấy tối đa 4 sản phẩm mới thêm vào gần nhất

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(totalPrice);

    const handleViewCart = () => {
        onClose();
        navigate('/cart');
    };

    return (
        <>
            {/* Backdrop transparent to close when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Dropdown container */}
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-gray-100 premium-shadow z-50 animate-scale-up origin-top-right overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <span className="text-sm font-bold text-gray-800">Sản phẩm mới thêm</span>
                    <span className="text-xs text-gray-500">Tổng cộng {cart.length} mặt hàng</span>
                </div>

                {cart.length === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <ShoppingBag className="text-gray-400" size={24} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
                        <p className="text-xs text-gray-400 mt-1">Hãy thêm các món đồ sinh viên hữu ích nhé!</p>
                    </div>
                ) : (
                    <>
                        {/* List Items */}
                        <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-gray-100">
                            {recentItems.map((item) => {
                                const formattedPrice = new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(item.price);

                                return (
                                    <div key={item.productId} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                            <img
                                                src={item.imageUrl ? (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://') || item.imageUrl.startsWith('/') ? item.imageUrl : (!item.imageUrl.includes('/') ? `/${item.imageUrl}` : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/uploads/${item.imageUrl}`)) : 'https://placehold.co/100x100?text=Product'}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/100x100?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-xs font-semibold text-gray-800 truncate mb-0.5">
                                                {item.title}
                                            </h5>
                                            <p className="text-[10px] text-gray-400 mb-1">
                                                Số lượng: {item.quantity}
                                            </p>
                                            <div className="text-xs font-bold text-brand-price">
                                                {formattedPrice}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <div>
                                <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">Tổng tiền tạm tính</span>
                                <span className="text-sm font-extrabold text-brand-price">{formattedTotalPrice}</span>
                            </div>
                            <button
                                onClick={handleViewCart}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-gray-900 text-xs font-bold rounded-lg transition-all shadow-sm"
                            >
                                Xem giỏ hàng
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MiniCart;
