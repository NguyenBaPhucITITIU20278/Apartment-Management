import React, { useState, useEffect } from "react";
import { message } from "antd";
import { updateUser, checkUser } from "../services/user";

const UpdateProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const userName = localStorage.getItem("userName");
  const [foundUser, setFoundUser] = useState({
    userName: "",
    email: "",
    password: "",
    contact: {
      id: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
    role: {
      id: "",
      roleName: "",
    },
  });
  const [mutation, setMutation] = useState({ isSuccess: false });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await checkUser(userName);
        console.log(user);
        setFoundUser({
          userName: user.userName,
          email: user.email,
          password: user.password,
          contact: {
            id: user.contact.id,
            firstName: user.contact.firstName,
            lastName: user.contact.lastName,
            phone: user.contact.phone,
          },
          role: {
            id: user.role.id,
            roleName: user.role.roleName,
          },
        });
      } catch (error) {
        message.error("User not found");
      }
    };
    fetchUser();
  }, [userName]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdateUser = () => {
    updateUser({
      userName: foundUser.userName,
      email: foundUser.email,
      password: foundUser.password,
      contact: {
        id: foundUser.contact.id,
        firstName: foundUser.contact.firstName,
        lastName: foundUser.contact.lastName,
        phone: foundUser.contact.phone,
      },
      role: {
        id: foundUser.role.id,
        roleName: foundUser.role.roleName,
      },
    })
      .then((response) => {
        setMutation({ isSuccess: true });
        setFoundUser({
          ...foundUser,
          userName: foundUser.userName,
          email: foundUser.email,
          password: foundUser.password,
          contact: {
            id: foundUser.contact.id,
            firstName: foundUser.contact.firstName,
            lastName: foundUser.contact.lastName,
            phone: foundUser.contact.phone,
          },
          role: {
            id: foundUser.role.id,
            roleName: foundUser.role.roleName,
          },
        });
        message.success("User updated successfully");
      })
      .catch((error) => {
        setMutation({ isSuccess: false });
        message.error("User not updated");
      });
  };

  const handleDeleteUser = () => {
    // Logic for deleting user
  };

  return (
    <div>
      <h1>Update User</h1>
      {foundUser && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg">
          <div className="flex">
            <div className="w-1/3 bg-gray-200 rounded-lg p-4">
              {/* Placeholder for user image */}
            </div>
            <div className="w-2/3 pl-4">
              <h2 className="text-xl font-bold mb-2">User Details</h2>
              <p className="mb-1">
                <strong>Contact ID:</strong> {foundUser.contact.id}
              </p>
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
                    contact: { ...foundUser.contact, lastName: e.target.value },
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
            </div>
          </div>
          <div className="flex mt-4 justify-center space-x-4">
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
  );
};

export default UpdateProfile;
