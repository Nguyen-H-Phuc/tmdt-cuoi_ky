import React from 'react';
import { ShoppingCart, Image as ImageIcon, MapPin, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const {
        productId,
        title,
        price,
        imageUrl,
        category,
        province,
        createdAt,
        seller,
        sellerName,
        sellerAvatar,
        targetUniversity
    } = product || {};

    const getProductImageUrl = (url) => {
        if (!url) return "https://placehold.co/217x217?text=No+Image";
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return url;
        return `/${url}`;
    };

    const formattedPrice = typeof price === 'number' 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
        : (price || "0 đ");

    const displayCategoryName = category 
        ? (typeof category === 'object' ? category.categoryName : category)
        : 'Chưa phân loại';

    const displayLocation = province || seller?.address || 'Toàn quốc';

    const displayTime = createdAt 
        ? new Date(createdAt).toLocaleDateString('vi-VN') 
        : 'Mới đây';

    const displayImageCount = product?.images?.length || (imageUrl ? 1 : 0);
    const displayImageUrl = getProductImageUrl(imageUrl);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            await addToCart(product, 1);
            showToast("Đã thêm sản phẩm vào giỏ hàng thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            const errMsg = error.response?.data?.message || error.response?.data || error.message;
            showToast(`Không thể thêm vào giỏ hàng: ${errMsg}`, "error");
        }
    };

    return (
        <Link to={`/product/${productId}`} className="w-full max-w-[220px] bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden">

            {/* 1. Media Section */}
            <div className="relative aspect-square w-full">
                <img
                    src={displayImageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-t-lg"
                />

                {/* Nút Thêm vào giỏ hàng */}
                <button 
                    onClick={handleAddToCart}
                    className="absolute top-2 right-2 p-1.5 bg-black/25 hover:bg-brand-primary hover:bg-[#38699F] rounded-full text-white transition-colors shadow-sm"
                    title="Thêm vào giỏ hàng"
                >
                    <ShoppingCart size={18} strokeWidth={2.5} />
                </button>

                {/* Overlay thông tin (Thời gian & Số ảnh) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-between items-center text-white text-[11px] font-bold">
                    <span>{displayTime}</span>
                    <div className="flex items-center gap-1">
                        <span>{displayImageCount}</span>
                        <ImageIcon size={12} />
                    </div>
                </div>
            </div>

            {/* 2. Content Section */}
            <div className="p-2 flex flex-col flex-1 gap-1">
                {/* Tên sản phẩm - Giới hạn 2 dòng */}
                <h3 className="text-sm font-normal text-gray-800 line-clamp-2 h-10 leading-5">
                    {title}
                </h3>

                {/* Dòng máy / Danh mục */}
                <div className="flex flex-wrap items-center gap-1">
                    <p className="text-[13px] text-gray-500 truncate flex-1">
                        {displayCategoryName}
                    </p>
                    {targetUniversity && targetUniversity !== 'Tất cả' && targetUniversity !== 'all' && (
                        <span className="inline-flex items-center text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1 py-0.5 rounded leading-none shrink-0" title={`Ưu tiên trường: ${targetUniversity}`}>
                            🎓 {targetUniversity}
                        </span>
                    )}
                </div>

                {/* Giá tiền */}
                <p className="text-base font-bold text-brand-price mt-0.5">
                    {formattedPrice}
                </p>

                {/* Thông tin người bán */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50">
                    <img 
                        src={(seller && typeof seller === 'object' && seller.avatar && seller.avatar !== 'null' && seller.avatar !== 'undefined') ? seller.avatar : (sellerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(seller && typeof seller === 'object' && seller.fullName) || sellerName || 'Seller'}`)} 
                        alt={(seller && typeof seller === 'object' && seller.fullName) || sellerName || "Người bán"}
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-200"
                    />
                    <span className="text-[11px] font-semibold text-gray-500 truncate">
                        {(seller && typeof seller === 'object' && seller.fullName) || sellerName || "Người bán ẩn danh"}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;