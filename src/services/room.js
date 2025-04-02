import axios from "axios";
const API_URL = "http://localhost:8080/api/rooms";

const getHeaders = () => {
  const accessToken = localStorage.getItem("Authorization");
  const userName = localStorage.getItem("userName");
  if (!accessToken) {
    throw new Error("Access token is missing");
  }
  return {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
    userName: userName,
  };
};

export const getAllRooms = async () => {
  try {
    // const headers = getHeaders();
    const response = await axios.get(`${API_URL}/all-rooms`);

    console.log("Response received:", response); // Log the response

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
  console.log("Payload being sent:", data); // Log the payload

  try {
    // Check if data is correctly formed
    if (!data) {
      throw new Error("Data is missing or undefined");
    }
    console.log("Data being sent:", data); // Log the data

    // const headers = getHeaders(); // Get headers including Authorization

    const response = await axios.post(`${API_URL}/rooms-by-address`, data);

    console.log("Response received:", response); // Log the response

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
    const response = await axios.post(`${API_URL}/rooms-by-address`, {
      address
    });
    return response.data;
  } catch (error) {
    console.error("Error searching rooms:", error);
    throw error;
  }
};

export const addRoomWithModel = async (formData) => {
  try {
    const headers = getHeaders();
    const response = await axios.post(`${API_URL}/add-room-with-model`, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding room with model:", error);
    console.error("Error details:", error.response ? error.response.data : error.message);
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
    const headers = getHeaders(); // Ensure headers include Authorization
    const response = await axios.delete(`${API_URL}/delete-room/${roomId}`, { headers });
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


