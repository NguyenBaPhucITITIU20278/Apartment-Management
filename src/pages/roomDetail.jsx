import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getRoomById } from "../services/room.js";
import { useMutationHook } from "../hooks/useMutationHook.jsx";
import Header from "../components/header.jsx";
import userProfile from "../assets/user1.jpg";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ImageCarousel from "./ImageCarousel";

const RoomDetail = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(roomId);
        console.log("Room data:", data);
        setRoom(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch room details");
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!room) {
    return <div>No room details available</div>;
  }

  const images = room.imagePaths || [];
  const address = room.address;
  console.log("Room Address:", address);
  return (
    <div>
      <Header />
      <div className="flex justify-between my-4">
        <div className="flex-3 mr-4">
          <div>
            <ImageCarousel images={images} address={address} />
          </div>
          <h2 className="text-red-500 font-bold mt-4">
            {room.title}
          </h2>
          <p className="text-green-500 font-bold">
            {room.price} VND/month
          </p>
          <p>
            <span className="font-bold">Address:</span> {room.address}
          </p>
          <p>
            <span className="font-bold">Area:</span> {room.area} m²
          </p>
          <p>
            <span className="font-bold">Posted Time:</span> {room.postedTime}
          </p>
          <p>
            <span className="font-bold">Id:</span> {room.id}
          </p>
          <div>
            <h3 className="font-bold">Description</h3>
            <p>{room.description}</p>
          </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-lg text-center shadow-md">
          <img
            src={userProfile}
            alt="room"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h3 className="mb-2">{room.name}</h3>
          <p className="mb-4 font-bold">{room.phoneNumber}</p>
          <a href={`tel:${room.phoneNumber}`}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer mt-2 mb-2 w-full">
              Phone
            </button>
          </a>
        </div>
      </div>
    </div>
  );    
};

export default RoomDetail;