import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    isAuthenticated: Boolean(Cookies.get('Authorization')),
    role: Cookies.get('role') || null, 
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log('Login action received:', action.payload);
            state.isAuthenticated = true;
            state.role = action.payload.role;
        },
        logout: (state) => {
            console.log('Logout action received');
            // Clear all auth cookies
            Cookies.remove('Authorization');
            Cookies.remove('refresh_token');
            Cookies.remove('userName');
            Cookies.remove('role');
            
            state.isAuthenticated = false;
            state.role = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;