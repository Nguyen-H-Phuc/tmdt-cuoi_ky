import React, { useState, useEffect } from 'react';
import ProductListItem from './ProductListItem';
import { ChevronDown, Grid } from 'lucide-react';
import axios from 'axios';

const ProductListView = () => {
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tabs = ['Tất cả', 'Cá nhân', 'Bán chuyên'];

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
                    location: p.user?.address || 'Toàn quốc',
                    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Mới đây',
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
                <div className="flex items-center gap-3 md:gap-5 text-sm">
                    <button className="flex items-center gap-1 text-gray-700 hover:text-black font-medium">
                        Liên quan nhất <ChevronDown size={16} className="mt-0.5" />
                    </button>
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
                ) : products.length === 0 ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">Không có sản phẩm nào</span>
                    </div>
                ) : (
                    products.map(product => (
                        <ProductListItem key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductListView;
