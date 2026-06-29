import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Search } from 'lucide-react';

const ChatInbox = () => {
    const { user: authUser } = useAuth();
    const currentUser = authUser || { userId: 3, fullName: "Khách hàng" };
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (!currentUser?.userId) return;
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/chat/conversations/${currentUser.userId}`)
            .then(res => setConversations(res.data))
            .catch(err => console.error("Error loading inbox", err));
    }, [currentUser?.userId]);

    return (
        <div className="flex-1 bg-white rounded-xl shadow-[0px_4px_16px_rgba(34,34,34,0.12)] p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý Tin nhắn</h2>
            
            <div className="relative mb-6">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm cuộc trò chuyện..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="flex flex-col gap-3">
                {conversations.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>Bạn chưa có cuộc trò chuyện nào.</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div key={conv.conversationId} className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition items-center">
                            <img src={conv.otherUser?.avatar || "/user_avatar.png"} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-gray-800 text-[15px] truncate">{conv.otherUser?.fullName || "Người dùng"}</h4>
                                    <span className="text-xs text-gray-500">
                                        {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {conv.product && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded truncate max-w-[120px]">
                                            {conv.product.title}
                                        </span>
                                    )}
                                    <p className="text-sm text-gray-500 truncate">Nhấn để xem tiếp trò chuyện...</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatInbox;
