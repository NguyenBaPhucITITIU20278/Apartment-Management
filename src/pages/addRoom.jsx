import React, { useEffect, useState } from "react";
import { addRoomWithModel } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";


const AddRoom = () => {
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [numberOfBedrooms, setBedroom] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [model, setModel] = useState(null);
  const [web360, setWeb360] = useState([]);
  const [area, setArea] = useState("");

  const mutation = useMutationHook((data) => addRoomWithModel(data));
  const { isError: isAddError, isSuccess: isAddSuccess } = mutation;

  const handleAddRoom = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      message.error("Please select at least one image.");
      return;
    }

    const roomData = {
      name,
      address,
      numberOfBedrooms,
      phoneNumber,
      price,
      status,
      description,
      area,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(roomData));

    console.log("Images:", images);
    images.forEach((file) => {
      formData.append("files", file);
    });

    if (model) {
      console.log("Model:", model);
      formData.append("model", model);
    }

    console.log("Web360:", web360);
    web360.forEach((file) => {
      formData.append("web360", file);
    });

    try {
      await addRoomWithModel(formData);
      message.success("Room added successfully");
    } catch (error) {
      console.error("Error adding room:", error);
      message.error("Error adding room: " + error.message);
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Selected files:", selectedFiles);
    setImages(selectedFiles);
  };

  const handleWeb360Change = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Selected 360 images:", selectedFiles);
    setWeb360(selectedFiles);
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Find your perfect home with us
      </h1>
      <p className="text-gray-500 ">
        Search for your dream home and book it now!
      </p>
      <form onSubmit={handleAddRoom}>
        <div className="flex flex-col items-center justify-center h-screen dark">
          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4 flex justify-center">
              Detail Room{" "}
            </h2>
            <div className="flex flex-col">
              <input
                placeholder="Name"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Address"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                placeholder="Number of Bedroom"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="number"
                onChange={(e) => setBedroom(e.target.value)}
              />
              <input
                placeholder="Phone Number"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <input
                placeholder="Price"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                placeholder="Status"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => setStatus(e.target.value)}
              />
              <input
                placeholder="Area (in sqm)"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="text"
                onChange={(e) => setArea(e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                name="cover_letter"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                placeholder="Images"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <input
                placeholder="3D Model"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="file"
                onChange={(e) => setModel(e.target.files[0])}
              />
              <input
                placeholder="360Image"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="file"
                multiple
                onChange={handleWeb360Change}
              />
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;