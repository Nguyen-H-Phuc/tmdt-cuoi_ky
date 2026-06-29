import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductListView from '../components/ProductListView';
import Filter from '../components/Filter';

const ProductListPage = () => {
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        location: searchParams.get('location') || 'Toàn quốc',
        categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId'), 10) : null,
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
        status: searchParams.get('status') || ''
    });

    useEffect(() => {
        setFilters({
            location: searchParams.get('location') || 'Toàn quốc',
            categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId'), 10) : null,
            priceMin: searchParams.get('priceMin') || '',
            priceMax: searchParams.get('priceMax') || '',
            status: searchParams.get('status') || ''
        });
    }, [searchParams]);

    return (
        <div className="container mx-auto max-w-6xl px-4 mt-6 flex flex-col gap-6">
            <Filter filters={filters} setFilters={setFilters} />
            <ProductListView filters={filters} />
        </div>
    );
};

export default ProductListPage;
