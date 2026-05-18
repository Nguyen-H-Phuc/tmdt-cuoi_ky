import React from 'react';
import ProductListView from '../components/ProductListView';
import Filter from '../components/Filter';

const ProductListPage = () => {
    return (
        <div className="container mx-auto max-w-6xl px-4 mt-6 flex flex-col gap-6">
            <Filter />
            <ProductListView />
        </div>
    );
};

export default ProductListPage;
