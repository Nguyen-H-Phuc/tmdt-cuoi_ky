import React from 'react';
import { ShoppingCart, Image as ImageIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductListItem = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    // Fallback data if product is not provided
    const {
        productId = 1,
        title = "Tủ quần áo Tủ quần áo # Tủ quần áo ,Tủ quần áo",
        specs = "Mới • Nhựa",
        price = "1.900.000 đ",
        location = "Tp Hồ Chí Minh",
        time = "12 giờ trước",
        isPriority = false,
        imageCount = 1,
        imageUrl = "https://placehold.co/400x400/eeeeee/333333?text=Tu+Quan+Ao",
        sellerName = "Cửa Hàng Xưởng Thành Phát",
        sellerAvatar = "https://placehold.co/100x100/333333/FFFFFF?text=CH",
        isProSeller = true
    } = product || {};

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const itemToCart = product || { productId, title, price, imageUrl };
            await addToCart(itemToCart, 1);
            showToast("Đã thêm sản phẩm vào giỏ hàng thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            const errMsg = error.response?.data?.message || error.response?.data || error.message;
            showToast(`Không thể thêm vào giỏ hàng: ${errMsg}`, "error");
        }
    };

    return (
        <Link to={`/product/${productId}`} className="flex w-full gap-4 py-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
            {/* Left: Media Section */}
            <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover rounded-md border border-gray-100"
                />
                
                {/* Labels on Image */}
                <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center text-white text-[10px] md:text-[11px] font-medium drop-shadow-md">
                    <span className="bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded">
                        {isPriority ? "Tin ưu tiên" : time}
                    </span>
                    {imageCount > 0 && (
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded">
                            <span>{imageCount}</span>
                            <ImageIcon size={10} />
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Content Section */}
            <div className="flex flex-col flex-1 justify-between min-w-0 py-0.5 pr-2">
                <div>
                    {/* Title */}
                    <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    
                    {/* Specifications */}
                    <p className="text-[12px] md:text-sm text-gray-500 mt-1 truncate">
                        {specs}
                    </p>
                    
                    {/* Price */}
                    <p className="text-base md:text-lg font-bold text-[#e51c24] mt-1.5">
                        {price}
                    </p>
                </div>

                <div className="flex flex-col mt-2 gap-1.5">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-[12px] md:text-sm">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                    
                    {/* Footer: Seller & Favorite */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img 
                                src={sellerAvatar} 
                                alt={sellerName} 
                                className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-[12px] md:text-sm text-gray-600 font-medium truncate max-w-[140px] md:max-w-xs">
                                    {sellerName}
                                </span>
                                {isProSeller && (
                                    <span title="Bán chuyên" className="bg-yellow-400 text-white text-[8px] px-1 py-0.5 rounded-sm font-bold flex items-center justify-center">
                                        PRO
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button 
                            className="text-gray-400 hover:text-[#38699F] transition-colors p-1.5 hover:bg-gray-100 rounded-full" 
                            onClick={handleAddToCart}
                            title="Thêm vào giỏ hàng"
                        >
                            <ShoppingCart size={20} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductListItem;
