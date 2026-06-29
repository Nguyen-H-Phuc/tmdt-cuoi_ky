import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Share2, MoreVertical, ChevronLeft, ChevronRight, Heart, MapPin, Clock, MessageCircle, Send, Check, Star, ShoppingBag, ShoppingCart, AlertCircle, Info, Lock, Eye, Tag } from 'lucide-react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
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
    const [eligibility, setEligibility] = useState({
        eligible: false,
        message: 'Vui lòng đăng nhập để gửi đánh giá.',
        remainingEdits: 0,
        deadline: null,
        isEdit: false
    });
    
    // Chat
    const [stompClient, setStompClient] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    
    // Auth - Get current user from AuthContext
    const { user: currentUser } = useAuth();
    const { addToCart } = useCart();

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
                
                // Fetch review eligibility
                if (currentUser?.userId) {
                    try {
                        const eligibilityRes = await axios.get(`http://localhost:8080/api/reviews/eligibility?productId=${productId}&userId=${currentUser.userId}`);
                        const eligibilityData = eligibilityRes.data;
                        if (eligibilityData.review) {
                            setEligibility({
                                eligible: false,
                                message: 'Bạn đã đánh giá sản phẩm này rồi. Để chỉnh sửa đánh giá, vui lòng truy cập Lịch sử mua hàng.',
                                remainingEdits: 0,
                                deadline: null,
                                isEdit: true
                            });
                            setReviewInput('');
                            setRatingInput(5);
                        } else {
                            setEligibility({
                                eligible: eligibilityData.eligible,
                                message: eligibilityData.message || '',
                                remainingEdits: eligibilityData.remainingEdits !== undefined ? eligibilityData.remainingEdits : 2,
                                deadline: eligibilityData.deadline,
                                isEdit: false
                            });
                            setReviewInput('');
                            setRatingInput(5);
                        }
                    } catch (err) {
                        console.error("Error fetching review eligibility", err);
                    }
                } else {
                    setEligibility({
                        eligible: false,
                        message: 'Vui lòng đăng nhập để gửi đánh giá.',
                        remainingEdits: 0,
                        deadline: null,
                        isEdit: false
                    });
                }
                
                setLoading(false);
                
                // Fetch chat history if product has seller and user is logged in
                if (productRes.data.seller && currentUser?.userId) {
                    try {
                        const convRes = await axios.get(`http://localhost:8080/api/chat/conversations/${currentUser.userId}`);
                        const convs = convRes.data;
                        // Find conversation for this product and seller
                        const targetConv = convs.find(c => c.otherUser?.userId === productRes.data.seller.userId && c.product?.productId === parseInt(productId));
                        if (targetConv) {
                            const msgRes = await axios.get(`http://localhost:8080/api/chat/messages/${targetConv.conversationId}`);
                            setChatMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
                        } else {
                            setChatMessages([]);
                        }
                    } catch(err) {
                        console.error("Error loading chat history", err);
                        setChatMessages([]);
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
                        client.subscribe(`/user/${currentUser.userId}/queue/messages`, (msg) => {
                            const newMsg = JSON.parse(msg.body);
                            // Chỉ thêm tin nhắn nếu nó không trùng lặp với tin nhắn cuối
                            setChatMessages(prev => {
                                const isDuplicate = prev.some(m => (m.sentAt === newMsg.sentAt && (m.content === newMsg.content || m.messageText === newMsg.content)));
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

    const formatDeadline = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddReview = async () => {
        if (!currentUser?.userId) {
            alert("Vui lòng đăng nhập để gửi bình luận!");
            return;
        }
        if (!eligibility.eligible) {
            alert(eligibility.message || "Bạn không đủ điều kiện để đánh giá sản phẩm này.");
            return;
        }
        if (!reviewInput.trim()) return;
        try {
            await axios.post(`http://localhost:8080/api/reviews`, {
                userId: currentUser.userId,
                productId: productId,
                content: reviewInput.trim(),
                rating: ratingInput
            });
            alert("Đã lưu đánh giá thành công!");
            
            // Reload reviews
            const reviewRes = await axios.get(`http://localhost:8080/api/reviews/product/${productId}`);
            setReviews(reviewRes.data);
            
            // Reload eligibility
            const eligibilityRes = await axios.get(`http://localhost:8080/api/reviews/eligibility?productId=${productId}&userId=${currentUser.userId}`);
            const eligibilityData = eligibilityRes.data;
            if (eligibilityData.review) {
                setEligibility({
                    eligible: false,
                    message: 'Bạn đã đánh giá sản phẩm này rồi. Để chỉnh sửa đánh giá, vui lòng truy cập Lịch sử mua hàng.',
                    remainingEdits: 0,
                    deadline: null,
                    isEdit: true
                });
                setReviewInput('');
                setRatingInput(5);
            } else {
                setEligibility({
                    eligible: eligibilityData.eligible,
                    message: eligibilityData.message || '',
                    remainingEdits: eligibilityData.remainingEdits !== undefined ? eligibilityData.remainingEdits : 2,
                    deadline: eligibilityData.deadline,
                    isEdit: false
                });
                setReviewInput('');
                setRatingInput(5);
            }
        } catch (error) {
            console.error("Error adding/updating review", error);
            const errMsg = error.response?.data?.message || error.message || "Đã xảy ra lỗi khi lưu đánh giá.";
            alert(`Lỗi: ${errMsg}`);
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
            productId: parseInt(productId)
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
            showToast("Vui lòng đăng nhập để tiến hành mua hàng!", "warning");
            navigate('/login');
            return;
        }
        navigate(`/checkout/${productId}`);
    };

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart(product, 1);
            showToast("Đã thêm sản phẩm vào giỏ hàng thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            const errMsg = error.response?.data?.message || error.response?.data || error.message;
            showToast(`Không thể thêm vào giỏ hàng: ${errMsg}`, "error");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin sản phẩm...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Sản phẩm không tồn tại.</div>;
    }

    const images = product.images?.length > 0 
        ? product.images.map(img => (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) ? img : `/${img}`)
        : ['/house_1.png'];
    const currentImageUrl = images[currentImageIndex];

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-16 font-sans">
            <div className="max-w-6xl mx-auto px-4 pt-6">
                
                {/* Flat Breadcrumb */}
                <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 py-2">
                    <Link to="/" className="hover:text-black transition-colors font-medium">Trang chủ</Link>
                    <ChevronRight size={12} className="text-gray-400" />
                    <span className="capitalize hover:text-black transition-colors cursor-pointer font-medium">{product.category || 'Danh mục'}</span>
                    <ChevronRight size={12} className="text-gray-400" />
                    <span className="text-gray-450 truncate max-w-[250px] font-normal">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Flat Image Gallery */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative group bg-neutral-100 h-[380px] sm:h-[480px] w-full">
                                <img src={currentImageUrl} alt="Product" className="w-full h-full object-cover" />
                                
                                {/* Navigation arrows (Flat Square) */}
                                {images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={handlePrevImage} 
                                            className="absolute left-4 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg border border-gray-300 transition-colors cursor-pointer shadow-none"
                                        >
                                            <ChevronLeft size={20} className="stroke-[2.5]" />
                                        </button>
                                        <button 
                                            onClick={handleNextImage} 
                                            className="absolute right-4 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg border border-gray-300 transition-colors cursor-pointer shadow-none"
                                        >
                                            <ChevronRight size={20} className="stroke-[2.5]" />
                                        </button>
                                    </>
                                )}
                                
                                {/* Image counter */}
                                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 text-xs rounded-md font-bold">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </div>
                            
                            {/* Flat Thumbnails list */}
                            {images.length > 1 && (
                                <div className="p-3 flex gap-2 overflow-x-auto items-center bg-gray-50 border-t border-gray-200 scrollbar-thin">
                                    {images.map((img, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border transition-all ${
                                                i === currentImageIndex 
                                                    ? 'border-gray-900 scale-95' 
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Flat Product Core Info */}
                        <div className="bg-white p-6 border border-gray-200 rounded-2xl space-y-6 shadow-sm">
                            <div className="space-y-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                                    {product.title}
                                </h1>
                                
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Clock size={14} className="text-gray-400" /> 
                                        {product.createdAt ? new Date(product.createdAt).toLocaleString('vi-VN') : 'Mới đây'}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Eye size={14} className="text-gray-400" />
                                        Lượt xem: {product.viewCount || 0}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 bg-transparent border-b border-gray-150">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Giá bán</p>
                                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-150 rounded-lg border border-gray-300 text-gray-600 transition-colors cursor-pointer">
                                        <Share2 size={18} />
                                    </button>
                                    <button 
                                        onClick={toggleFavorite} 
                                        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all cursor-pointer ${
                                            isFavorite 
                                                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                                : 'bg-white hover:bg-gray-150 border-gray-300 text-gray-600 hover:text-rose-500'
                                        }`}
                                    >
                                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Specifications Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">Thông số sản phẩm</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 py-2 bg-transparent">
                                        <div className="text-gray-550 flex items-center justify-center shrink-0">
                                            <Info size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tình trạng</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {product.status === 'available' ? 'Đã sử dụng' : 'Đã bán'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 py-2 bg-transparent">
                                        <div className="text-gray-550 flex items-center justify-center shrink-0">
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Danh mục</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">
                                                {product.category || 'Khác'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Description */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">Mô tả chi tiết</h3>
                                <div className="text-gray-700 whitespace-pre-line text-xs sm:text-sm leading-relaxed mt-2">
                                    {product.description}
                                </div>
                            </div>
                        </div>

                        {/* Flat Reviews Section */}
                        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="text-gray-900" size={18} />
                                    <h2 className="font-bold text-xs sm:text-sm text-gray-800 uppercase tracking-wider">
                                        Đánh giá & Bình luận ({reviews.length})
                                    </h2>
                                </div>
                            </div>

                            {reviews.length > 0 && (() => {
                                const totalReviews = reviews.length;
                                const avgRating = (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1);
                                const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                                reviews.forEach(r => {
                                    const rVal = r.rating || 5;
                                    distribution[rVal] = (distribution[rVal] || 0) + 1;
                                });

                                return (
                                    <div className="bg-gray-50 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 border border-gray-200">
                                        <div className="text-center md:border-r border-gray-200 md:pr-10 shrink-0">
                                            <div className="text-5xl font-black text-gray-85 tracking-tight">{avgRating}</div>
                                            <div className="flex gap-0.5 justify-center my-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star 
                                                        key={s} 
                                                        size={14} 
                                                        className={s <= Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">({totalReviews} đánh giá)</p>
                                        </div>

                                        <div className="flex-1 w-full space-y-2 max-w-sm">
                                            {[5, 4, 3, 2, 1].map((stars) => {
                                                const count = distribution[stars] || 0;
                                                const percentage = ((count / totalReviews) * 100).toFixed(0);
                                                return (
                                                    <div key={stars} className="flex items-center gap-3 text-xs text-gray-655">
                                                        <span className="w-3 text-right font-bold">{stars}</span>
                                                        <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                                            <div 
                                                                className="h-full bg-gray-800 rounded-full transition-all duration-500" 
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="w-8 text-right text-gray-400 font-bold">{percentage}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Reviews list */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                                {reviews.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 mb-3">
                                            <MessageCircle size={22} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-700">Chưa có bình luận hay đánh giá nào.</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Hãy là người đầu tiên để lại đánh giá cho sản phẩm này!</p>
                                    </div>
                                ) : (
                                    reviews.map((rev, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                                            <img 
                                                src={rev.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${rev.user?.fullName || 'U'}`} 
                                                alt="avatar" 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" 
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <div className="font-bold text-xs text-gray-900 truncate">
                                                        {rev.user?.fullName}
                                                    </div>
                                                </div>

                                                <div className="flex gap-0.5 mb-2">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star 
                                                            key={s} 
                                                            size={12} 
                                                            className={s <= (rev.rating || 5) ? "text-amber-400 fill-amber-400" : "text-gray-205"} 
                                                        />
                                                    ))}
                                                </div>

                                                <p className="text-[13px] text-gray-805 leading-relaxed bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg inline-block max-w-full break-words">
                                                    {rev.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Write Review block */}
                            {(!currentUser?.userId || !eligibility.isEdit) && (
                                <div className="border-t border-gray-200 pt-6">
                                    {!currentUser?.userId ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center space-y-3">
                                            <Lock className="mx-auto text-gray-450 stroke-[1.5]" size={26} />
                                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Đăng nhập để đánh giá</h4>
                                            <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                                                Chỉ những khách hàng đã mua sản phẩm này thành công mới có thể đánh giá và nhận xét.
                                            </p>
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="px-5 py-2.5 text-xs font-bold text-white bg-gray-900 hover:bg-black rounded-lg border border-black transition-colors cursor-pointer select-none"
                                            >
                                                Đăng nhập ngay
                                            </button>
                                        </div>
                                    ) : !eligibility.eligible ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4.5 flex gap-3 text-xs text-gray-600 leading-relaxed">
                                            <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-800">Không thể viết đánh giá</p>
                                                <p className="text-gray-500 mt-1">{eligibility.message}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                                                Gửi đánh giá của bạn
                                            </p>
                                            
                                            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-900 leading-relaxed">
                                                <Info size={18} className="text-amber-550 shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-bold">Đánh giá của bạn có thể chỉnh sửa tối đa 2 lần.</p>
                                                    <p className="text-amber-700 mt-0.5">Lưu ý: Sau khi gửi, bạn chỉ có thể chỉnh sửa đánh giá này từ Lịch sử mua hàng trong vòng 7 ngày.</p>
                                                </div>
                                            </div>

                                            {/* Star selector */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Chọn số sao:</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button 
                                                            key={s} 
                                                            type="button" 
                                                            onClick={() => setRatingInput(s)}
                                                            className="transition transform active:scale-95 cursor-pointer"
                                                        >
                                                            <Star 
                                                                size={22} 
                                                                className={s <= ratingInput ? "text-amber-400 fill-amber-400" : "text-gray-300"} 
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                                                    {ratingInput === 5 && 'Rất tốt'}
                                                    {ratingInput === 4 && 'Tốt'}
                                                    {ratingInput === 3 && 'Bình thường'}
                                                    {ratingInput === 2 && 'Tệ'}
                                                    {ratingInput === 1 && 'Rất tệ'}
                                                </span>
                                            </div>

                                            <div className="flex gap-4 items-start">
                                                <img 
                                                    src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.fullName || 'U'}`} 
                                                    alt="You" 
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" 
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <textarea 
                                                        rows={3}
                                                        value={reviewInput}
                                                        onChange={(e) => setReviewInput(e.target.value)}
                                                        placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất lượng..." 
                                                        className="w-full bg-white border border-gray-200 focus:border-gray-900 transition-colors rounded-lg px-4 py-3 text-xs outline-none resize-none placeholder:text-gray-400 text-gray-800" 
                                                    />
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={handleAddReview}
                                                            disabled={!reviewInput.trim()}
                                                            className="px-6 py-2.5 bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                                        >
                                                            <Send size={14} />
                                                            Gửi đánh giá
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column (1/3) */}
                    <div className="space-y-6">
                        
                        {/* Seller Profile Card */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative shrink-0">
                                        <img src={product.seller?.avatar || "/user_avatar.png"} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${product.seller?.isActive ? 'bg-green-500' : 'bg-gray-455'}`}></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[14px] text-gray-900 truncate">{product.seller?.fullName || "Người bán ẩn danh"}</h3>
                                        <div className="text-[9px] text-gray-455 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                            <span>Thành viên</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5 text-green-600"><Check size={10} className="stroke-[3]"/> Đã xác thực</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/seller/${product.seller?.userId}`}>
                                    <button className="text-[10px] font-bold text-gray-800 hover:text-black border border-gray-300 hover:border-gray-500 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer">
                                        Xem trang
                                    </button>
                                </Link>
                            </div>
                            
                            {/* Action Buttons (Flat styling) */}
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={handleBuyNow} 
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#ffc107] hover:bg-[#e0a800] text-gray-900 font-bold rounded-lg border border-[#ffc107] hover:border-[#e0a800] transition-colors uppercase text-xs tracking-wider cursor-pointer"
                                >
                                    <ShoppingBag size={16} className="stroke-[2.5]" /> ĐẶT HÀNG (MUA NGAY)
                                </button>
                                
                                <button 
                                    onClick={handleAddToCart} 
                                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-900 hover:bg-gray-50 text-gray-955 font-bold rounded-lg transition-colors uppercase text-xs tracking-wider cursor-pointer"
                                >
                                    <ShoppingCart size={16} className="stroke-[2.5]" /> Thêm vào giỏ hàng
                                </button>
                                
                                <button 
                                    onClick={() => setShowPhone(!showPhone)} 
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors uppercase text-xs tracking-wider cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    {showPhone ? (product.seller?.phone || '0987654321') : 'BẤM ĐỂ HIỆN SỐ'}
                                </button>
                                
                                <button 
                                    onClick={() => document.getElementById('chat-input')?.focus()} 
                                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all uppercase text-xs tracking-wider cursor-pointer"
                                >
                                    <MessageCircle size={16} className="stroke-[2.5]" /> CHAT VỚI NGƯỜI BÁN
                                </button>
                            </div>
                        </div>

                        {/* Location Box */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
                            <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Khu vực giao dịch</p>
                            <div className="flex gap-2.5 items-start text-xs sm:text-sm">
                                <MapPin className="text-gray-900 shrink-0 mt-0.5" size={18} />
                                <p className="text-gray-700 font-semibold">
                                    {product.specificAddress && `${product.specificAddress}, `}
                                    {product.district && `${product.district}, `}
                                    {product.province || product.seller?.address || 'Toàn quốc'}
                                </p>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border border-gray-250 mt-3 shadow-inner">
                                <img src="https://i.imgur.com/3N4oX61.png" alt="Map mockup" className="w-full h-24 object-cover opacity-90 transition-opacity" />
                            </div>
                        </div>

                        {/* Chat Mini Section (Right column) */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col h-[380px] shadow-sm">
                            <div className="p-4 border-b border-gray-200 font-bold text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50 shrink-0">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 align-middle"></span>
                                Khung Chat Trực Tuyến
                            </div>
                            {!currentUser?.userId ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 text-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 text-gray-400 flex items-center justify-center">
                                        <MessageCircle size={20} />
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">Vui lòng đăng nhập để bắt đầu trò chuyện với người bán.</p>
                                    <Link to="/login" className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-lg border border-black transition-colors cursor-pointer">
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 scrollbar-thin">
                                        {/* Product Context Card inside chat */}
                                        <div className="bg-white p-2.5 rounded-lg border border-gray-200 mb-2 flex gap-2.5 items-center shrink-0">
                                            <img src={currentImageUrl} alt="Product" className="w-10 h-10 object-cover rounded-md border border-gray-200" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-800 truncate">{product.title}</p>
                                                <p className="text-[11px] text-gray-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                                            </div>
                                        </div>

                                        {chatMessages.length === 0 ? (
                                            <div className="text-center text-xs text-gray-400 mt-10 font-bold">
                                                Hãy gửi tin nhắn để hỏi thêm về sản phẩm!
                                            </div>
                                        ) : (
                                            chatMessages.map((msg, idx) => {
                                                const isMe = Number(msg.senderId) === Number(currentUser?.userId) || 
                                                             Number(msg.sender?.userId) === Number(currentUser?.userId);
                                                return (
                                                    <div 
                                                        key={idx} 
                                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed border ${
                                                            isMe 
                                                                ? 'bg-gray-800 text-white border-gray-800 rounded-br-none self-end' 
                                                                : 'bg-white border-gray-200 text-gray-800 rounded-bl-none self-start'
                                                        }`}
                                                    >
                                                        {msg.content || msg.messageText}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center shrink-0">
                                        <input 
                                            id="chat-input"
                                            type="text" 
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Nhập tin nhắn..." 
                                            className="flex-1 bg-gray-50 border border-gray-205 focus:border-gray-500 transition-colors rounded-lg px-4 py-2 text-xs outline-none text-gray-850" 
                                        />
                                        <button 
                                            onClick={handleSendMessage} 
                                            className="bg-gray-900 hover:bg-black text-white p-2.5 rounded-lg border border-black transition-colors cursor-pointer"
                                        >
                                            <Send size={14} />
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
