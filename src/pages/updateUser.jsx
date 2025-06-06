import React, { useState, useEffect } from "react";
import { message } from "antd";
import { updateUser, checkUser } from "../services/user";
import { image } from "@nextui-org/react";
import userProfile from "../assets/user1.jpg";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const userName = Cookies.get('userName');
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
    const token = Cookies.get('Authorization');
    if (!token) {
      message.error("Please log in to update your profile");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await checkUser(userName);
        console.log('Current user data:', user);
        if (!user) {
          message.error("User not found");
          return;
        }
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
        console.error('Error fetching user:', error);
        message.error("Failed to fetch user data");
      }
    };

    if (userName) {
      fetchUser();
    } else {
      message.error("User information not found");
      navigate("/login");
    }
  }, [userName, navigate]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdateUser = async () => {
    const token = Cookies.get('Authorization');
    if (!token) {
      message.error("Please log in to update your profile");
      navigate("/login");
      return;
    }

    try {
      const response = await updateUser({
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

      setMutation({ isSuccess: true });
      message.success("Profile updated successfully");
      
      // Update cookies with new user data if needed
      Cookies.set('userName', response.userName, { expires: 7 });
      Cookies.set('email', response.email, { expires: 7 });
      
      // Refresh user data
      const updatedUser = await checkUser(response.userName);
      setFoundUser({
        userName: updatedUser.userName,
        email: updatedUser.email,
        password: updatedUser.password,
        contact: {
          id: updatedUser.contact.id,
          firstName: updatedUser.contact.firstName,
          lastName: updatedUser.contact.lastName,
          phone: updatedUser.contact.phone,
        },
        role: {
          id: updatedUser.role.id,
          roleName: updatedUser.role.roleName,
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setMutation({ isSuccess: false });
      message.error("Failed to update profile");
    }
  };

  const handleDeleteUser = () => {
    // Logic for deleting user
  };

  return (
    <div>
      {foundUser && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg">
          <div className="flex">
            <div className="w-1/3 bg-gray-200 rounded-lg p-4">
              <img
                src={userProfile}
                alt="Search illustration"
                className="w-full h-auto"
              />
            </div>
            <div className="flex-1 pl-4 ">
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
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
