import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ProductSection = ({ title, apiEndpoint }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080${apiEndpoint}`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else if (response.data && Array.isArray(response.data.content)) {
                    setProducts(response.data.content);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error(`Lỗi khi tải ${title}:`, error);
                setProducts([]);
                setLoading(false);
            });
    }, [apiEndpoint, title]);

    if (loading) return <div className="py-8 text-center text-gray-500">Đang tải {title}...</div>;
    if (!products || !Array.isArray(products) || products.length === 0) return null; // Không hiện section nếu không có data

    return (
        <section className="w-full bg-[#F4F4F4] py-4 flex justify-center">
            <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-sm p-4 md:p-6">
                {/* Tiêu đề khu vực & Link xem tất cả */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 uppercase border-b-2 border-[#FFBA00] inline-block pb-1">
                        {title}
                    </h2>
                    <Link 
                        to="/products" 
                        className="text-[13px] md:text-sm font-bold text-[#38699F] hover:underline flex items-center gap-1 transition-all"
                    >
                        Xem tất cả <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Grid hiển thị sản phẩm - Tối ưu lại khoảng cách */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 justify-items-center">
                    {products.map(product => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductSection;