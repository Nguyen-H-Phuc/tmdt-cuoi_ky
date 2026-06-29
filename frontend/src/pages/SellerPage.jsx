import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    User, Star, Calendar, MapPin, GraduationCap, 
    ShoppingBag, MessageSquare, Phone, Mail, Award, Loader2 
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

const SellerPage = () => {
    const { sellerId } = useParams();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'reviews'

    useEffect(() => {
        const fetchSellerData = async () => {
            setLoading(true);
            try {
                // 1. Fetch seller profile info
                const userRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/profile/${sellerId}`);
                setSeller(userRes.data);

                // 2. Fetch seller's public products
                const productsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/products/seller/${sellerId}`);
                setProducts(productsRes.data || []);

                // 3. Fetch seller's reviews
                const reviewsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/reviews/seller/${sellerId}`);
                setReviews(reviewsRes.data || []);
            } catch (error) {
                console.error("Lỗi khi tải thông tin người bán:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [sellerId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <span className="text-sm text-gray-500 font-bold">Đang tải thông tin trang người bán...</span>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy người bán</h2>
                <p className="text-gray-500 mt-2">Tài khoản này không tồn tại hoặc đã bị khóa.</p>
                <Link to="/" className="inline-block mt-4 px-6 py-2 bg-brand-primary text-gray-900 font-bold rounded-lg">
                    Quay về trang chủ
                </Link>
            </div>
        );
    }

    // Calculations
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
        : null;

    const formattedJoinedDate = seller.createdAt 
        ? new Date(seller.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
        : 'Mới gia nhập';

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            {/* Header Profile Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    {/* Avatar */}
                    <div className="relative">
                        <img 
                            src={seller.avatar && seller.avatar !== 'null' && seller.avatar !== 'undefined' ? seller.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.fullName}`} 
                            alt={seller.fullName}
                            className="w-28 h-28 rounded-full object-cover border-4 border-blue-50/50 shadow-md"
                        />
                        {seller.role === 'admin' && (
                            <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-900 p-1.5 rounded-full shadow border-2 border-white" title="Quản trị viên / Pro Seller">
                                <Award size={16} />
                            </span>
                        )}
                    </div>

                    {/* Stats & Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                                {seller.fullName}
                                {seller.role === 'admin' && (
                                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase border border-yellow-200">
                                        Pro Seller
                                    </span>
                                )}
                            </h1>
                            {seller.university && (
                                <p className="text-sm font-semibold text-blue-600 flex items-center gap-1.5 justify-center md:justify-start mt-1">
                                    <GraduationCap size={16} />
                                    {seller.university}
                                </p>
                            )}
                        </div>

                        {/* Bio */}
                        {seller.bio ? (
                            <p className="text-xs text-gray-500 italic max-w-2xl bg-gray-50 p-3 rounded-xl border border-gray-100">
                                "{seller.bio}"
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Chưa cập nhật giới thiệu bản thân.</p>
                        )}

                        {/* Quick Specs */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-6 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                Gia nhập: {formattedJoinedDate}
                            </span>
                            {seller.address && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-gray-400" />
                                    Địa chỉ: {seller.address}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Block stats summary cards */}
                    <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 self-center md:self-start pt-4 md:pt-0">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 text-center">
                            <ShoppingBag className="text-blue-600 mx-auto mb-1" size={18} />
                            <span className="block text-sm font-black text-blue-900">{products.length}</span>
                            <span className="text-[10px] text-blue-600 font-bold">Tin đăng</span>
                        </div>
                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3 text-center">
                            <Star className="text-amber-500 mx-auto mb-1 fill-amber-500" size={18} />
                            <span className="block text-sm font-black text-amber-900">
                                {avgRating ? `${avgRating}/5` : 'N/A'}
                            </span>
                            <span className="text-[10px] text-amber-600 font-bold">Đánh giá</span>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 text-center">
                            <MessageSquare className="text-emerald-600 mx-auto mb-1" size={18} />
                            <span className="block text-sm font-black text-emerald-900">{reviews.length}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">Phản hồi</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all px-2 ${
                        activeTab === 'products' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Sản phẩm đang bán ({products.length})
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-all px-2 ${
                        activeTab === 'reviews' 
                            ? 'border-blue-600 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Đánh giá từ khách hàng ({reviews.length})
                </button>
            </div>

            {/* Tab content area */}
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border border-gray-100">
                {activeTab === 'products' ? (
                    products.length === 0 ? (
                        <div className="py-12 text-center">
                            <ShoppingBag className="text-gray-300 mx-auto mb-3" size={40} />
                            <h3 className="text-base font-bold text-gray-700">Chưa có sản phẩm nào đăng bán</h3>
                            <p className="text-gray-400 text-xs mt-1">Người bán hiện tại chưa có mặt hàng công khai nào.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 justify-items-center">
                            {products.map(product => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    )
                ) : (
                    reviews.length === 0 ? (
                        <div className="py-12 text-center">
                            <MessageSquare className="text-gray-300 mx-auto mb-3" size={40} />
                            <h3 className="text-base font-bold text-gray-700">Chưa nhận được đánh giá nào</h3>
                            <p className="text-gray-400 text-xs mt-1">Giao dịch với người bán này để gửi đánh giá đầu tiên của bạn.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.reviewId} className="bg-gray-50/50 p-4 rounded-xl border border-gray-150 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={review.reviewerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerName || 'Reviewer'}`} 
                                                alt={review.reviewerName}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                                            />
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-800">{review.reviewerName || 'Khách hàng'}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className="flex text-amber-400">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={12} 
                                                                className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-semibold">
                                                        • {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'Gần đây'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
 
                                        {/* Related Product Link */}
                                        {review.productTitle && (
                                            <Link 
                                                to={`/product/${review.productId}`}
                                                className="text-[10px] font-bold text-blue-600 bg-white hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 transition-colors"
                                            >
                                                Sản phẩm: {review.productTitle}
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed pl-13">
                                        {review.content || 'Người mua không để lại nhận xét bằng lời.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SellerPage;
