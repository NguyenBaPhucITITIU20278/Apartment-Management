import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getAllUsers } from "../services/user";
import {
  findUser,
  deleteUser as deleteUserService,
  updateUser,
} from "../services/admin";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";
import * as XLSX from "xlsx";

const AdminPage = () => {
  const [name, setName] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const navigate = useNavigate();

  const mutation = useMutationHook((data) => findUser(name));
  const mutationGetAllUsers = useMutationHook(() => getAllUsers());

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

  const handleGetAllUsers = () => {
    mutationGetAllUsers.mutate();
    if (mutationGetAllUsers.isSuccess) {
      setAllUsers(mutationGetAllUsers.data);
    }
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setFoundUser(mutation.data);
    }
    if (mutationGetAllUsers.isSuccess) {
      setAllUsers(mutationGetAllUsers.data);
    }
  }, [
    mutation.data,
    mutation.isSuccess,
    mutationGetAllUsers.data,
    mutationGetAllUsers.isSuccess,
  ]);

  const handleDeleteUser = () => {
    deleteUserService(foundUser.userName);
    if (mutation.isSuccess) {
      setFoundUser(null);
      setName("");
      message.success("User deleted successfully");
      navigate(0);
    }
  };

  const handleUpdateUser = () => {
    updateUser(foundUser);
    if (mutation.isSuccess) {
      setFoundUser(null);
      setName("");
      message.success("User updated successfully");
    } else {
      message.error("User not updated");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //Xử lí dữ liệu để export ra file excel
  const flattenUserData = (users) => {
    return users.map((user) => ({
      userName: user.userName,
      email: user.email,
      phone: user.contact.phone,
      role: user.role.roleName,
      contactId: user.contact.id,
      firstName: user.contact.firstName,
      lastName: user.contact.lastName,
    }));
  };

  const handleExportToExcel = () => {
    const flatData = flattenUserData(allUsers);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
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
        <button
          onClick={handleGetAllUsers}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          Get All Users
        </button>
        <div className="mt-6">
          {currentUsers.map((user) => (
            <div
              key={user.email}
              className="p-4 mb-4 border rounded-lg shadow-lg"
            >
              <p className="font-bold">{user.userName}</p>
              <p>{user.email}</p>
              <p>{user.contact.phone}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(allUsers.length / usersPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 mx-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        {foundUser && (
          <div className="mt-6 p-4 border rounded-lg shadow-lg">
            <div className="flex">
              <div className="w-1/3 bg-gray-200 rounded-lg p-4">
                {/* Placeholder for user image */}
              </div>
              <div className="w-2/3 pl-4">
                <h2 className="text-xl font-bold mb-2">User Details</h2>
                <p className="mb-1">
                  <strong>ID:</strong> {foundUser.contact.id}
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
                  value={foundUser.contact.firstName}
                  onChange={(e) =>
                    setFoundUser({
                      ...foundUser,
                      contact: {
                        ...foundUser.contact,
                        firstName: e.target.value,
                      },
                    })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  placeholder="Last Name"
                  type="text"
                  value={foundUser.contact.lastName}
                  onChange={(e) =>
                    setFoundUser({
                      ...foundUser,
                      contact: {
                        ...foundUser.contact,
                        lastName: e.target.value,
                      },
                    })
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
                  placeholder="Phone"
                  type="text"
                  value={foundUser.contact.phone}
                  onChange={(e) =>
                    setFoundUser({
                      ...foundUser,
                      contact: { ...foundUser.contact, phone: e.target.value },
                    })
                  }
                  className="border p-2 w-full mb-1"
                />
                <input
                  placeholder="Role"
                  type="text"
                  value={foundUser.role.roleName}
                  onChange={(e) =>
                    setFoundUser({
                      ...foundUser,
                      role: { ...foundUser.role, roleName: e.target.value },
                    })
                  }
                  className="border p-2 w-full mb-1"
                />
              </div>
            </div>
            <div className="flex mt-4 justify-center space-x-4">
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
        <div className="flex justify-end mt-4">
          <button
            onClick={handleExportToExcel}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
