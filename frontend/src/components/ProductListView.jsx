import React, { useState, useEffect, useRef } from 'react';
import ProductListItem from './ProductListItem';
import { ChevronDown, Grid } from 'lucide-react';
import axios from 'axios';

const ProductListView = () => {
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // States for sorting
    const [sortBy, setSortBy] = useState('relevance');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    
    const dropdownRef = useRef(null);
    const tabs = ['Tất cả', 'Cá nhân', 'Bán chuyên'];
    
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
                const response = await axios.get('http://localhost:8080/api/products');
                // Map the backend data to match the frontend expectations
                const mappedProducts = response.data.map(p => ({
                    id: p.productId,
                    title: p.title,
                    specs: `${p.category ? p.category.categoryName : 'Khác'} • ${p.status === 'available' ? 'Có sẵn' : 'Đã bán'}`,
                    price: `${p.price?.toLocaleString('vi-VN')} đ`,
                    rawPrice: p.price || 0,
                    location: p.user?.address || 'Toàn quốc',
                    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Mới đây',
                    rawCreatedAt: p.createdAt,
                    viewCount: p.viewCount || 0,
                    isPriority: false,
                    imageCount: p.imageUrl ? 1 : 0,
                    imageUrl: p.imageUrl || "https://placehold.co/400x400/eeeeee/333333?text=No+Image",
                    sellerName: p.user?.fullName || "Người bán ẩn danh",
                    sellerAvatar: p.user?.avatar || "https://placehold.co/100x100/333333/FFFFFF?text=U",
                    isProSeller: p.user?.role === 'admin'
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
    }, []);

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

    // Filter products based on active tab
    const filteredProducts = products.filter(product => {
        if (activeTab === 'Cá nhân') {
            return !product.isProSeller;
        }
        if (activeTab === 'Bán chuyên') {
            return product.isProSeller;
        }
        return true; // 'Tất cả'
    });

    // Sort products based on selected option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                const timeA = a.rawCreatedAt ? new Date(a.rawCreatedAt).getTime() : 0;
                const timeB = b.rawCreatedAt ? new Date(b.rawCreatedAt).getTime() : 0;
                return timeB - timeA;
            case 'priceAsc':
                return a.rawPrice - b.rawPrice;
            case 'priceDesc':
                return b.rawPrice - a.rawPrice;
            case 'mostViewed':
                return b.viewCount - a.viewCount;
            case 'relevance':
            default:
                return 0; // Keep original api order
        }
    });

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-md shadow-sm border border-gray-100 mt-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 md:px-6">
                {/* Tabs */}
                <div className="flex gap-4 md:gap-8">
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 md:py-4 text-sm md:text-base font-medium border-b-2 transition-colors focus:outline-none ${
                                activeTab === tab 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-500 hover:text-black'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
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
                    <button className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-black font-medium">
                        Dạng lưới <Grid size={16} className="mt-0.5" />
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="flex flex-col px-4 md:px-6 pb-2 min-h-[200px]">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">Đang tải dữ liệu...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-red-500">{error}</span>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">Không có sản phẩm nào</span>
                    </div>
                ) : (
                    sortedProducts.map(product => (
                        <ProductListItem key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductListView;
