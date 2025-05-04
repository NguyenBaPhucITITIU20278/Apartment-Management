import React, { useState, useEffect } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import ChatBox from './ChatBox';
import chatService from '../services/chatbox';
import Cookies from 'js-cookie';
import { isAuthenticated } from '../services/auth';

const ChatButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const auth = useSelector((state) => state.auth);
    const role = Cookies.get('role');
    const userName = Cookies.get('userName');

    useEffect(() => {
        // Kiểm tra tin nhắn chưa đọc khi component mount
        const checkUnreadMessages = async () => {
            try {
                if (userName) {
                    const unreadMessages = await chatService.getUnreadMessages(userName);
                    setUnreadCount(unreadMessages.length);
                }
            } catch (error) {
                console.error('Error checking unread messages:', error);
            }
        };

        const isAuth = isAuthenticated();
        if (isAuth && userName && !isChatOpen) {
            checkUnreadMessages();
            // Kiểm tra tin nhắn chưa đọc mỗi 30 giây
            const interval = setInterval(checkUnreadMessages, 30000);
            return () => clearInterval(interval);
        }
    }, [userName, isChatOpen]);

    const handleChatOpen = () => {
        setIsChatOpen(true);
        setUnreadCount(0); // Reset unread count when opening chat
    };

    // Only render if user is authenticated
    if (!isAuthenticated() || !userName) {
        return null;
    }

    return (
        <>
            <button
                onClick={handleChatOpen}
                className="bottom-30 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                style={{ display: isChatOpen ? 'none' : 'block' }}
            >
                <FiMessageCircle size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} role={role} userName={userName} />}
        </>
    );
};

export default ChatButton; 