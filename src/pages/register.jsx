import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/user";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";
import Header from "../components/header.jsx";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const mutation = useMutationHook((data) => registerUser(data));
  const { data, isError, isSuccess, error } = mutation;

  const handleRegister = useCallback(
    (event) => {
      event.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        message.error("Passwords do not match. Please try again.");
        return;
      }
      mutation.mutate({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        contact: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
        role: {
          roleName: "user",
        },
      });
    },
    [formData, mutation]
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
      message.success("Register successful");
    }
    if (isError) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "User already exists") {
          message.error("The user already exists. Please use another email.");
        } else {
          message.error("An error occurred. Please try again.");
        }
      } else {
        message.error("An error occurred. Please try again.");
      }
    }
  }, [isSuccess, isError, error, navigate]);

  return (
    <div>
      <Header />
      <div className="w-full h-full bg-amber-100 flex justify-center items-center">
        <div className="w-full max-w-md px-3 mx-auto mt-0 md:flex-0 shrink-0">
          <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-4 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
              <h1 className="text-2xl font-bold">Register</h1>
            </div>
            <div className="flex-auto p-4">
              <form role="form text-left" onSubmit={handleRegister}>
                <div className="mb-3">
                  <input
                    aria-label="Name"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <input
                    aria-label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="email"
                  />
                </div>
                <div className="mb-3">
                  <input
                    aria-label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <input
                    aria-label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <input
                    aria-label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="text"
                  />
                </div>
                <div className="mb-3">
                  <input
                    aria-label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="password"
                  />
                </div>
                <div className="mb-3">
                  <input
                    aria-label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                    type="password"
                  />
                </div>
                <div className="min-h-6 pl-7 mb-0.5 block">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer appearance-none border border-solid border-slate-200 bg-white"
                    id="terms"
                  />
                  <label
                    htmlFor="terms"
                    className="mb-2 ml-1 font-normal cursor-pointer select-none text-sm text-slate-700"
                  >
                    {" "}
                    I agree to the{" "}
                    <a className="font-bold text-slate-700">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <div className="text-center">
                  <button
                    className="inline-block w-full px-6 py-3 mt-4 mb-2 font-bold text-center text-white uppercase transition-all bg-gradient-to-tl from-gray-900 to-slate-800 rounded-lg cursor-pointer"
                    type="submit"
                  >
                    Sign up
                  </button>
                </div>
                <p className="mt-4 mb-0 text-sm">
                  Already have an account?{" "}
                  <a className="font-bold text-slate-700" href="/login">
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
