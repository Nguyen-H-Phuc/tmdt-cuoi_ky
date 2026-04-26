import React from 'react';
import { Heart, Image as ImageIcon, MapPin, MoreVertical } from 'lucide-react';

const ProductCard = ({ product }) => {
    // Giả sử dữ liệu được truyền vào qua prop 'product'
    // Nếu chưa có data thật, bạn có thể dùng các giá trị mặc định bên dưới
    const {
        title = "Samsung Galaxy Note 10 5G Đen",
        subTitle = "Galaxy Note 10",
        price = "1.500.000 đ",
        location = "Huyện Tiền Hải, Thái Bình",
        time = "2 ngày trước",
        imageCount = 4,
        imageUrl = "https://placehold.co/217x217"
    } = product || {};

    return (
        <div className="w-full max-w-[220px] bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden">

            {/* 1. Media Section */}
            <div className="relative aspect-square w-full">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-t-lg"
                />

                {/* Nút Yêu thích */}
                <button className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                    <Heart size={20} strokeWidth={2} />
                </button>

                {/* Overlay thông tin (Thời gian & Số ảnh) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-between items-center text-white text-[11px] font-bold">
                    <span>{time}</span>
                    <div className="flex items-center gap-1">
                        <span>{imageCount}</span>
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

                {/* Dòng máy */}
                <p className="text-[13px] text-gray-500 truncate">
                    {subTitle}
                </p>

                {/* Giá tiền */}
                <p className="text-base font-bold text-[#F0325E] mt-1">
                    {price}
                </p>

                {/* Địa điểm & Thêm */}
                <div className="flex items-start justify-between mt-auto pt-2">
                    <div className="flex items-start gap-1 text-gray-400 max-w-[85%]">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="text-[12px] leading-4 line-clamp-2">
              {location}
            </span>
                    </div>
                    <button className="text-gray-400 hover:text-black">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;