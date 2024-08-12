import axios from 'axios';

export const axiosJWT = axios.create();
const API_URL = 'http://localhost:8080/api/users';

export const findUser = async (data) => {
    try {
        const response = await axiosJWT.post(`${API_URL}/findUser`, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Error request:', error.request);
        } else {
            // Something else happened while setting up the request
            console.error('Error message:', error.message);
        }
        throw error;
    }
};