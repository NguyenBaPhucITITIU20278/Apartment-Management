import axios from "axios";
import API_URLS from "../config/api";
import Cookies from 'js-cookie';

const API_URL = API_URLS.ROOMS;

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

export const getAllRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-rooms`);

    console.log("Response received:", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.status === 403) {
      console.error(
        "Access denied. Please check your access token and permissions."
      );
    }
    throw error;
  }
};

export const getRoomByAddress = async (data) => {
  console.log("Payload being sent:", data);

  try {
    if (!data) {
      throw new Error("Data is missing or undefined");
    }
    console.log("Data being sent:", data);

    const headers = getHeaders();
    const response = await axios.post(`${API_URL}/rooms-by-address`, data, { headers });

    console.log("Response received:", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.status === 403) {
      console.error(
        "Access denied. Please check your access token and permissions."
      );
    }
    throw error;
  }
};

export const addRoom = async ({ data, file }) => {
  console.log(file);
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  formData.append("file", file);

  try {
    const headers = getHeaders();
    const response = await axios.post(`${API_URL}/add-room`, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error adding room:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.status === 403) {
      console.error(
        "Access denied. Please check your access token and permissions."
      );
    }
    throw error;
  }
};

export const getRoomById = async (id) => {
  try {
    const headers = getHeaders(); // Đảm bảo headers được bao gồm
    const response = await axios.get(`${API_URL}/room-by-id/${id}`, { headers });
    console.log("Response received:", response); // Log phản hồi
    return response.data;
  } catch (error) {
    console.error("Error getting room by id:", error);
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.status === 403) {
      console.error(
        "Access denied. Please check your access token and permissions."
      );
    }
    throw error;
  }
};

export const searchRooms = async ({ address }) => {
  try {
    const headers = getHeaders();
    const response = await axios.post(`${API_URL}/rooms-by-address`, {
      address
    }, { headers });
    return response.data;
  } catch (error) {
    console.error("Error searching rooms:", error);
    throw error;
  }
};

export const addRoomWithModel = async (formData) => {
  console.log('Starting addRoomWithModel...');
  try {
    const token = Cookies.get('Authorization');
    console.log('Token retrieved:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      throw new Error("Access token is missing");
    }

    // Log the FormData contents for debugging
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].size} bytes)`);
      } else if (pair[0] === 'data') {
        console.log(`${pair[0]}: ${pair[1].substring(0, 100)}...`); // Log first 100 chars of data
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    console.log('Making API request to:', `${API_URL}/add-room-with-model`);
    const response = await axios.post(`${API_URL}/add-room-with-model`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("API Response status:", response.status);
    console.log("API Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in addRoomWithModel:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Server response status:", error.response.status);
      console.error("Server response data:", error.response.data);
      console.error("Server response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received. Request:", error.request);
    }
    throw error;
  }
};

export const deleteRoomImage = async (roomId, imageName) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const response = await axios.delete(`${API_URL}/delete-room-image/${roomId}/${imageName}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting room image:", error);
    throw error;
  }
};

export const deleteRoomModel = async (roomId) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const response = await axios.delete(`${API_URL}/delete-room-model/${roomId}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting room model:", error);
    throw error;
  }
};

export const deleteRoomWeb360 = async (roomId, web360Name) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const response = await axios.delete(`${API_URL}/delete-room-web360/${roomId}/${web360Name}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error deleting room web360:", error);
    throw error;
  }
};

export const deleteEntireRoom = async (roomId) => {
  try {
    const token = Cookies.get('Authorization');
    if (!token) {
      throw new Error("Access token is missing");
    }

    const response = await axios.delete(`${API_URL}/delete-room/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting entire room:", error);
    throw error;
  }
};

export const updateRoomImages = async (roomId, images) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const formData = new FormData();
    
    // Append each file to the FormData with the correct key
    images.forEach((image) => {
      formData.append('files', image); // Use 'files' as the key
    });

    console.log("Updating room images with:", formData);
    const response = await axios.post(`${API_URL}/update-room-images/${roomId}`, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response received for updating images:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating room images:", error);
    throw error;
  }
};

export const updateRoomModel = async (roomId, model) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const formData = new FormData();
    formData.append("model", model);
    console.log("Updating room model with:", formData);
    const response = await axios.post(`${API_URL}/update-room-model/${roomId}`, formData, { headers });
    console.log("Response received for updating model:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating room model:", error);
    throw error;
  }
};

export const updateRoomWeb360 = async (roomId, web360Files) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const formData = new FormData();
    web360Files.forEach((file, index) => {
      formData.append(`web360[${index}]`, file);
    });
    console.log("Updating room web360 with:", formData);
    const response = await axios.post(`${API_URL}/update-room-web360/${roomId}`, formData, { headers });
    console.log("Response received for updating web360:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating room web360:", error);
    throw error;
  }
};

export const updateRoomDetails = async (roomId, roomData) => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    console.log("Updating room details with roomId:", roomId);
    console.log("Room data being sent:", roomData);
    console.log("Headers being used:", headers);
    const response = await axios.post(`${API_URL}/update-room/${roomId}`, roomData, { headers });
    console.log("Response received for updating room details:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating room details:", error);
    throw error;
  }
};

export const getMyRooms = async () => {
  try {
    const headers = getHeaders(); // Ensure headers include Authorization
    const response = await axios.get(`${API_URL}/my-rooms`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching my rooms:", error);
    throw error;
  }
};

export const updateRoomVideo = async (roomId, videoFile) => {
  try {
    const headers = getHeaders();
    const formData = new FormData();
    formData.append('video', videoFile);

    const response = await axios.post(`${API_URL}/${roomId}/video`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating room video:', error);
    throw error;
  }
};

export const deleteRoomVideo = async (roomId) => {
  try {
    const headers = getHeaders();
    const response = await axios.delete(`${API_URL}/${roomId}/video`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error deleting room video:', error);
    throw error;
  }
};