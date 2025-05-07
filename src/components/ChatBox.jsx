import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiX, FiUser, FiRefreshCw, FiDownload, FiFile, FiLoader } from 'react-icons/fi';
import { message } from 'antd';
import chatService from '../services/chatbox';
import Cookies from 'js-cookie';

const ChatBox = ({ onClose, role, userName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const loadUserList = async () => {
        if (role === 'admin') {
            try {
                const users = await chatService.getUserList();
                console.log('Loaded users:', users);
                setUserList(users.filter(user => user.role !== 'admin'));
            } catch (error) {
                console.error('Error loading user list:', error);
                message.error('Failed to load user list');
            }
        }
    };

    useEffect(() => {
        if (role === 'admin') {
            loadUserList();
        }
    }, [role]);

    const handleUserSelect = async (user) => {
        console.log('Selected user:', user);
        await setSelectedUser(user);
        // Clear existing messages when switching users
        setMessages([]);
        // Add a small delay to ensure state is updated
        setTimeout(() => {
            loadChatHistory();
        }, 100);
    };

    const handleMessageReceived = (message) => {
        console.log("Received message:", message);
        setMessages(prev => [...prev, message]);
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        
        if (role === 'admin' && message.senderId && !userList.find(u => u.username === message.senderId)) {
            loadUserList();
        }
    };

    const handleMessageRead = (messageId) => {
        setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
        ));
    };

    const connectWebSocket = async () => {
        try {
            setIsConnecting(true);
            setConnectionError(null);
            
            const currentRole = Cookies.get('role');
            const currentUserName = Cookies.get('userName');

            if (!currentUserName) {
                throw new Error('User not authenticated');
            }

            await chatService.connect(
                currentUserName,
                handleMessageReceived,
                handleMessageRead
            );

            setIsConnected(true);
            
            // Only load chat history for regular users on connect
            // For admin, we'll load it when they select a user
            if (currentRole !== 'admin') {
                loadChatHistory();
            }
        } catch (error) {
            console.error('WebSocket connection error:', error);
            setConnectionError(error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            chatService.disconnect();
        };
    }, []);

    const loadChatHistory = async () => {
        try {
            console.log('Loading chat history...');
            const currentRole = Cookies.get('role');
            let userId, adminId;

            if (currentRole === 'admin') {
                if (!selectedUser) {
                    console.log('No user selected yet, skipping chat history load');
                    return;
                }
                // Ensure we get the username consistently
                userId = selectedUser?.userName || selectedUser?.username || selectedUser;
                adminId = Cookies.get('userName');
                
                console.log('Admin loading chat history for user:', userId);
            } else {
                userId = Cookies.get('userName');
                adminId = 'admin';
                console.log('User loading chat history with admin');
            }

            if (!userId || !adminId) {
                console.warn('Missing userId or adminId for chat history:', { userId, adminId });
                return;
            }

            console.log('Loading chat history for:', { userId, adminId });
            const history = await chatService.getChatHistory(userId, adminId);
            console.log('Loaded chat history:', history);
            
            if (Array.isArray(history)) {
            setMessages(history);
            } else {
                console.error('Invalid chat history format:', history);
                message.error('Failed to load chat history: Invalid format');
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            message.error('Failed to load chat history');
        }
    };

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Check file size (limit to 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSize) {
                message.error('File size must be less than 5MB');
                return;
            }

            // Check file type (allow various types including .glb)
            const allowedTypes = [
                'image/jpeg', 
                'image/png', 
                'image/gif', 
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                'application/vnd.ms-excel', 
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                'text/plain',
                'model/gltf-binary', // MIME type for .glb files
                'application/octet-stream' // Generic type for binary files
            ];

            // Log the MIME type for debugging
            console.log("Selected file type:", selectedFile.type);

            // Check for .glb extension as a fallback
            const isGLBFile = selectedFile.name.endsWith('.glb');

            if (!allowedTypes.includes(selectedFile.type) && !isGLBFile) {
                message.error('Only images, PDFs, documents, and 3D files are allowed');
                return;
            }

            console.log("Selected file:", selectedFile);
            setFile(selectedFile);
            setUploadProgress(0);
        }
    };

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && !file) || !userName) return;
        
        if (role === 'admin' && !selectedUser) {
            message.warning('Please select a user to chat with');
            return;
        }

        if (!isConnected) {
            setConnectionError('Cannot send message: Not connected to chat server');
            return;
        }

        try {
            const receiverUsername = role === 'admin' 
                ? (selectedUser.username || selectedUser.userName || selectedUser) 
                : 'admin';

            if (file) {
                setIsUploading(true);
                console.log("Sending file:", file);
                try {
                    const result = await chatService.uploadFile(
                        file, 
                        userName,
                        receiverUsername,
                        newMessage || `Sent ${file.name}`
                    );
                    console.log("File upload result:", result);
                setMessages(prev => [...prev, result]);
                setFile(null);
                    setUploadProgress(0);
                    message.success('File uploaded successfully');
                } catch (error) {
                    console.error("File upload error:", error);
                    message.error('Failed to upload file. Please try again.');
                } finally {
                    setIsUploading(false);
                }
            } else {
                const messageData = {
                    content: newMessage,
                    senderId: userName,
                    receiverId: receiverUsername,
                    timestamp: new Date().toISOString()
                };
                console.log("Sending message:", messageData);
                await chatService.sendMessage(messageData);
                setMessages(prev => [...prev, messageData]);
            }

            setNewMessage('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setConnectionError('Failed to send message. Please try again.');
            message.error('Failed to send message');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
                <h3 className="font-semibold text-lg">
                    {role === 'admin' 
                        ? (selectedUser 
                            ? `Chat with ${selectedUser.username || selectedUser.userName || selectedUser}` 
                            : 'Select a User')
                        : 'Chat with Admin'}
                </h3>
                <div className="flex items-center gap-2">
                    {!isConnected && (
                        <button 
                            onClick={connectWebSocket}
                            className="p-2 hover:text-gray-300"
                            disabled={isConnecting}
                        >
                            <FiRefreshCw className={`${isConnecting ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                <button onClick={onClose} className="hover:text-gray-300">
                    <FiX size={24} />
                </button>
            </div>
            </div>

            {/* Connection Status */}
            {connectionError && (
                <div className="bg-red-100 text-red-600 px-4 py-2 text-sm">
                    {connectionError}
                </div>
            )}

            {/* User List for Admin */}
            {role === 'admin' && (
                <div className="p-2 border-b max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                        {userList.map((user) => (
                            <button
                                key={user.id || user.username || user.userName}
                                onClick={() => handleUserSelect(user)}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    selectedUser?.username === user.username || 
                                    selectedUser?.userName === user.userName ||
                                    selectedUser === user.username
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {user.username || user.userName || user}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === userName;
                    const senderName = isOwnMessage ? 'You' : (msg.senderName || msg.senderId);
                    
                    return (
                    <div
                        key={index}
                            className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                    isOwnMessage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                                {!isOwnMessage && (
                                    <div className="text-xs font-semibold mb-1">
                                        {senderName}
                                    </div>
                                )}
                                {msg.fileType && msg.fileType.startsWith('image/') ? (
                                    <div className="relative">
                                        <div className="group">
                                            {console.log('Attempting to load image from:', msg.fileUrl)}
                                            <img
                                                src={msg.fileUrl}
                                                alt={msg.fileName || "Uploaded image"}
                                                className="max-w-full rounded"
                                                onError={(e) => {
                                                    console.error("Error loading image:", {
                                                        url: e.target.src,
                                                        fileName: msg.fileName,
                                                        fileUrl: msg.fileUrl,
                                                        fileType: msg.fileType
                                                    });
                                                    // Replace the img with a placeholder div
                                                    const parent = e.target.parentNode;
                                                    const placeholder = document.createElement('div');
                                                    placeholder.className = 'bg-gray-200 rounded flex items-center justify-center p-4 min-h-[200px]';
                                                    placeholder.innerHTML = `
                                                        <div class="text-center">
                                                            <div class="text-gray-400 mb-2">
                                                                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <p class="text-gray-500">Failed to load image</p>
                                                            <p class="text-sm text-gray-400 break-all">${msg.fileName || 'Image'}</p>
                                                            <p class="text-xs text-gray-400 mt-1 break-all">${msg.fileUrl || 'No URL'}</p>
                                                        </div>
                                                    `;
                                                    parent.replaceChild(placeholder, e.target);
                                                    message.error('Failed to load image');
                                                }}
                                                style={{ maxHeight: '300px', objectFit: 'contain' }}
                                            />
                                            <a
                                                href={msg.fileUrl}
                                                download={msg.fileName}
                                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(msg.fileUrl, '_blank');
                                                }}
                                        >
                                                <FiDownload size={16} />
                                        </a>
                                        </div>
                                </div>
                                ) : msg.fileUrl && msg.fileName ? (
                                    <a
                                        href={msg.fileUrl}
                                        download={msg.fileName}
                                        className="flex items-center gap-2 text-blue-200 hover:text-blue-100"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FiFile size={20} />
                                        <span>{msg.fileName}</span>
                                    </a>
                                ) : null}
                                {msg.content && (
                                    <p className="mt-2">{msg.content}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                            role === 'admin' && !selectedUser
                                ? 'Select a user to start chatting...'
                                : 'Type a message...'
                        }
                        disabled={role === 'admin' && !selectedUser || isUploading}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,model/gltf-binary,.glb"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        disabled={role === 'admin' && !selectedUser || isUploading}
                    >
                        <FiPaperclip size={20} />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        disabled={!isConnected || (role === 'admin' && !selectedUser) || isUploading}
                        className={`p-2 rounded-lg ${
                            isConnected && (role !== 'admin' || selectedUser) && !isUploading
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-gray-400 text-gray-200'
                        }`}
                    >
                        {isUploading ? (
                            <div className="animate-spin">
                                <FiLoader size={20} />
                            </div>
                        ) : (
                        <FiSend size={20} />
                        )}
                    </button>
                </div>
                {file && (
                    <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                            <span>Selected file: {file.name}</span>
                        <button
                                onClick={() => {
                                    setFile(null);
                                    setUploadProgress(0);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                                <FiX size={16} />
                        </button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBox; 