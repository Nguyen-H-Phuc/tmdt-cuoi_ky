import React from 'react';
import CategoryGrid from '../components/CategoryGrid';
import ProductSection from '../components/ProductSection';

const HomePage = () => {
    return (
        <div className="container mx-auto max-w-6xl px-4 mt-6">
            {/* Danh mục nổi bật */}
            <CategoryGrid />

            {/* Sản phẩm Mới nhất */}
            <ProductSection
                title="Tin Đăng Mới Nhất"
                apiEndpoint="/api/products/newest"
            />

            {/* Sản phẩm Bán chạy */}
            <ProductSection
                title="Sản Phẩm Bán Chạy"
                apiEndpoint="/api/products/best-selling"
            />

            {/* Sản phẩm Xem nhiều */}
            <ProductSection
                title="Được Xem Nhiều Nhất"
                apiEndpoint="/api/products/most-viewed"
            />
        </div>
    );
};

export default HomePage;