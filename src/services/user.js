import axios from "axios";
// import bcrypt from 'bcrypt';

export const axiosJWT = axios.create();
const API_URL = "http://localhost:8080/api/users";

export const loginUser = async (data) => {
  try {
    const response = await axiosJWT.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Error request:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("Error message:", error.message);
    }
    throw error;
  }
};
export const getUser = async (id, token) => {
  const res = await axiosJWT.get(`${API_URL}/getUser`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }.then((response) => response.json()),
  });
  return res.data;
};
export const registerUser = async (data) => {
  try {
    // Hash the password before sending it to the server
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // const newData = { ...data, password: hashedPassword };

    const res = await axiosJWT.post(`${API_URL}/create`, data);
    return res.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const sendOtp = async (data) => {
  const res = await axiosJWT.post(`${API_URL}/sendOtp`, data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await axiosJWT.post(`${API_URL}/resetPassword`, data);
  return res.data;
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
    throw error;
  }
};

export const getAllUsers = async () => {
  const response = await axiosJWT.get(`${API_URL}/all`);
  return response.data;
};
