import React, { useState } from 'react';
import ProductListView from '../components/ProductListView';
import Filter from '../components/Filter';

const ProductListPage = () => {
    const [filters, setFilters] = useState({
        location: 'Toàn quốc',
        categoryId: null,
        priceMin: '',
        priceMax: '',
        status: ''
    });

    return (
        <div className="container mx-auto max-w-6xl px-4 mt-6 flex flex-col gap-6">
            <Filter filters={filters} setFilters={setFilters} />
            <ProductListView filters={filters} />
        </div>
    );
};

export default ProductListPage;
