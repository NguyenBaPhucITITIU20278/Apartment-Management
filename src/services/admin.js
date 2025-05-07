import axios from "axios";
import API_URLS from "../config/api";
import Cookies from 'js-cookie';

export const axiosJWT = axios.create();
const API_URL = API_URLS.ADMIN;

const getAdminHeaders = () => {
  const token = Cookies.get('Authorization');
  const userName = Cookies.get('userName');
  const role = Cookies.get('role');

  if (!token) {
    throw new Error("Access token is missing");
  }
  if (role !== 'admin') {
    throw new Error("Admin access required");
  }

  return {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
    userName: userName,
  };
};

export const findUser = async (name) => {
  try {
    const headers = getAdminHeaders();
    const userData = {
      userName: name,
    };
    
    const response = await axiosJWT.post(`${API_URL}/find-user`, userData, {
      headers: headers
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
    
    if (response.data) {
      // Save admin data in cookies
      Cookies.set('Authorization', response.data.accessToken, { expires: 7 });
      Cookies.set('refresh_token', response.data.refreshToken, { expires: 7 });
      Cookies.set('userName', response.data.userName, { expires: 7 });
      Cookies.set('role', 'admin', { expires: 7 });
    }
    
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
    const headers = getAdminHeaders();
    const response = await axiosJWT.delete(`${API_URL}/delete-user/${userName}`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const headers = getAdminHeaders();
    const response = await axiosJWT.post(`${API_URL}/updateUser`, user, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};