import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const {
    categoryId,
    name = "Bất động sản",
    imageUrl = "https://placehold.co/84x84"
  } = category || {};

  return (
    <Link 
      to={`/products?categoryId=${categoryId}`}
      className="flex flex-col items-center justify-start p-2 w-36 h-37 group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >

      {/* 1. Icon Container: Hình tròn hoặc bo góc nhẹ để làm nổi bật ảnh */}
      <div className="w-21 h-21 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* 2. Text Container: Căn giữa và giới hạn chiều cao */}
      <div className="mt-2 w-full px-1">
        <h4 className="text-[14px] font-medium text-[#595959] text-center leading-5 line-clamp-2 overflow-hidden h-10 flex items-center justify-center font-bold">
          {name}
        </h4>
      </div>

    </Link>
  );
};

export default CategoryCard;