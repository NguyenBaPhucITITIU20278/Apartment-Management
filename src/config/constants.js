// API URLs
export const API_URL = 'http://localhost:8080';

// MoMo Payment Configuration
export const MOMO_CONFIG = {
    PARTNER_CODE: 'MOMO',
    ACCESS_KEY: 'F8BBA842ECF85',
    SECRET_KEY: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    ENDPOINT: 'https://test-payment.momo.vn/v2/gateway/api/create'
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED'
};

// File Upload Limits
export const UPLOAD_LIMITS = {
    IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
    MODEL_SIZE: 50 * 1024 * 1024 // 50MB
}; 