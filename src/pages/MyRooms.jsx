import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getMyRooms } from "../services/room";
import { useNavigate } from "react-router-dom";

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const data = await getMyRooms();
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMyRooms();
  }, []);

  const handleRoomClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Apartments</h1>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : rooms.length > 0 ? (
        rooms.map((room) => (
          <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
        ))
      ) : (
        <p>No rooms available</p>
      )}
    </div>
  );
};

export default MyRooms;
