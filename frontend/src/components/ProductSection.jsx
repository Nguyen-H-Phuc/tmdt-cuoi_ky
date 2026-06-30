import React, { useState, useEffect } from 'react';
import ProductListItem from './ProductListItem';
import apiClient, { getImageUrl } from '../api/apiClient';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ProductSection = ({ title, apiEndpoint }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(apiEndpoint)
            .then(response => {
                const raw = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.content)
                        ? response.data.content
                        : [];

                // Map sang format ProductListItem dùng (giống ProductListView)
                const mapped = raw.map(p => ({
                    productId: p.productId,
                    title: p.title,
                    specs: `${p.category ? (typeof p.category === 'object' ? p.category.categoryName : p.category) : 'Khác'} • ${p.status === 'available' ? 'Có sẵn' : 'Đã bán'}`,
                    price: `${p.price?.toLocaleString('vi-VN')} đ`,
                    rawPrice: p.price || 0,
                    location: p.province || p.seller?.address || 'Toàn quốc',
                    time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Mới đây',
                    isPriority: false,
                    imageCount: p.images?.length || (p.imageUrl ? 1 : 0),
                    imageUrl: getImageUrl(p.imageUrl),
                    sellerName: p.seller?.fullName || p.sellerName || 'Người bán ẩn danh',
                    sellerAvatar: p.seller?.avatar || p.sellerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seller?.fullName || 'Seller'}`,
                    isProSeller: p.seller?.role === 'admin',
                    seller: p.seller,
                    category: typeof p.category === 'object' ? p.category : { categoryName: p.category },
                    status: p.status,
                    targetUniversity: p.targetUniversity,
                }));

                setProducts(mapped);
                setLoading(false);
            })
            .catch(error => {
                console.error(`Lỗi khi tải ${title}:`, error);
                setProducts([]);
                setLoading(false);
            });
    }, [apiEndpoint]);

    if (loading) {
        return (
            <section className="w-full py-4">
                <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-4 py-4 border-b border-gray-100">
                            <div className="w-32 h-32 bg-gray-200 rounded-md animate-pulse flex-shrink-0" />
                            <div className="flex-1 flex flex-col gap-2 py-1">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="w-full py-4">
            <div className="w-full max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6">
                {/* Tiêu đề & Link xem tất cả */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-brand-accent inline-block pb-1">
                        {title}
                    </h2>
                    <Link
                        to="/products"
                        className="text-[13px] md:text-sm font-bold text-[#38699F] hover:underline flex items-center gap-1 transition-all"
                    >
                        Xem tất cả <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Danh sách sản phẩm – cùng style với ProductListView dạng list */}
                <div className="flex flex-col">
                    {products.map(product => (
                        <ProductListItem key={product.productId} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;