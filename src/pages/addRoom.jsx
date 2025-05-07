import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRoomWithModel } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";
import Cookies from 'js-cookie';

const AddRoom = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(0);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [images, setImages] = useState([]);
  const [model, setModel] = useState(null);
  const [web360, setWeb360] = useState([]);
  const [video, setVideo] = useState(null);
  const [username, setUsername] = useState("");

  const mutation = useMutationHook((data) => addRoomWithModel(data));
  const { isError: isAddError, isSuccess: isAddSuccess } = mutation;

  useEffect(() => {
    const token = Cookies.get('Authorization');
    if (!token) {
      message.error("Please log in to add a room.");
      navigate("/login");
    }
  }, [navigate]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      message.error("Please select at least one image for the image section.");
      return;
    }

    const roomData = {
      name,
      price: parseFloat(price),
      status,
      numberOfBedrooms: parseInt(numberOfBedrooms),
      description,
      phoneNumber,
      address,
      area: parseFloat(area),
      username: Cookies.get('userName') || ""
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(roomData));

    images.forEach((file) => {
      formData.append("files", file);
    });

    if (model) {
      formData.append("model", model);
    }

    web360.forEach((file) => {
      formData.append("web360", file);
    });

    if (video) {
      formData.append("video", video);
    }

    try {
      await addRoomWithModel(formData);
      message.success("Room added successfully");
      navigate("/");
    } catch (error) {
      console.error("Error adding room:", error);
      message.error("Error adding room: " + (error?.response?.data?.message || error.message));
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  const handleWeb360Change = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setWeb360(selectedFiles);
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    setVideo(selectedFile);
  };

  useEffect(() => {
    if (isAddSuccess) {
      message.success("Room added successfully");
    }
    if (isAddError) {
      message.error("Please sign in to add room");
    }
  }, [isAddSuccess, isAddError]);

  return (
    <div className="container mx-auto p-4 lg:p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Post Rental Listing</h1>

      <form onSubmit={handleAddRoom} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Room Name <span className="text-red-500">(*)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Rental Price <span className="text-red-500">(*)</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status <span className="text-red-500">(*)</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Number of Bedrooms <span className="text-red-500">(*)</span>
              </label>
              <input
                type="number"
                value={numberOfBedrooms}
                onChange={(e) => setNumberOfBedrooms(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Area (m²) <span className="text-red-500">(*)</span>
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number <span className="text-red-500">(*)</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address <span className="text-red-500">(*)</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description <span className="text-red-500">(*)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Images and Media</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Images <span className="text-red-500">(*)</span>
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                3D Model
              </label>
              <input
                type="file"
                onChange={(e) => setModel(e.target.files[0])}
                accept=".glb,.gltf"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                360° Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleWeb360Change}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Video
              </label>
              <input
                type="file"
                onChange={handleVideoChange}
                accept="video/*"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-6 rounded-md hover:from-red-600 hover:to-orange-600 transition ease-in-out duration-150"
            type="submit"
          >
            Post Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;