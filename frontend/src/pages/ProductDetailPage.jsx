import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Share2, MoreVertical, ChevronLeft, ChevronRight, Heart, MapPin, Clock, MessageCircle, Send, Check, Star, ShoppingBag } from 'lucide-react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext.jsx';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const productId = id || 1; // Default to 1 if no ID in URL
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    
    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState('');
    const [ratingInput, setRatingInput] = useState(5);
    
    // Chat
    const [stompClient, setStompClient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    
    // Auth - Get current user from AuthContext
    const { user: currentUser } = useAuth();

    useEffect(() => {
        let activeClient = null;

        const fetchProductData = async () => {
            try {
                // Fetch product details
                const productRes = await axios.get(`http://localhost:8080/api/products/${productId}`);
                setProduct(productRes.data);
                
                // Fetch reviews
                const reviewRes = await axios.get(`http://localhost:8080/api/reviews/product/${productId}`);
                setReviews(reviewRes.data);
                
                setLoading(false);
                
                // Fetch chat history if product has seller and user is logged in
                if (productRes.data.seller && currentUser?.userId) {
                    try {
                        const chatRes = await axios.get(`http://localhost:8080/api/chat/messages/${currentUser.userId}/${productRes.data.seller.userId}`);
                        setChatMessages(Array.isArray(chatRes.data) ? chatRes.data : []);
                    } catch (err) {
                        console.error("Error fetching chat history", err);
                    }
                } else {
                    setChatMessages([]);
                }
                
                // Setup WebSocket for chat if user is logged in
                if (currentUser?.userId) {
                    const socket = new SockJS('http://localhost:8080/ws');
                    const client = Stomp.over(socket);
                    activeClient = client;
                    client.connect({}, () => {
                        client.subscribe(`/queue/messages/${currentUser.userId}`, (msg) => {
                            const newMsg = JSON.parse(msg.body);
                            // Chỉ thêm tin nhắn nếu nó không trùng lặp với tin nhắn cuối
                            setChatMessages(prev => {
                                const isDuplicate = prev.some(m => m.sentAt === newMsg.sentAt && m.content === newMsg.content);
                                if (isDuplicate) return prev;
                                return [...prev, newMsg];
                            });
                        });
                    });
                    setStompClient(client);
                } else {
                    setStompClient(null);
                }
                
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        };

        fetchProductData();

        return () => {
            if (activeClient && activeClient.connected) {
                activeClient.disconnect();
            }
        };
    }, [productId, currentUser?.userId]);

    const handleNextImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    const handlePrevImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const toggleFavorite = async () => {
        if (!currentUser?.userId) {
            alert("Vui lòng đăng nhập để lưu tin đăng!");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:8080/api/favorites`, {
                userId: currentUser.userId,
                productId: productId
            });
            setIsFavorite(res.data.isFavorite);
        } catch (error) {
            console.error("Error toggling favorite", error);
        }
    };

    const handleAddReview = async () => {
        if (!currentUser?.userId) {
            alert("Vui lòng đăng nhập để gửi bình luận!");
            return;
        }
        if (!reviewInput.trim()) return;
        try {
            await axios.post(`http://localhost:8080/api/reviews`, {
                userId: currentUser.userId,
                productId: productId,
                content: reviewInput,
                rating: ratingInput
            });
            setReviewInput('');
            setRatingInput(5); // Reset to 5 stars
            // Reload reviews
            const reviewRes = await axios.get(`http://localhost:8080/api/reviews/product/${productId}`);
            setReviews(reviewRes.data);
        } catch (error) {
            console.error("Error adding review", error);
        }
    };

    const handleSendMessage = () => {
        if (!currentUser?.userId) {
            alert("Vui lòng đăng nhập để gửi tin nhắn!");
            return;
        }
        if (!chatInput.trim() || !product?.seller) return;
        
        const msg = {
            senderId: currentUser.userId,
            receiverId: product.seller.userId,
            content: chatInput,
        };
        
        if (stompClient && stompClient.connected) {
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
        }
        
        // Optimistically add to UI
        setChatMessages(prev => [...prev, { ...msg, sender: currentUser }]);
        setChatInput('');
    };

    const handleBuyNow = () => {
        if (!currentUser?.userId) {
            alert("Vui lòng đăng nhập để tiến hành mua hàng!");
            navigate('/login');
            return;
        }
        navigate(`/checkout/${productId}`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin sản phẩm...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Sản phẩm không tồn tại.</div>;
    }

    const images = product.images?.length > 0 ? product.images : ['/house_1.png'];
    const currentImageUrl = images[currentImageIndex];

    return (
        <div className="bg-[#F4F4F4] min-h-screen pb-10">
            <div className="max-w-[1000px] mx-auto px-4 pt-4">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                    <Link to="/" className="hover:underline text-blue-600">Trang chủ</Link>
                    <ChevronRight size={14} />
                    <span className="capitalize text-gray-600">{product.category || 'Danh mục'}</span>
                    <ChevronRight size={14} />
                    <span className="text-gray-400 truncate max-w-[200px]">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Left Column (2/3) */}
                    <div className="md:col-span-2 space-y-4">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-md overflow-hidden shadow-sm">
                            <div className="relative group bg-black flex justify-center items-center h-[350px] md:h-[450px]">
                                <img src={currentImageUrl} alt="Product" className="max-h-full object-contain" />
                                
                                {/* Navigation arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button onClick={handlePrevImage} className="absolute left-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition">
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button onClick={handleNextImage} className="absolute right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition">
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                                
                                {/* Image counter */}
                                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 text-xs rounded-full font-medium">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </div>
                            
                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="p-2 flex gap-2 overflow-x-auto items-center bg-white border-t">
                                    {images.map((img, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden cursor-pointer border-2 ${i === currentImageIndex ? 'border-brand-accent' : 'border-transparent'}`}
                                        >
                                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="bg-white rounded-md p-4 shadow-sm">
                            <h1 className="text-[20px] font-bold text-gray-800 leading-snug">
                                {product.title}
                            </h1>
                            
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-2xl font-bold text-brand-price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                                <div className="flex gap-3">
                                    <button className="flex flex-col items-center text-gray-500 hover:text-red-500 transition">
                                        <Share2 size={22} />
                                        <span className="text-[10px] mt-1">Chia sẻ</span>
                                    </button>
                                    <button onClick={toggleFavorite} className={`flex flex-col items-center transition ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                                        <Heart size={22} fill={isFavorite ? 'currentColor' : 'none'} /> 
                                        <span className="text-[10px] mt-1">{isFavorite ? 'Đã lưu' : 'Lưu tin'}</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="text-gray-500 text-[13px] flex items-center gap-4 mt-2 mb-4">
                                <span className="flex items-center gap-1"><Clock size={14} /> {product.createdAt ? new Date(product.createdAt).toLocaleString('vi-VN') : 'Mới đây'}</span>
                            </div>
                            
                            <div className="border-t pt-4">
                                <p className="font-bold text-[15px] mb-3">Đặc điểm tin đăng</p>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 w-24">Tình trạng:</span>
                                        <span className="font-medium">{product.status === 'available' ? 'Đã sử dụng (chưa sửa chữa)' : 'Đã bán'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 w-24">Danh mục:</span>
                                        <span className="font-medium capitalize">{product.category || 'Khác'}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-500 w-24">Lượt xem:</span>
                                        <span className="font-medium">{product.viewCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 border-t pt-4">
                                <p className="font-bold text-[15px] mb-3">Mô tả chi tiết</p>
                                <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                                    {product.description}
                                </div>
                            </div>
                        </div>

                        {/* Comment & Rating section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="text-brand-accent animate-pulse" size={22} />
                                    <h2 className="font-bold text-[17px] text-gray-800">
                                        Đánh giá & Bình luận ({reviews.length})
                                    </h2>
                                </div>
                            </div>

                            {/* Summary Dashboard */}
                            {reviews.length > 0 && (() => {
                                const totalReviews = reviews.length;
                                const avgRating = (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1);
                                const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                                reviews.forEach(r => {
                                    const rVal = r.rating || 5;
                                    distribution[rVal] = (distribution[rVal] || 0) + 1;
                                });

                                return (
                                    <div className="bg-neutral-50/75 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 md:gap-10 border border-neutral-100">
                                        {/* Left: Big score */}
                                        <div className="text-center md:border-r border-neutral-200 md:pr-10 shrink-0">
                                            <div className="text-5xl font-black text-gray-800 tracking-tight">{avgRating}</div>
                                            {/* Stars */}
                                            <div className="flex gap-1 justify-center my-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star 
                                                        key={s} 
                                                        size={16} 
                                                        className={s <= Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[12px] text-gray-500 font-medium">({totalReviews} đánh giá)</p>
                                        </div>

                                        {/* Right: Progress bars */}
                                        <div className="flex-1 w-full space-y-2 max-w-sm">
                                            {[5, 4, 3, 2, 1].map((stars) => {
                                                const count = distribution[stars] || 0;
                                                const percentage = ((count / totalReviews) * 100).toFixed(0);
                                                return (
                                                    <div key={stars} className="flex items-center gap-3 text-xs text-gray-600">
                                                        <span className="w-3 text-right font-medium">{stars}</span>
                                                        <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                                                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="w-8 text-right text-gray-400 font-medium">{percentage}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Reviews list */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                                {reviews.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 text-neutral-300 mb-3">
                                            <MessageCircle size={28} />
                                        </div>
                                        <p className="text-[13px] font-medium text-gray-400">Chưa có bình luận hay đánh giá nào.</p>
                                        <p className="text-[11px] text-gray-400">Hãy là người đầu tiên để lại đánh giá cho sản phẩm này!</p>
                                    </div>
                                ) : (
                                    reviews.map((rev, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-neutral-50/50 transition border border-transparent hover:border-neutral-100">
                                            <img 
                                                src={rev.user?.avatar || "/user_avatar.png"} 
                                                alt="avatar" 
                                                className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" 
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <div className="font-bold text-[13px] text-gray-800 truncate">
                                                        {rev.user?.fullName}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(rev.createdAt).toLocaleString('vi-VN', { 
                                                            year: 'numeric', month: '2-digit', day: '2-digit', 
                                                            hour: '2-digit', minute: '2-digit' 
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Rating stars of reviewer */}
                                                <div className="flex gap-0.5 mb-2">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star 
                                                            key={s} 
                                                            size={12} 
                                                            className={s <= (rev.rating || 5) ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                                                        />
                                                    ))}
                                                </div>

                                                {/* Comment text */}
                                                <p className="text-[13px] text-gray-600 leading-relaxed bg-neutral-50 px-3.5 py-2.5 rounded-2xl rounded-tl-none inline-block max-w-full break-words">
                                                    {rev.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Write Review box */}
                            <div className="border-t border-neutral-100 pt-6">
                                <p className="font-bold text-[14px] text-gray-800 mb-3">Gửi đánh giá của bạn</p>
                                
                                {/* Star Rating Input selector */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs text-gray-500 font-medium">Chọn số sao:</span>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button 
                                                key={s} 
                                                type="button" 
                                                onClick={() => setRatingInput(s)}
                                                className="transition transform active:scale-90 hover:scale-110"
                                            >
                                                <Star 
                                                    size={22} 
                                                    className={s <= ratingInput ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider ml-1">
                                        {ratingInput === 5 && 'Rất tốt'}
                                        {ratingInput === 4 && 'Tốt'}
                                        {ratingInput === 3 && 'Bình thường'}
                                        {ratingInput === 2 && 'Tệ'}
                                        {ratingInput === 1 && 'Rất tệ'}
                                    </span>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <img 
                                        src={currentUser?.avatar || "/user_avatar.png"} 
                                        alt="You" 
                                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" 
                                    />
                                    <div className="flex-1 relative">
                                        <textarea 
                                            rows={2}
                                            value={reviewInput}
                                            onChange={(e) => setReviewInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddReview();
                                                }
                                            }}
                                            placeholder={currentUser?.userId ? "Chia sẻ cảm nghĩ của bạn về sản phẩm này..." : "Vui lòng đăng nhập để gửi bình luận..."} 
                                            disabled={!currentUser?.userId}
                                            className="w-full bg-neutral-50/75 border border-neutral-200 focus:border-brand-accent focus:bg-white transition rounded-2xl px-4 py-3 text-sm outline-none resize-none placeholder:text-gray-400 text-gray-800 pr-12" 
                                        />
                                        <button 
                                            onClick={handleAddReview} 
                                            disabled={!currentUser?.userId || !reviewInput.trim()}
                                            className="absolute right-3.5 bottom-3.5 text-brand-accent hover:text-brand-hover disabled:text-gray-300 transition-colors p-1"
                                            title="Gửi đánh giá"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column (1/3) */}
                    <div className="space-y-4">
                        {/* Seller Profile Card - Style Chợ Tốt */}
                        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={product.seller?.avatar || "/user_avatar.png"} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${product.seller?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[15px] text-gray-800">{product.seller?.fullName || "Người bán ẩn danh"}</h3>
                                        <div className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                                            <span>Bán chuyên</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Check size={12} className="text-green-500"/> Đã xác thực</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-[12px] font-bold text-blue-600 border border-blue-600 rounded-full px-3 py-1 hover:bg-blue-50 transition">
                                    Xem trang
                                </button>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={handleBuyNow} 
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary text-neutral-900 font-bold rounded-xl hover:bg-brand-hover transition shadow-sm uppercase text-sm"
                                >
                                    <ShoppingBag size={18} /> ĐẶT HÀNG (MUA NGAY)
                                </button>
                                <button 
                                    onClick={() => setShowPhone(!showPhone)} 
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#589f39] text-white font-bold rounded-xl hover:bg-[#4d8c32] transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    {showPhone ? (product.seller?.phone || '0987654321') : 'BẤM ĐỂ HIỆN SỐ'}
                                </button>
                                <button 
                                    onClick={() => document.getElementById('chat-input').focus()} 
                                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-brand-accent text-brand-accent font-bold rounded-xl hover:bg-brand-accent/5 transition"
                                >
                                    <MessageCircle size={18} /> CHAT VỚI NGƯỜI BÁN
                                </button>
                            </div>
                        </div>

                        {/* Location Box */}
                        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
                            <p className="font-bold text-[15px] mb-3">Khu vực</p>
                            <div className="flex gap-2 items-start text-sm">
                                <MapPin className="text-gray-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-gray-700">
                                    {product.specificAddress && `${product.specificAddress}, `}
                                    {product.district && `${product.district}, `}
                                    {product.province || 'Huyện Tiền Hải, Thái Bình'}
                                </p>
                            </div>
                            <img src="https://i.imgur.com/3N4oX61.png" alt="Map mockup" className="w-full h-24 object-cover rounded mt-3 cursor-pointer opacity-80 hover:opacity-100 transition" />
                        </div>

                        {/* Chat Mini Section (Right column) */}
                        <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[350px]">
                            <div className="p-4 border-b border-neutral-50 font-bold text-[14px] text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Khung Chat Trực Tuyến
                            </div>
                            {!currentUser?.userId ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neutral-50/50 text-center gap-3">
                                    <MessageCircle size={32} className="text-gray-300" />
                                    <p className="text-[12px] text-gray-500 leading-relaxed max-w-[200px]">Vui lòng đăng nhập để bắt đầu trò chuyện với người bán.</p>
                                    <Link to="/login" className="px-5 py-2 bg-brand-primary text-black font-bold text-xs rounded-xl hover:bg-brand-hover transition shadow-sm">
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 p-4 overflow-y-auto bg-neutral-50/40 flex flex-col gap-3">
                                        {chatMessages.length === 0 ? (
                                            <div className="text-center text-[12px] text-gray-400 mt-10">
                                                Hãy gửi tin nhắn để hỏi thêm về sản phẩm!
                                            </div>
                                        ) : (
                                            chatMessages.map((msg, idx) => {
                                                const isMe = Number(msg.senderId) === Number(currentUser?.userId) || 
                                                             Number(msg.sender?.userId) === Number(currentUser?.userId);
                                                return (
                                                    <div 
                                                        key={idx} 
                                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed shadow-sm ${
                                                            isMe 
                                                                ? 'bg-brand-primary text-neutral-900 rounded-br-none self-end border border-brand-hover/10' 
                                                                : 'bg-white border border-neutral-100 text-gray-800 rounded-bl-none self-start'
                                                        }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-neutral-50 bg-white flex gap-2 items-center">
                                        <input 
                                            id="chat-input"
                                            type="text" 
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Nhập tin nhắn..." 
                                            className="flex-1 bg-neutral-50 border border-transparent focus:border-brand-primary-300 focus:bg-white transition rounded-full px-4 py-2 text-[13px] outline-none" 
                                        />
                                        <button 
                                            onClick={handleSendMessage} 
                                            className="bg-brand-primary hover:bg-brand-hover text-black p-2 rounded-full transition shrink-0 shadow-sm"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
