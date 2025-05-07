import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getMyRooms } from "../services/room";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('Authorization');
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await getMyRooms();
        setRooms(response);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [navigate]);

  const handleRoomClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Apartments</h1>
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
        ))
      ) : (
        <p>No apartments available</p>
      )}
    </div>
  );
};

export default MyRooms;
