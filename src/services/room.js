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
  console.log(id);
  try {
    const response = await axios.get(`${API_URL}/room-by-id/${id}`);
    console.log(id);
    return response.data;
  } catch (error) {

    console.error("Error getting room by id:", error);
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

export const addRoomWithModel = async ({ data, files, model }) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  
  if (files.length === 0) {
    console.error("No files selected"); // Log if no files are selected
  }

  files.forEach((file, index) => {
    formData.append("files", file); // Ensure 'files' is used as the key
  });

  formData.append("model", model);

  try {
    const response = await axios.post(`${API_URL}/add-room-with-model`, formData, {
      headers: {
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


