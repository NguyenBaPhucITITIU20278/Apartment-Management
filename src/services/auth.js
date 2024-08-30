
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const { accessToken } = await response.json();
        localStorage.setItem('accessToken', accessToken);
    } else {
        // Xử lý lỗi, có thể yêu cầu người dùng đăng nhập lại
        console.error('Failed to refresh access token');
    }
};

export const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.status === 401) { // Unauthorized, token có thể đã hết hạn
        await refreshAccessToken();
        accessToken = localStorage.getItem('accessToken');
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