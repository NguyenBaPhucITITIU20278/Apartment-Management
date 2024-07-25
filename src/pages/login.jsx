import React from "react";
import { loginUser } from "../services/user";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useMutationHook } from "../hooks/useMutationHook";
import { loginUser } from "../services/user";

const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    // const [isLoading, setIsLoading] = useState(false)
    // const [isSuccess, setIsSuccess] = useState(false)
    // const [isError, setIsError] = useState(false)

    const mutation = useMutationHook(
        data => loginUser(data)
    )
    const { data, isLoading, isError, isSuccess } = mutation

    const handleSignIn = () => {   
        // setIsLoading(true)
        mutation.mutate({
            username,
            password,
        })
        // setIsLoading(false)
    }
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="relative ">
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
                <div id="form-container" className="bg-white p-16 rounded-lg shadow-2xl w-full h-full relative z-10 transform transition duration-500 ease-in-out">
                    <h2 id="form-title" className="text-center text-3xl font-bold mb-10 text-gray-800">Welcome to Rent Room</h2>
                    <form className="space-y-5">
                        <input className="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Email" type="text" />
                        <input className="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Password" type="password" />
                        <button onClick={handleSignIn} className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign in</button>
                        <a className="text-blue-500 hover:text-blue-800 text-sm" href="#">Forgot Password?</a>
                        <p className="text-blue-500 hover:text-blue-800 text-sm">
                            Don't have an account?{" "}
                            <a className="font-bold text-slate-700" href="/register">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;