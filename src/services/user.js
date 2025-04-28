import axios from "axios";
// import bcrypt from 'bcrypt';
import API_URLS from "../config/api";

export const axiosJWT = axios.create();
const API_URL = API_URLS.USERS;

export const loginUser = async (data) => {
  try {
    const response = await axiosJWT.post(`