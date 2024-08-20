import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  findUser,
  deleteUser as deleteUserService,
  updateUser,
} from "../services/admin";

import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";

const AdminPage = () => {
  const [name, setName] = useState("");
  const [foundUser, setFoundUser] = useState("");
  const navigate = useNavigate();

  const mutation = useMutationHook((data) => findUser(name));

  const handleSearch = () => {
    mutation.mutate({ name: name });
    if (mutation.isSuccess) {
      setFoundUser(mutation.data);
      setTimeout(() => {
        message.success("User found successfully");
      }, 500); 
    } else {
      setTimeout(() => {
        message.error("User not found");
      }, 500); 
    }
  };
  useEffect(() => {
    if (mutation.isSuccess) {
      setFoundUser(mutation.data);
    }
  }, [mutation.data, mutation.isSuccess]);

  const handleDeleteUser = () => {
    deleteUserService(foundUser.userName);
    if (mutation.isSuccess) {
      setFoundUser("");
      setName("");
      message.success("User deleted successfully");
      navigate(0);
    }
  };

  const handleUpdateUser = () => {
    updateUser(foundUser);
    if (mutation.isSuccess) {
      setFoundUser("");
      setName("");
      message.success("User updated successfully");
    } else {
      message.error("User not updated");
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search by username"
            className="border p-2 w-full"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Find User
        </button>
        {foundUser && (
          <div className="mt-6 p-4 border rounded-lg shadow-lg">
            <div className="flex">
              <div className="w-1/3 bg-gray-200 rounded-lg p-4">
                {/* Placeholder for user image */}
              </div>
              <div className="w-2/3 pl-4">
                <h2 className="text-xl font-bold mb-2">User Details</h2>
                <p className="mb-1">
                  <strong>ID:</strong> {foundUser.id}
                </p>
                <input 
                  placeholder="User Name"
                  type="text"
                  value={foundUser.userName}
                  onChange={(e) =>
                    setFoundUser({ ...foundUser, userName: e.target.value })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  placeholder="First Name"
                  type="text"
                  value={foundUser.firstName}
                  onChange={(e) =>
                    setFoundUser({ ...foundUser, firstName: e.target.value })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  placeholder="Last Name"
                  type="text"
                  value={foundUser.lastName}
                  onChange={(e) =>
                    setFoundUser({ ...foundUser, lastName: e.target.value })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={foundUser.email}
                  onChange={(e) =>
                    setFoundUser({ ...foundUser, email: e.target.value })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  type="text"
                  value={foundUser.phone}
                  onChange={(e) =>
                    setFoundUser({ ...foundUser, phone: e.target.value })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  type="text"
                  value={foundUser.role}
                  onChange={(e) =>
                    setFoundUser({ ...foundUser, role: e.target.value })
                  }
                  className="border p-2 w-full mb-1"
                />
              </div>
            </div>
            <div className="flex mt-4 justify-center space-x-4  ">
              <button
                className="cursor-pointer transition-all bg-blue-500 text-white px-8 py-4 rounded-lg
  border-blue-600
  border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
  active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
              <button
                className="cursor-pointer transition-all bg-blue-500 text-white px-8 py-4 rounded-lg
  border-blue-600
                border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                onClick={handleUpdateUser}
              >
                Update User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
