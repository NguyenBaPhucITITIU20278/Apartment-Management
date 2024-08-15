import React, { useEffect, useState } from "react";
import { addRoom } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";

const AddRoom = () => {
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [bedroom, setBedroom] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const mutation = useMutationHook((data) => addRoom(data));
  const { isError: isAddError, isSuccess: isAddSuccess } = mutation;

  const handleAddRoom = async (e) => {
    e.preventDefault();
    mutation.mutate({
      name,
      address,
      bedroom,
      phoneNumber,
      price,
      status,
      description,
      image,
    });
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
              <textarea
                placeholder="Description"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                name="cover_letter"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                placeholder="Image"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="file"
                onChange={(e) => setImage(e.target.value)}
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
