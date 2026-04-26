import React from 'react';
import CategoryCard from './CategoryCard';

const CATEGORIES = [
    { id: 1, name: "Bất động sản", image: "link_anh_1" },
    { id: 2, name: "Xe cộ", image: "link_anh_2" },
    // ... thêm đủ 16 danh mục như trong hình
];

const CategoryGrid = () => {
    return (
        <section className="w-full bg-[#F4F4F4] py-8 flex justify-center">
            {/* Khung màu trắng 1200x324 */}
            <div className="w-full max-w-300 min-h-81 bg-white rounded-xl shadow-sm p-6">

                {/* Grid System: 8 cột trên desktop, 4 cột trên mobile */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y gap-x">
                    {CATEGORIES.map((cat) => (
                        <CategoryCard key={cat.id} category={cat} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CategoryGrid;