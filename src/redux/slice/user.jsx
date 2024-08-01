import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    userName: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: '',
    accessToken: '',
    refreshToken: '',
    role: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {
                firstName = state.firstName,
                lastName = state.lastName,
                studentID = state.studentID,
                phone = state.phone,
                password = state.password,
                confirmPassword = state.confirmPassword,
                email = state.email,
                accessToken = state.accessToken,
                refreshToken = state.refreshToken
            } = action.payload;

            state.firstName = firstName;
            state.lastName = lastName;
            state.studentID = studentID;
            state.phone = phone;
            state.password = password;
            state.confirmPassword = confirmPassword;
            state.email = email;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        resetUser: (state) => {
            Object.assign(state, initialState);
        },
    }
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;