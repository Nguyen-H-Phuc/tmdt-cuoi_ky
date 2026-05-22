import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import CartSummary from '../components/CartSummary.jsx';
import { ShoppingCart, ArrowLeft, Trash2, CheckSquare, Square } from 'lucide-react';

const CartPage = () => {
    const { cart, toggleSelectAll, clearCart } = useCart();

    const allSelected = cart.length > 0 && cart.every(item => item.selected);
    const anySelected = cart.some(item => item.selected);

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 animate-fade-in">
            {/* Header điều hướng */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-sm border border-gray-100"
                    >
                        <ArrowLeft size={18} className="text-gray-700" />
                    </Link>
                    <h1 className="text-xl md:text-2xl font-black text-gray-800 font-display">
                        Giỏ hàng của tôi
                    </h1>
                </div>
                {cart.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-xs font-bold text-gray-400 hover:text-brand-price transition-colors flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                        <span>Xóa tất cả</span>
                    </button>
                )}
            </div>

            {cart.length === 0 ? (
                /* Giỏ hàng trống */
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 premium-shadow max-w-lg mx-auto mt-10 animate-slide-up">
                    <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-accent">
                        <ShoppingCart size={40} className="stroke-[1.5]" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                        Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá hàng ngàn món đồ hấp dẫn dành cho sinh viên ngay nhé!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-primary hover:bg-brand-hover text-gray-900 font-bold rounded-xl transition duration-300 shadow-sm hover:shadow-md"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                /* Giỏ hàng có sản phẩm */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Chọn tất cả */}
                        <div className="bg-white rounded-xl px-4 py-3.5 premium-shadow border border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-bold"
                            >
                                {allSelected ? (
                                    <CheckSquare size={18} className="text-brand-accent" />
                                ) : (
                                    <Square size={18} className="text-gray-400" />
                                )}
                                <span>Chọn tất cả ({cart.length} sản phẩm)</span>
                            </button>
                            <span>Đơn giá / Thành tiền</span>
                        </div>

                        {/* Danh sách CartItem */}
                        <div className="space-y-1">
                            {cart.map((item) => (
                                <CartItem key={item.productId} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Cột phải: Tổng kết giỏ hàng */}
                    <div className="lg:col-span-1">
                        <CartSummary />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
