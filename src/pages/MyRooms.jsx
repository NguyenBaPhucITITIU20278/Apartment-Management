import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getMyRooms } from "../services/room";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('Authorization');
    const userName = Cookies.get('userName');
    
    if (!token || !userName) {
      toast.error('Please login to view your rooms');
      navigate("/login");
      return;
    }

    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMyRooms();
        setRooms(response);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.response?.data?.message || 'Failed to fetch rooms');
        toast.error(error.response?.data?.message || 'Failed to fetch your rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [navigate]);

  const handleRoomClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading your apartments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Apartments</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Apartments</h1>
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No apartments available</p>
      )}
    </div>
  );
};

export default MyRooms;
