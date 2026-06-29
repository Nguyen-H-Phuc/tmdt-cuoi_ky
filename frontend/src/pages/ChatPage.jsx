import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Send, Search, MessageCircle, Clock, Check, ArrowLeft, ShoppingBag } from 'lucide-react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';

const ChatPage = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    
    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser?.userId) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Fetch conversations list
    const fetchConversations = async () => {
        if (!currentUser?.userId) return;
        try {
            setLoadingConvs(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/chat/conversations/${currentUser.userId}`);
            setConversations(Array.isArray(res.data) ? res.data : []);
            setLoadingConvs(false);
        } catch (error) {
            console.error("Error fetching conversations", error);
            setLoadingConvs(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [currentUser?.userId]);

    // Filter conversations based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredConversations(conversations);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredConversations(
                conversations.filter(c => 
                    c.otherUser?.fullName?.toLowerCase().includes(query) || 
                    c.product?.title?.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, conversations]);

    // Subscribe to real-time messages via WebSocket
    useEffect(() => {
        if (!currentUser?.userId) return;
        
        const socket = new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws`);
        const client = Stomp.over(socket);
        // Turn off debug logging to keep console clean
        client.debug = () => {};
        
        client.connect({}, () => {
            client.subscribe(`/user/${currentUser.userId}/queue/messages`, (msg) => {
                const newMsg = JSON.parse(msg.body);
                
                // If it is from the currently active conversation participant, add to messages list
                setSelectedConv(currentSelected => {
                    if (currentSelected && Number(newMsg.senderId || newMsg.sender?.userId) === Number(currentSelected.otherUser?.userId)) {
                        setMessages(prev => {
                            // Check for duplicates
                            if (prev.some(m => m.sentAt === newMsg.sentAt && (m.content === newMsg.content || m.messageText === newMsg.content))) return prev;
                            return [...prev, newMsg];
                        });
                    }
                    return currentSelected;
                });

                // Refresh conversations list to show newest message snippet
                fetchConversations();
            });
        });
        
        setStompClient(client);

        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [currentUser?.userId]);

    // Fetch message history when a conversation is selected
    useEffect(() => {
        if (!selectedConv || !currentUser?.userId) return;

        const fetchMessages = async () => {
            try {
                setLoadingMessages(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/chat/messages/${selectedConv.conversationId}`);
                setMessages(Array.isArray(res.data) ? res.data : []);
                setLoadingMessages(false);
            } catch (error) {
                console.error("Error fetching message history", error);
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedConv, currentUser?.userId]);

    // Auto-scroll to bottom of chat when new message arrives or selected conversation changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, selectedConv]);

    const handleSendMessage = () => {
        if (!chatInput.trim() || !selectedConv || !currentUser?.userId) return;

        const msg = {
            senderId: currentUser.userId,
            receiverId: selectedConv.otherUser?.userId,
            content: chatInput,
            productId: selectedConv.product?.productId ? parseInt(selectedConv.product.productId) : null
        };

        if (stompClient && stompClient.connected) {
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(msg));
        }

        // Optimistically add to UI
        const newLocalMsg = {
            senderId: currentUser.userId,
            content: chatInput,
            sentAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, newLocalMsg]);
        setChatInput('');

        // Update local conversations list quickly
        setConversations(prev => {
            return prev.map(c => {
                if (c.conversationId === selectedConv.conversationId) {
                    return {
                        ...c,
                        lastMessageSnippet: chatInput,
                        lastMessageAt: new Date().toISOString()
                    };
                }
                return c;
            }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        });
    };

    // Helper to format timestamps nicely
    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const date = new Date(timeString);
            const now = new Date();
            
            // If today, show hours:minutes
            if (date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            }
            
            // If yesterday
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return 'Hôm qua';
            }
            
            // Otherwise, show day/month
            return `${date.getDate()}/${date.getMonth() + 1}`;
        } catch (e) {
            return '';
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto px-4 py-6">
            {/* Header section with back button */}
            <div className="flex items-center gap-3 mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-neutral-200 rounded-full transition text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Hộp thư nhắn tin</h1>
                    <p className="text-xs text-gray-500">Trao đổi và trả lời nhanh tin nhắn của khách hàng</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(34,34,34,0.06)] border border-neutral-100 flex overflow-hidden h-[620px]">
                {/* LEFT COLUMN: Conversation List (1/3 width) */}
                <div className="w-[340px] border-r border-neutral-100 flex flex-col h-full bg-white">
                    {/* Search box */}
                    <div className="p-4 border-b border-neutral-50 shrink-0">
                        <div className="relative flex items-center bg-neutral-100 rounded-xl px-3 py-2">
                            <Search size={16} className="text-neutral-400 shrink-0 mr-2" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm theo tên người bán, người mua..."
                                className="w-full bg-transparent outline-none text-xs text-neutral-800 placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    {/* Chat list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-neutral-50">
                        {loadingConvs ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-xs gap-2">
                                <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang tải danh sách...</span>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                                <MessageCircle size={32} className="text-neutral-300" />
                                <span>Không tìm thấy cuộc hội thoại nào</span>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const isSelected = selectedConv?.conversationId === conv.conversationId;
                                const otherUser = conv.otherUser || {};
                                return (
                                    <div
                                        key={conv.conversationId}
                                        onClick={() => setSelectedConv(conv)}
                                        className={`p-3.5 flex items-center gap-3.5 cursor-pointer transition-colors relative ${
                                            isSelected 
                                                ? 'bg-neutral-50 border-l-4 border-brand-accent' 
                                                : 'hover:bg-neutral-50/50'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <img 
                                                src={otherUser.avatar || "/user_avatar.png"} 
                                                alt={otherUser.fullName}
                                                className="w-11 h-11 rounded-full object-cover border border-neutral-100"
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>

                                        {/* Snippet details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="font-bold text-[13px] text-gray-800 truncate leading-snug">
                                                    {otherUser.fullName || "Người dùng"}
                                                </h3>
                                                <span className="text-[10px] text-gray-400 shrink-0 font-medium ml-2">
                                                    {formatTime(conv.lastMessageAt)}
                                                </span>
                                            </div>
                                            
                                            {/* Preview product context if exists */}
                                            {conv.product && (
                                                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mb-1">
                                                    <ShoppingBag size={10} />
                                                    <span className="truncate max-w-[180px]">{conv.product.title}</span>
                                                </div>
                                            )}

                                            <p className="text-[11px] text-neutral-500 truncate pr-2 leading-relaxed">
                                                {conv.lastMessageSnippet || "Chưa có tin nhắn"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Selected Conversation Messages (2/3 width) */}
                <div className="flex-1 flex flex-col h-full bg-[#f8f9fa]">
                    {!selectedConv ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100 text-amber-500">
                                <MessageCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-800">Chọn cuộc trò chuyện</h3>
                                <p className="text-xs text-gray-500 mt-1 max-w-[300px]">Hãy chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu đọc và gửi tin nhắn trao đổi.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b border-neutral-100 px-5 py-3.5 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={selectedConv.otherUser?.avatar || "/user_avatar.png"} 
                                        alt={selectedConv.otherUser?.fullName}
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                    <div>
                                        <h2 className="font-bold text-[14px] text-gray-800">{selectedConv.otherUser?.fullName}</h2>
                                        <p className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            Đang hoạt động
                                        </p>
                                    </div>
                                </div>

                                {/* Active Product details banner */}
                                {selectedConv.product && (
                                    <div className="bg-brand-primary-50 border border-brand-primary-100 rounded-xl px-3 py-1.5 max-w-[280px] hidden sm:flex items-center gap-2">
                                        <div className="text-left min-w-0">
                                            <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-tight">Sản phẩm đang hỏi</p>
                                            <Link 
                                                to={`/product/${selectedConv.product.productId}`} 
                                                className="text-[11px] font-bold text-neutral-800 truncate block hover:underline hover:text-brand-accent"
                                            >
                                                {selectedConv.product.title}
                                            </Link>
                                        </div>
                                        <span className="text-[11px] font-bold text-brand-price shrink-0">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedConv.product.price)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Messages Body */}
                            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
                                {loadingMessages ? (
                                    <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                                        Đang tải lịch sử hội thoại...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-neutral-400 gap-2">
                                        <span>Hai người chưa từng gửi tin nhắn cho nhau trước đây.</span>
                                        <span>Gửi tin để bắt đầu trò chuyện!</span>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = Number(msg.senderId || msg.sender?.userId) === Number(currentUser?.userId);
                                        return (
                                            <div 
                                                key={idx}
                                                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${
                                                    isMe 
                                                        ? 'bg-brand-primary text-neutral-900 font-medium rounded-br-none self-end' 
                                                        : 'bg-white border border-neutral-100 text-gray-800 rounded-bl-none self-start'
                                                }`}
                                            >
                                                <p>{msg.content || msg.messageText}</p>
                                                <span className={`text-[9px] block text-right mt-1.5 ${
                                                    isMe ? 'text-neutral-500' : 'text-neutral-400'
                                                }`}>
                                                    {new Date(msg.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Footer Input */}
                            <div className="bg-white border-t border-neutral-100 p-3 flex gap-2 items-center shrink-0">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Nhập nội dung tin nhắn..." 
                                    className="flex-1 bg-neutral-100 rounded-full px-5 py-2.5 text-[13px] outline-none border border-transparent focus:border-brand-primary-300 focus:bg-white transition-all placeholder:text-neutral-400" 
                                />
                                <button 
                                    onClick={handleSendMessage} 
                                    className="bg-brand-primary hover:bg-brand-hover text-black p-2.5 rounded-full transition flex-shrink-0 active:scale-95 shadow-md shadow-brand-primary/10"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
