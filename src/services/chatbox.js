import axios from "axios";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';
import API_URLS from "../config/api";

const BASE_URL = API_URLS.CHAT;
const WS_URL = 'https://apartment-backend-30kj.onrender.com/ws';

const getHeaders = () => {
    const token = Cookies.get('Authorization');
    const userName = Cookies.get('userName');
    if (!token) {
        throw new Error("Access token is missing");
    }
    return {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        userName: userName,
    };
};

class ChatService {
    constructor() {
        this.stompClient = null;
        this.subscription = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000; // 2 seconds
    }

    async getUserList() {
        try {
            const response = await axios.get(`${API_URLS.USERS}/all`, {
                headers: {
                    Authorization: `Bearer ${getHeaders().Authorization}`
                }
            });
            // Filter out admin users and transform the response if needed
            return response.data.filter(user => user.role?.roleName !== 'admin').map(user => ({
                username: user.userName,
                id: user.userName,
                role: user.role?.roleName
            }));
        } catch (error) {
            console.error('Error fetching user list:', error);
            throw error;
        }
    }

    connect(userName, onMessageReceived, onMessageRead) {
        const token = getHeaders().Authorization;
        
        if (!token) {
            throw new Error('No authentication token found');
        }

        return new Promise((resolve, reject) => {
            const socket = new SockJS(WS_URL);
            this.stompClient = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                    userName: userName
                },
                onConnect: () => {
                    console.log('Connected to WebSocket');
                    
                    // Subscribe to personal queue
                    this.subscription = this.stompClient.subscribe(
                        `/user/${userName}/queue/messages`,
                        (message) => {
                            const receivedMessage = JSON.parse(message.body);
                            onMessageReceived(receivedMessage);
                        }
                    );

                    // Subscribe to read receipts if provided
                    if (onMessageRead) {
                        this.stompClient.subscribe(
                            `/user/${userName}/queue/read-receipts`,
                            (receipt) => {
                                const messageId = JSON.parse(receipt.body);
                                onMessageRead(messageId);
                            }
                        );
                    }

                    resolve();
                },
                onDisconnect: () => {
                    console.log('Disconnected from WebSocket');
                    this.handleDisconnect(userName, onMessageReceived, onMessageRead);
                },
                onError: (error) => {
                    console.error('WebSocket Error:', error);
                    reject(error);
                }
            });

            this.stompClient.activate();
        });
    }

    disconnect() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }
        this.reconnectAttempts = 0;
    }

    async sendMessage(message) {
        if (!this.stompClient?.active) {
            throw new Error('Not connected to WebSocket');
        }

        const token = getHeaders().Authorization;

        this.stompClient.publish({
            destination: '/app/chat',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
    }

    async uploadFile(file, senderId, receiverId, content) {
        const token = getHeaders().Authorization;
        const formData = new FormData();
        
        formData.append('file', file, file.name);
        formData.append('senderId', senderId);
        formData.append('receiverId', receiverId);
        formData.append('content', content || '');

        try {
            console.log('Uploading file:', {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                senderId,
                receiverId
            });

            const response = await axios.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload progress:', percentCompleted);
                }
            });

            console.log('Upload response:', response.data);

            // Ensure the response includes the complete file URL
            const message = response.data;
            if (message.fileUrl && !message.fileUrl.startsWith('http')) {
                message.fileUrl = `${API_URLS.API_BASE_URL}${message.fileUrl}`;
            }

            // Add file information to message
            message.fileName = file.name;
            message.fileType = file.type;
            message.fileSize = file.size;

            return message;
        } catch (error) {
            console.error('Error uploading file:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw error;
        }
    }

    async getChatHistory(userId, adminId) {
        try {
            const response = await axios.get(`${BASE_URL}/history/${userId}/${adminId}`, {
                headers: {
                    Authorization: `Bearer ${getHeaders().Authorization}`
                }
            });

            // Ensure all file URLs are complete
            return response.data.map(message => {
                if (message.fileUrl && !message.fileUrl.startsWith('http')) {
                    message.fileUrl = `${window.location.origin}${message.fileUrl}`;
                }
                return message;
            });
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    }

    async getAllUsers() {
        const token = getHeaders().Authorization;
        if (!token) {
            throw new Error('No admin token found');
        }

        try {
            const response = await axios.get(
                'http://localhost:8080/api/users',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    handleDisconnect(userName, onMessageReceived, onMessageRead) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect(userName, onMessageReceived, onMessageRead);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    handleError(error) {
        if (this.stompClient?.active) {
            this.disconnect();
        }
    }

    // Check connection status
    isConnected() {
        return this.stompClient?.active ?? false;
    }

    // Lấy tin nhắn chưa đọc
    async getUnreadMessages(adminId) {
        const token = getHeaders().Authorization;
        try {
            const response = await axios.get(
                `${BASE_URL}/unread/${adminId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching unread messages:', error);
            throw error;
        }
    }

    // Đánh dấu tin nhắn đã đọc
    async markMessageAsRead(messageId, adminId) {
        const token = getHeaders().Authorization;
        try {
            await axios.post(
                `${BASE_URL}/read/${messageId}/${adminId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }

    // Xóa tất cả tin nhắn
    async deleteAllMessages(userId, adminId) {
        const token = getHeaders().Authorization;
        try {
            await axios.delete(
                `${BASE_URL}/messages/${userId}/${adminId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            console.error('Error deleting messages:', error);
            throw error;
        }
    }
}

// Export singleton instance
const chatService = new ChatService();
export default chatService; 