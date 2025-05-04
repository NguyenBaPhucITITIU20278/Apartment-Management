import Cookies from 'js-cookie';

export const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('refresh_token');
    const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const { accessToken } = await response.json();
        Cookies.set('Authorization', accessToken, { expires: 7 });
    } else {
        // Xử lý lỗi, có thể yêu cầu người dùng đăng nhập lại
        console.error('Failed to refresh access token');
        // Clear all auth cookies
        Cookies.remove('Authorization');
        Cookies.remove('refresh_token');
        Cookies.remove('userName');
        Cookies.remove('role');
    }
};

export const fetchWithAuth = async (url, options = {}) => {
    let accessToken = Cookies.get('Authorization');

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.status === 401) { // Unauthorized, token có thể đã hết hạn
        await refreshAccessToken();
        accessToken = Cookies.get('Authorization');
        
        if (!accessToken) {
            throw new Error('Authentication failed');
        }
        
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`
            }
        });
    }

    return response;
};

export const isAuthenticated = () => {
    const token = Cookies.get('Authorization');
    const role = Cookies.get('role');
    return Boolean(token && role);
};

export const logout = () => {
    Cookies.remove('Authorization');
    Cookies.remove('refresh_token');
    Cookies.remove('userName');
    Cookies.remove('role');
};