import React from 'react';
import { Trash2, Plus, Minus, Store } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart, toggleSelect } = useCart();

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(item.price);

    const formattedSubtotal = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(item.price * item.quantity);

    return (
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-4 premium-shadow hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col gap-4">
            {/* Header: Người bán */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Store size={14} className="text-gray-400" />
                    <span>Gian hàng:</span>
                    <span className="text-gray-800 font-bold hover:text-brand-accent cursor-pointer transition-colors">
                        {item.seller?.fullName || 'Người bán'}
                    </span>
                </div>
                <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-400 hover:text-brand-price transition-colors p-1.5 rounded-full hover:bg-red-50"
                    title="Xóa sản phẩm"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Body: Chi tiết sản phẩm */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Checkbox và ảnh */}
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                    <label className="relative flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelect(item.productId)}
                            className="sr-only peer"
                        />
                        <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-md peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-all flex items-center justify-center after:content-[''] after:w-2.5 after:h-1.5 after:border-white after:border-l-2 after:border-b-2 after:rotate-[-45deg] after:hidden peer-checked:after:block after:-translate-y-[1px]"></div>
                    </label>

                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 cursor-pointer">
                        <img
                            src={item.imageUrl ? (item.imageUrl.startsWith('http://') || item.imageUrl.startsWith('https://') || item.imageUrl.startsWith('/') ? item.imageUrl : (!item.imageUrl.includes('/') ? `/${item.imageUrl}` : `http://localhost:8080/uploads/${item.imageUrl}`)) : 'https://placehold.co/150x150?text=Product'}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/150x150?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Tiêu đề & giá (Mobile) */}
                    <div className="sm:hidden flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand-accent cursor-pointer mb-1">
                            {item.title}
                        </h4>
                        <div className="text-sm font-bold text-brand-price">{formattedPrice}</div>
                    </div>
                </div>

                {/* Tiêu đề & giá (Desktop) */}
                <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 hover:text-brand-accent cursor-pointer transition-colors mb-1">
                        {item.title}
                    </h4>
                    <div className="text-xs text-gray-400">Đơn giá: {formattedPrice}</div>
                </div>

                {/* Điều khiển số lượng & Thành tiền */}
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Bộ tăng giảm */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`p-2 transition-colors ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-gray-800 select-none">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= (item.productQuantity !== undefined ? item.productQuantity : 9999)}
                            className={`p-2 transition-colors ${item.quantity >= (item.productQuantity !== undefined ? item.productQuantity : 9999) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            title={item.quantity >= (item.productQuantity !== undefined ? item.productQuantity : 9999) ? "Đã đạt giới hạn số lượng có sẵn" : "Tăng số lượng"}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Thành tiền */}
                    <div className="text-right shrink-0">
                        <div className="text-xs text-gray-400 sm:hidden">Thành tiền:</div>
                        <div className="text-sm md:text-base font-bold text-brand-price">
                            {formattedSubtotal}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
