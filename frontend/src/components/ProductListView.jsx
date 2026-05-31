import React, { useState, useEffect, useRef } from 'react';
import ProductListItem from './ProductListItem';
import ProductCard from './ProductCard';
import { ChevronDown, Grid, List } from 'lucide-react';
import axios from 'axios';

const ProductListView = ({ filters }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // States for sorting & layout
    const [sortBy, setSortBy] = useState('relevance');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    const dropdownRef = useRef(null);
    
    const sortOptions = [
        { value: 'relevance', label: 'Liên quan nhất' },
        { value: 'newest', label: 'Tin mới trước' },
        { value: 'priceAsc', label: 'Giá thấp trước' },
        { value: 'priceDesc', label: 'Giá cao trước' },
        { value: 'mostViewed', label: 'Xem nhiều nhất' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                // Build request parameters for backend sorting & filtering
                const params = {};
                if (filters?.location) params.location = filters.location;
                if (filters?.categoryId !== null && filters?.categoryId !== undefined) params.categoryId = filters.categoryId;
                if (filters?.priceMin !== '') params.priceMin = filters.priceMin;
                if (filters?.priceMax !== '') params.priceMax = filters.priceMax;
                if (filters?.status) params.status = filters.status;
                if (sortBy) params.sortBy = sortBy;

                const response = await axios.get('http://localhost:8080/api/products', { params });
                // Map the backend data to match the frontend expectations
                const mappedProducts = response.data.map(p => ({
                    id: p.productId,
                    productId: p.productId,
                    title: p.title,
                    specs: `${p.category ? (typeof p.category === 'object' ? p.category.categoryName : p.category) : 'Khác'} • ${p.status === 'available' ? 'Có sẵn' : 'Đã bán'}`,
                    price: `${p.price?.toLocaleString('vi-VN')} đ`,
                    rawPrice: p.price || 0,
                    location: p.seller?.address || 'Toàn quốc',
                    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Mới đây',
                    rawCreatedAt: p.createdAt,
                    viewCount: p.viewCount || 0,
                    isPriority: false,
                    imageCount: p.imageUrl ? 1 : 0,
                    imageUrl: p.imageUrl || "https://placehold.co/400x400/eeeeee/333333?text=No+Image",
                    sellerName: p.seller?.fullName || "Người bán ẩn danh",
                    sellerAvatar: p.seller?.avatar || "https://placehold.co/100x100/333333/FFFFFF?text=U",
                    isProSeller: p.seller?.role === 'admin',
                    category: typeof p.category === 'object' ? p.category : { categoryName: p.category },
                    categoryId: p.categoryId,
                    status: p.status,
                    user: p.seller
                }));
                setProducts(mappedProducts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters?.location, filters?.categoryId, filters?.priceMin, filters?.priceMax, filters?.status, sortBy]);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Products are already filtered and sorted by the backend
    const sortedProducts = products;

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow-sm border border-gray-100 mt-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 md:px-6">
                <h2 className="py-3 md:py-4 text-sm md:text-base font-semibold text-gray-800">
                    Tất cả
                </h2>
                
                {/* Right Filters */}
                <div className="flex items-center gap-3 md:gap-5 text-sm relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center gap-1 text-gray-700 hover:text-black font-semibold transition-colors py-2 px-1 focus:outline-none"
                    >
                        {sortOptions.find(opt => opt.value === sortBy)?.label || 'Liên quan nhất'} 
                        <ChevronDown size={16} className={`mt-0.5 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSortDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                            {sortOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setShowSortDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs md:text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${
                                        sortBy === option.value 
                                        ? 'text-yellow-600 bg-yellow-50/50 font-medium' 
                                        : 'text-gray-700 hover:text-black font-normal'
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {sortBy === option.value && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="hidden md:block w-px h-4 bg-gray-300"></div>
                    <button 
                        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                        className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-black font-semibold transition-colors focus:outline-none"
                    >
                        {viewMode === 'list' ? (
                            <>
                                Dạng lưới <Grid size={16} className="mt-0.5" />
                            </>
                        ) : (
                            <>
                                Dạng danh sách <List size={16} className="mt-0.5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className={`px-4 md:px-6 pb-4 min-h-[200px] ${
                viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 justify-items-center' 
                : 'flex flex-col'
            }`}>
                {loading ? (
                    <div className="flex justify-center items-center py-10 col-span-full w-full">
                        <span className="text-gray-500">Đang tải dữ liệu...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center py-10 col-span-full w-full">
                        <span className="text-red-500">{error}</span>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="flex justify-center items-center py-10 col-span-full w-full">
                        <span className="text-gray-500">Không có sản phẩm nào</span>
                    </div>
                ) : (
                    sortedProducts.map(product => (
                        viewMode === 'grid' ? (
                            <ProductCard key={product.id} product={product} />
                        ) : (
                            <ProductListItem key={product.id} product={product} />
                        )
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductListView;
