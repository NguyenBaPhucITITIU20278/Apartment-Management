import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getAllRooms } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";
import { getRoomByAddress } from '../services/room'; // Import the new service

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRooms();
  }, []);
  
  const handleSearch = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors
    try {
      const roomData = await getRoomByAddress(address);
      if (roomData) {
        setRooms([roomData]); // Assuming the API returns a single room object
        message.success("Room found");
      } else {
        setRooms([]); // Clear rooms if no room is found
        message.error("Room not found");
      }
    } catch (error) {
      setError(error.message);
      setRooms([]); // Clear rooms on error
      message.error("Room not found");
    }
    console.log(address);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Find your perfect home with us
      </h1>
      <p className="text-gray-500 mb-4">
        Search for your dream home and book it now!
      </p>
      <div className="bg-white p-4 border-2 border-yellow-400 rounded-lg mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Where would you like to stay?"
          className="p-2 border border-gray-300 rounded-md flex-1"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="date"
          placeholder="Check-in"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          placeholder="Check-out"
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="number of "
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <button
          type="button"
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : Array.isArray(rooms) && rooms.length > 0 ? (
        rooms.map((room) => <RoomCard key={room.id} room={room} />)
      ) : (
        <p>No rooms available</p>
      )}
    </div>
  );
};

export default Home;