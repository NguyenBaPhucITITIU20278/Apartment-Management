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
    const headers = getHeaders();
    const response = await axios.get(`${API_URL}/all-rooms`, { headers });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    console.error("Error details:", error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 403) {
      console.error("Access denied. Please check your access token and permissions.");
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

    const headers = getHeaders(); // Get headers including Authorization

    const response = await axios.post(`${API_URL}/rooms-by-address`, data, { headers });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    console.error("Error details:", error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 403) {
      console.error("Access denied. Please check your access token and permissions.");
    }
    throw error;
  }
};

export const addRoom = async (room) => {
  console.log("Room being sent:", room); // Log the room data
  try {
    const headers = getHeaders();

    const response = await axios.post(`${API_URL}/add-room`, room, { headers });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error adding room:", error);
    console.error("Error details:", error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 403) {
      console.error("Access denied. Please check your access token and permissions.");
    }
    throw error;
  }
};