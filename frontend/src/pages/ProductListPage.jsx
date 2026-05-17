import React from 'react';
import ProductListView from '../components/ProductListView';

const ProductListPage = () => {
    return (
        <div className="container mx-auto max-w-6xl px-4 pt-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 px-4">Tất cả sản phẩm</h1>
            <ProductListView />
        </div>
    );
};

export default ProductListPage;
