import React from "react";
import { loginUser } from "../services/user.js";
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
import Header from "../components/header.jsx";
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutationHook((data) => loginUser(data));
  const { data, isError, isSuccess } = mutation;
  
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSignIn = (event) => {
    event.preventDefault();
    mutation.mutate({
      userName,
      password,
    });
  };
  const dispatch = useDispatch();
  const handleGetDetailUser = async (id, access, refresh) => {
    const res = await getUser(id, access);
    dispatch(
      updateUser({ ...res?.data, accessToken: access, refreshToken: refresh })
    );
  };
  useEffect(() => {
    if (isSuccess && data) {
      // Kiểm tra dữ liệu trước khi sử dụng
      if (data && data.accessToken) {
        console.log('Login successful, setting auth state...', data);
        
        // Set cookies instead of localStorage
        Cookies.set('Authorization', data.accessToken, { expires: 7 }); // Expires in 7 days
        Cookies.set('refresh_token', data.refreshToken, { expires: 7 });
        Cookies.set('userName', userName, { expires: 7 });
        Cookies.set('role', 'user', { expires: 7 });

        // Dispatch login action first
        dispatch(login({ role: "user" }));

        const decode = jwtDecode(data.accessToken);
        if (decode && decode.userName) {
          handleGetDetailUser(
            decode.userName,
            data.accessToken,
            data.refreshToken
          );
          console.log('User details:', decode.userName);
          Cookies.set('userName', decode.userName, { expires: 7 });
        }

        // Navigate and show success message after everything is set
        message.success("Login successful");
        navigate("/");
      } else {
        message.error("Invalid response from server");
      }
    }
    if (!isSuccess) {
      message.error("Login failed. Please check your username and password or change to admin");
    }
  }, [data, isSuccess, isError]);

  return (
    <div >
      <Header />
      <div className="min-h-screen h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="relative ">
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
          <div
            id="form-container"
            className="bg-white p-16 rounded-lg shadow-2xl w-full h-full relative z-10 transform transition duration-500 ease-in-out"
          >
            <h2
              id="form-title"
              className="text-center text-3xl font-bold mb-10 text-gray-800"
            >
              Welcome to Rent Room
            </h2>
            <form className="space-y-5" onSubmit={handleSignIn}>
              <input
                className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UserName"
                type="text"
                onChange={handleUserNameChange}
              />
              <input
                className="w-full h-12 border border-gray-300 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                type="password"
                onChange={handlePasswordChange}
              />
              <button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign in
              </button>
              <a
                className="text-blue-500 hover:text-blue-800 text-sm"
                href="/resetPassword"
              >
                Forgot Password?
              </a>
              <p className="text-blue-500 hover:text-blue-800 text-sm">
                Don't have an account?{" "}
                <a className="font-bold text-slate-700" href="/register">
                  Sign up
                </a>
              </p>
            </form>
            <p className="text-blue-500 hover:text-blue-800 text-sm">
              {" "}
              <a
                className="font-bold text-slate-700 bg-white px-2 py-1 rounded hover:bg-yellow-300 transition duration-300 ease-in-out"
                href="/loginAdmin"
              >
                Login as admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
