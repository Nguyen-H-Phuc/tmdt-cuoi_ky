import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
    const { totalSelectedPrice, totalSelectedItems, cart } = useCart();
    const navigate = useNavigate();

    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(totalSelectedPrice);

    const handleCheckout = () => {
        const selectedItems = cart.filter(item => item.selected);
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
            return;
        }

        // Lưu danh sách sản phẩm được chọn vào localStorage để trang Checkout có thể lấy ra sử dụng
        localStorage.setItem('checkout_items', JSON.stringify(selectedItems));
        
        // Điều hướng sang trang Checkout. 
        // Vì hệ thống hiện tại có route '/checkout/:productId', chúng ta tạm thời điều hướng sang
        // '/checkout/cart' để đánh dấu việc thanh toán giỏ hàng. Trang Checkout sẽ kiểm tra nếu productId === 'cart'.
        navigate('/checkout/cart');
    };

    return (
        <div className="bg-white rounded-2xl p-6 premium-shadow border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">
                Tóm tắt đơn hàng
            </h3>

            {/* Chi tiết tính toán */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Sản phẩm đã chọn:</span>
                    <span className="font-semibold text-gray-800">{totalSelectedItems} sản phẩm</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Tạm tính:</span>
                    <span className="font-semibold text-gray-800">{formattedTotalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Phí vận chuyển:</span>
                    <span className="text-gray-400 text-xs italic">Tính khi thanh toán</span>
                </div>
                
                <div className="border-t border-dashed border-gray-200 pt-4 mt-2 flex justify-between items-end">
                    <span className="text-base font-bold text-gray-800">Tổng cộng:</span>
                    <div className="text-right">
                        <div className="text-xl font-extrabold text-brand-price">{formattedTotalPrice}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">(Đã bao gồm VAT nếu có)</div>
                    </div>
                </div>
            </div>

            {/* Nút thanh toán */}
            <button
                onClick={handleCheckout}
                disabled={totalSelectedItems === 0}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    totalSelectedItems === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-primary hover:bg-brand-hover text-gray-900 hover:shadow-md cursor-pointer'
                }`}
            >
                <span>Tiến hành thanh toán</span>
                <ArrowRight size={16} />
            </button>

            {/* Cam kết bảo mật */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100">
                <ShieldCheck size={14} className="shrink-0" />
                <span>Giao dịch an toàn và bảo mật sinh viên 100%.</span>
            </div>
        </div>
    );
};

export default CartSummary;
