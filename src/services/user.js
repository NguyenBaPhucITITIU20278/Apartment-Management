import axios from 'axios'

export const axiosJWT = axios.create()
const API_URL = 'http://localhost:5000/api/users'       
export const loginUser = async (userData) => {
    const response = await axiosJWT.post(`${API_URL}/login`, userData)
    return response.data
}