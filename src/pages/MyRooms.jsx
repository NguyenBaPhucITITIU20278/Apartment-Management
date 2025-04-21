import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getMyRooms } from "../services/room";
import { useNavigate } from "react-router-dom";

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('Authorization');
        if (!token) {
          alert("Please log in to view your apartments");
          navigate('/');
          return;
        }

        const data = await getMyRooms();
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          alert("Error loading apartments. Please try again.");
          navigate('/');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Please log in to view your apartments");
        } else {
          alert("Error loading apartments. Please try again.");
        }
        navigate('/');
      }
    };

    fetchMyRooms();
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
