const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://apartment-backend-30kj.onrender.com'
    : 'http://localhost:8080';

export const API_URLS = {
    USERS: `${API_BASE_URL}/api/users`,
    ROOMS: `${API_BASE_URL}/api/rooms`,
    ADMIN: `${API_BASE_URL}/api/admin`,
    AUTH: `${API_BASE_URL}/api/auth`,
    IMAGES: `${API_BASE_URL}/images`,
    CHAT: `${API_BASE_URL}/api/chat`,
    PAYMENT: `${API_BASE_URL}/api/payment`,
    COMMENTS: `${API_BASE_URL}/api/comments`
};

export default API_URLS; 