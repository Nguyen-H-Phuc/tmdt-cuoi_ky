import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';

const CategoryGrid = () => {
    // State lưu dữ liệu từ API
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API từ Spring Boot backend
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/categories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi khi tải dữ liệu');
                }
                return response.json();
            })
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, []);

    return (
        <section className="w-full bg-[#F4F4F4] py-6 flex justify-center">
            {/* Khung màu trắng 1200px (đồng bộ với ProductSection) */}
            <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-sm p-4 md:p-6">
                
                {loading ? (
                    <div className="text-center text-gray-500 py-10 animate-pulse">
                        Đang tải danh mục...
                    </div>
                ) : (
                    /* Grid System: 8 cột, căn giữa và thu hẹp gap */
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-4 gap-x-2 justify-items-center">
                        {categories.map((cat) => (
                            <CategoryCard 
                                key={cat.categoryId} 
                                category={{
                                    categoryId: cat.categoryId,
                                    name: cat.categoryName,
                                    imageUrl: cat.categoryImage?.startsWith('http') || cat.categoryImage?.startsWith('/')
                                        ? cat.categoryImage
                                        : `/assets/category/${cat.categoryImage || 'default.png'}`
                                }} 
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};

export default CategoryGrid;