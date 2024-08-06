const API_URL = 'http://localhost:8080/api/rooms';

export const getAllRooms = async () => {
    try {
        const response = await fetch(`${API_URL}/all-rooms`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};