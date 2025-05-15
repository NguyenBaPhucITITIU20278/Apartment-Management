import axios from 'axios';
import { API_URLS } from '../config/api';

const commentService = {
    // Fetch all comments for a room
    getCommentsByRoomId: async (roomId) => {
        try {
            const response = await axios.get(`${API_URLS.COMMENTS}/room/${roomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error.response || error);
            throw error;
        }
    },

    // Create a new comment
    createComment: async (roomId, username, content) => {
        try {
            const response = await axios.post(API_URLS.COMMENTS, null, {
                params: {
                    roomId,
                    username,
                    content
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error.response || error);
            throw error;
        }
    }
};

export default commentService; 