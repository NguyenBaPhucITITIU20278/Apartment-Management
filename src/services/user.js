import axios from "axios";
// import bcrypt from 'bcrypt';
import API_URLS from "../config/api";

export const axiosJWT = axios.create();
const API_URL = API_URLS.USERS;

export const loginUser = async (data) => {
  try {
    const response = await axiosJWT.post(`${API_URL}/login`, data);
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

export const getUser = async (id, token) => {
  try {
    const res = await axiosJWT.get(`${API_URL}/getUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/create`, data);
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const sendOtp = async (data) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/sendOtp`, data);
    return res.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/resetPassword`, data);
    return res.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const checkUser = async (userName) => {
  try {
    const response = await axios.get(`${API_URL}/checkUser`, {
      params: {
        userName,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user:", error);
    throw error;
  }
};

export const updateUser = async (userName) => {
  try {
    const response = await axios.post(`${API_URL}/updateUser`, userName, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosJWT.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};