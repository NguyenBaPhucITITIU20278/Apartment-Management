import React from "react";
import { loginUser } from "../services/user";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutationHook } from "../hooks/useMutationHook.jsx";
import { useEffect } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slice/user.jsx";
import { login } from "../redux/slice/Authslice.jsx";
import { getUser } from "../services/user.js";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const mutation = useMutationHook(
        data => loginUser(data)
    );
    const { data, isError, isSuccess } = mutation;
    const handleIdChange = (e) => {
        setId(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleSignIn = (event) => {
        event.preventDefault(); 
        mutation.mutate({
            id,
            password,
        });
    };
    const dispatch = useDispatch();
    const handleGetDetailUser = async (id,access, refresh) => {
        dispatch(login({ role: "user" }));
        const res = await getUser(id, access);
        dispatch(updateUser({ ...res?.data, accessToken: access, refreshToken: refresh }));
    };
    useEffect(() => {
        if (isSuccess) {
            navigate('/');
            message.success("Login successful");
            // Kiểm tra dữ liệu trước khi sử dụng
            if (data && data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('role', 'user');
                localStorage.setItem('id', id);
                const decode = jwtDecode(data.accessToken);
                if (decode && decode.id) {
                    handleGetDetailUser(decode.id, data.accessToken, data.refreshToken);
                    console.log(decode.id);
                    localStorage.setItem('id', decode.id); 
                }
            } else {
                message.error("Invalid response from server");
            }
        }
        if (isError) {
            message.error("Login failed");
        }
    }, [data, isSuccess, isError]);
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="relative ">
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
                <div id="form-container" className="bg-white p-16 rounded-lg shadow-2xl w-full h-full relative z-10 transform transition duration-500 ease-in-out">
                    <h2 id="form-title" className="text-center text-3xl font-bold mb-10 text-gray-800">Welcome to Rent Room</h2>
                    <form className="space-y-5" onSubmit={handleSignIn}>
                        <input
                            className="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="ID" type="text" onChange={handleIdChange} />
                        <input
                            className="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Password" type="password" onChange={handlePasswordChange} />
                        <button type="submit" className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign in</button>
                        <a className="text-blue-500 hover:text-blue-800 text-sm" href="#">Forgot Password?</a>
                        <p className="text-blue-500 hover:text-blue-800 text-sm">
                            Don't have an account?{" "}
                            <a className="font-bold text-slate-700" href="/register">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;