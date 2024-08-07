import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getAllRooms, getRoomByAddress } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";

const Home = () => {
  const [room, setRoom] = useState([]);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms();
        if (Array.isArray(data)) {
          setRoom(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRooms();
  }, []);
  
  const mutation = useMutationHook((data) => getRoomByAddress(data));
  const { data, isError, isSuccess } = mutation;
  
  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const roomData = await getRoomByAddress(address);
      setRoom([roomData]); // Assuming the API returns a single room object
      message.success("Room found");
    } catch (error) {
      setError(error.message);
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
          placeholder="2 adults · 0 children · 1 room"
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
      ) : Array.isArray(room) ? (
        room.map((room) => <RoomCard key={room.id} room={room} />)
      ) : (
        <p>No rooms available</p>
      )}
    </div>
  );
};

export default Home;