import axios from 'axios';
import { API_URL } from '../config/constants';

export const createMomoPayment = async (amount, packageName, duration = 1) => {
    try {
        const response = await axios.post(`${API_URL}/api/payment/momo/create`, {
            amount: amount.toString(),
            packageName,
            duration: duration.toString()
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelMomoPayment = async (paymentId) => {
    try {
        const response = await axios.post(`${API_URL}/api/payment/momo/cancel/${paymentId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}; 