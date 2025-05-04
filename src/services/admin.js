import axios from "axios";
import API_URLS from "../config/api";

export const axiosJWT = axios.create();
const API_URL = API_URLS.ADMIN;

export const findUser = async (name) => {
  try {
    const accessToken = localStorage.getItem("admin_token");
    if (!accessToken) {
      throw new Error("Missing admin access token");
    }
    const userName = localStorage.getItem("admin_username");
    const userData = {
      userName: name,
      accessToken: accessToken,
    };
    const response = await axiosJWT.post(`${API_URL}/find-user`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        username: `${userName}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const loginAdmin = async (data) => {
  try {
    const response = await axiosJWT.post(`${API_URL}/loginAdmin`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const deleteUser = async (userName) => {
  try {
    const accessToken = localStorage.getItem("admin_token");
    if (!accessToken) {
      throw new Error("Missing admin access token");
    }
    const response = await axiosJWT.delete(`${API_URL}/delete-user/${userName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const accessToken = localStorage.getItem("admin_token");
    if (!accessToken) {
      throw new Error("Missing admin access token");
    }
    const response = await axiosJWT.post(`${API_URL}/updateUser`, user, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
