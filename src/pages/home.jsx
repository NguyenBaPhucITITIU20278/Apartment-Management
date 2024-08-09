import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getAllRooms, getRoomByAddressAndBedroom, addRoom } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [bedroom, setBedroom] = useState(0);
  const [id, setId] = useState(""); // Thêm state cho id

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

  const searchMutation = useMutationHook(
    data => getRoomByAddressAndBedroom(data));
  const addRoomMutation = useMutationHook(addRoom);
  const { data: searchData, isError: isSearchError, isSuccess: isSearchSuccess } = searchMutation;
  const { isError: isAddError, isSuccess: isAddSuccess } = addRoomMutation;

  const handleSearch = (event) => {
    event.preventDefault();
    const parsedBedroom = parseInt(bedroom, 10);
    if (isNaN(parsedBedroom)) {
      console.error('Invalid number of bedrooms:', bedroom);
      setError('Invalid number of bedrooms');
      return;
    }
    console.log({ address, bedroom: parsedBedroom });
    searchMutation.mutate({ address, bedroom: parsedBedroom });
    if (isSearchSuccess) {
      setRooms(searchData); // Cập nhật rooms khi tìm kiếm thành công
    }
  };

  const handleAddRoom = () => {
    const parsedBedroom = parseInt(bedroom, 10);
    console.log("dfsfs");
    if (isNaN(parsedBedroom)) {
      console.error('Invalid number of bedrooms:', bedroom);
      setError('Invalid number of bedrooms');
      return;
    }
    addRoomMutation.mutate({ id, address, bedroom: parsedBedroom }); // Thêm id vào payload
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
          placeholder="Room ID"
          className="p-2 border border-gray-300 rounded-md flex-1"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
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
          type="number"
          placeholder="Number of bedrooms"
          className="p-2 border border-gray-300 rounded-md flex-1"
          value={bedroom}
          onChange={(e) => setBedroom(e.target.value)}
        />
        <button
          type="button"
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          type="button"
          className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={handleAddRoom}
        >
          Add Room
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