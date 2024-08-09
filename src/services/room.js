import axios from "axios";
const API_URL = "http://localhost:8080/api/rooms";

export const getAllRooms = async () => {
  try {
    const accessToken = localStorage.getItem("Authorization");
    const userName = localStorage.getItem("userName");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }
    const response = await axios.get(`${API_URL}/all-rooms`, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        userName: userName,
      },
    });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

export const getRoomByAddressAndBedroom = async (data) => {
  const payload = { data };
  console.log("Payload being sent:", payload); // Log the payload

  try {
    const accessToken = localStorage.getItem("Authorization");
    const userName = localStorage.getItem("userName");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    // Check if payload is correctly formed
    if (!data) {
      throw new Error("Data is missing or undefined");
    }

    const response = await axios.post(`${API_URL}/rooms-by-address`, payload, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        userName: userName,
      },
    });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

export const addRoom = async (room) => {
  console.log("Room being sent:", room); // Log the room data
  try {
    const accessToken = localStorage.getItem("Authorization");
    const userName = localStorage.getItem("userName");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const response = await axios.post(`${API_URL}/add-room`, room, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        userName: userName,
      },
    });

    console.log("Response received:", response); // Log the response

    return response.data;
  } catch (error) {
    console.error("Error adding room:", error);
    throw error;
  }
};