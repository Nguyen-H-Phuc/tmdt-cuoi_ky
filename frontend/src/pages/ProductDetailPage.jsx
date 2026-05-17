import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Share2, MoreVertical, ChevronLeft, ChevronRight, Heart, MapPin, Clock, MessageCircle, Send, Check } from 'lucide-react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';

const ProductDetailPage = () => {
    const { id } = useParams();
    const productId = id || 1; // Default to 1 if no ID in URL
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    
    // Reviews
    const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState('');
    
    // Chat
    const [stompClient, setStompClient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    
    // Auth - Mock user
    const currentUser = { userId: 3, fullName: "Khách hàng" };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // Fetch product details
                const productRes = await axios.get(`http://localhost:8080/api/products/${productId}`);
                setProduct(productRes.data);
                
                // Fetch reviews
                const reviewRes = await axios.get(`http://localhost:8080/api/reviews/product/${productId}`);
                setReviews(reviewRes.data);
                
                setLoading(false);
                
                // Setup WebSocket for chat
                const socket = new SockJS('http://localhost:8080/ws');
                const client = Stomp.over(socket);
                client.connect({}, () => {
                    client.subscribe(`/user/${currentUser.userId}/queue/messages`, (msg) => {
                        const newMsg = JSON.parse(msg.body);
                        setChatMessages(prev => [...prev, newMsg]);
                    });
                });
                setStompClient(client);
                
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    const handleNextImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    const handlePrevImage = () => {
        if (!product?.images?.length) return;
        setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const toggleFavorite = async () => {
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
        if (!reviewInput.trim()) return;
        try {
            await axios.post(`http://localhost:8080/api/reviews`, {
                userId: currentUser.userId,
                productId: productId,
                content: reviewInput
            });
            setReviewInput('');
            // Reload reviews
            const reviewRes = await axios.get(`http://localhost:8080/api/reviews/product/${productId}`);
            setReviews(reviewRes.data);
        } catch (error) {
            console.error("Error adding review", error);
        }
    };

    const handleSendMessage = () => {
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

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin sản phẩm...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Sản phẩm không tồn tại.</div>;
    }

    const images = product.images?.length > 0 ? product.images : ['/house_1.png'];
    const currentImageUrl = images[currentImageIndex];

    return (
        <div className="bg-gray-100 min-h-screen py-4">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="md:col-span-2 space-y-4">
                    {/* Image Gallery */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="relative group bg-gray-900 flex justify-center items-center h-[400px]">
                            <img src={currentImageUrl} alt="Product" className="max-h-full object-contain" />
                            
                            {/* Top right buttons */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow backdrop-blur-sm transition">
                                    <Share2 size={20} className="text-gray-700" />
                                </button>
                                <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow backdrop-blur-sm transition">
                                    <MoreVertical size={20} className="text-gray-700" />
                                </button>
                            </div>
                            
                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button onClick={handlePrevImage} className="absolute left-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={handleNextImage} className="absolute right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100">
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                            
                            {/* Image counter */}
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 text-sm rounded-full backdrop-blur-sm font-medium">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        </div>
                        
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="p-2 flex gap-2 overflow-x-auto items-center relative">
                                <div className="flex gap-2 mx-2">
                                    {images.map((img, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${i === currentImageIndex ? 'border-orange-500' : 'border-transparent'}`}
                                        >
                                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                                {product.title}
                            </h1>
                            <button 
                                onClick={toggleFavorite}
                                className={`flex items-center gap-1 border rounded-full px-4 py-1.5 text-sm font-medium transition flex-shrink-0 ${isFavorite ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /> {isFavorite ? 'Đã Lưu' : 'Lưu'}
                            </button>
                        </div>
                        
                        <div className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                            <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">{product.category}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="capitalize">{product.status === 'available' ? 'Còn hàng' : 'Đã bán'}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{product.viewCount} lượt xem</span>
                        </div>
                        
                        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mt-4">
                            <span className="text-2xl md:text-3xl font-bold text-red-600">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </span>
                        </div>
                        
                        <div className="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
                            {product.description}
                        </div>
                        
                        {/* Location */}
                        <div className="flex justify-between items-start gap-4 mt-6 border-t pt-4">
                            <div className="flex gap-3">
                                <MapPin className="text-gray-500 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="font-medium text-gray-800 leading-relaxed">
                                        {product.specificAddress && `${product.specificAddress}, `}
                                        {product.district && `${product.district}, `}
                                        {product.province}
                                    </p>
                                    <a href={`https://maps.google.com/?q=${product.specificAddress}, ${product.province}`} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline mt-1 inline-block">Xem bản đồ</a>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-4 border-t pt-4">
                            <Clock size={16} />
                            <span>Đăng vào: {new Date(product.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                    </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                    {/* Seller Info Card */}
                    <div className="bg-white border rounded-xl p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="relative">
                                <img src={product.seller?.avatar || "/user_avatar.png"} alt="Avatar" className="w-14 h-14 rounded-full object-cover border" />
                                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${product.seller?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-gray-800">{product.seller?.fullName || "Người bán ẩn danh"}</h3>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    Tham gia từ: {product.seller?.createdAt ? new Date(product.seller.createdAt).getFullYear() : 'N/A'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-5">
                            <button onClick={() => document.getElementById('chat-input').focus()} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition">
                                <MessageCircle size={20} /> Chat
                            </button>
                            <button onClick={() => setShowPhone(!showPhone)} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#ff8c00] text-white font-bold rounded-lg hover:bg-[#e67e00] transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                {showPhone ? (product.seller?.phone || 'Chưa cập nhật') : 'Hiện số điện thoại'}
                            </button>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="bg-white border rounded-xl shadow-sm flex flex-col h-[350px]">
                        <div className="p-3 border-b font-bold text-gray-800 flex items-center gap-2">
                            <MessageCircle size={18} className="text-blue-500" />
                            Chat với người bán
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
                            {chatMessages.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 mt-10">
                                    Chưa có tin nhắn. Hãy bắt đầu trò chuyện!
                                </div>
                            ) : (
                                chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.senderId === currentUser.userId || msg.sender?.userId === currentUser.userId ? 'bg-blue-500 text-white self-end' : 'bg-white border text-gray-800 self-start'}`}>
                                        {msg.content}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-2 border-t flex gap-2">
                            <input 
                                id="chat-input"
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Nhập tin nhắn..." 
                                className="flex-1 bg-gray-100 rounded-full px-4 text-sm outline-none" 
                            />
                            <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition flex-shrink-0">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Comment section */}
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                        <div className="p-4 border-b font-bold text-gray-800">
                            Đánh giá & Bình luận
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {reviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <MessageCircle size={32} className="text-gray-300" />
                                    </div>
                                    <p>Chưa có bình luận nào.</p>
                                    <p className="text-sm">Hãy là người đầu tiên bình luận.</p>
                                </div>
                            ) : (
                                reviews.map((rev, index) => (
                                    <div key={index} className="flex gap-3">
                                        <img src={rev.user?.avatar || "/user_avatar.png"} alt="avatar" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">{rev.user?.fullName}</div>
                                            <div className="text-xs text-gray-400 mb-1">{new Date(rev.createdAt).toLocaleString('vi-VN')}</div>
                                            <div className="text-sm text-gray-700">{rev.content}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 border-t bg-gray-50 flex gap-2 items-center">
                            <div className="flex-1 bg-white border rounded-full px-4 py-2 flex items-center">
                                <input 
                                    type="text" 
                                    value={reviewInput}
                                    onChange={(e) => setReviewInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddReview()}
                                    placeholder="Viết bình luận..." 
                                    className="w-full bg-transparent outline-none text-sm" 
                                />
                            </div>
                            <button onClick={handleAddReview} className="text-blue-500 p-2 hover:bg-blue-50 rounded-full transition">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ProductDetailPage;
