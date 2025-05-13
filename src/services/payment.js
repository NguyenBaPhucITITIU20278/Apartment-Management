import { API_URLS } from '../config/api';
import axios from 'axios';
import Cookies from 'js-cookie';

const getAuthHeader = () => ({
    headers: {
        'Authorization': `Bearer ${Cookies.get('Authorization')}`,
        'Content-Type': 'application/json'
    }
});

export const createMomoPayment = async (amount, orderInfo) => {
    try {
        const response = await axios.post(
            `${API_URLS.PAYMENT}/momo/create`,
            { amount, orderInfo },
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error('Error creating MoMo payment:', error);
        throw error;
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const response = await axios.get(
            `${API_URLS.PAYMENT}/momo/verify`,
            {
                params: paymentData,
                ...getAuthHeader()
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};

export const createRoomWithPayment = async (roomData, paymentInfo) => {
    try {
        // First, create the room
        const formData = new FormData();
        
        // Add room data
        Object.keys(roomData).forEach(key => {
            if (key !== 'files') {
                formData.append(key, roomData[key]);
            }
        });

        // Add files if they exist
        if (roomData.files) {
            Object.keys(roomData.files).forEach(fileType => {
                const files = roomData.files[fileType];
                if (Array.isArray(files)) {
                    files.forEach(file => {
                        formData.append(fileType, file);
                    });
                } else {
                    formData.append(fileType, files);
                }
            });
        }

        // Add payment information
        formData.append('paymentInfo', JSON.stringify(paymentInfo));

        const response = await axios.post(
            `${API_URLS.ROOMS}/create-with-payment`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('Authorization')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating room with payment:', error);
        throw error;
    }
}; 