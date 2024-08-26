import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getRoomById } from "../services/room.js";
import { useMutationHook } from "../hooks/useMutationHook.jsx";
import Header from "../components/header.jsx";
import userProfile from "../assets/user1.jpg";

const RoomDetail = () => {
  const { roomId } = useParams();
  const parsedRoomId = parseInt(roomId, 10); // Parse roomId as an integer
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mutation = useMutationHook((data) => getRoomById(data));
  const { data, isError, isSuccess } = mutation;

  useEffect(() => {
    mutation.mutate(parsedRoomId); // Use parsedRoomId
  }, [parsedRoomId]);

  useEffect(() => {
    if (isSuccess) {
      setRoom(data);
      setLoading(false);
    } else if (isError) {
      setError("Failed to fetch room details");
      setLoading(false);
    }
  }, [isSuccess, isError, data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!room) {
    return <div>No room details available</div>;
  }

  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "16px 0",
        }}
      >
        <div style={{ flex: 3, marginRight: "16px" }}>
          <div>
            <img
              src={`http://localhost:8080/images/room/${room.imagePath}`}
              alt="Room"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <h2 style={{ color: "red", fontWeight: "bold", marginTop: "16px" }}>
            {room.title}
          </h2>
          <p style={{ color: "green", fontWeight: "bold" }}>
            {room.price} million VND/month
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Address:</span> {room.address}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Area:</span> {room.area} m²
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Posted Time:</span>{room.postedTime}{" "}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Id:</span> {room.id}
          </p>
          <div>
            <h3 style={{ fontWeight: "bold" }}>Description</h3>
            <p>{room.description}</p>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={userProfile}
            alt="room"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              margin: "0 auto 16px",
              display: "block",
            }}
          />
          <h3 style={{ marginBottom: "8px" }}>{room.name}</h3>
          <p style={{ marginBottom: "16px", fontWeight: "bold" }}>{room.phoneNumber}</p>
          <a href={`tel:${room.phoneNumber}`}>
            <button
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              Phone
            </button>
          </a>
        </div>
      </div>
    </div>
  );    
};

export default RoomDetail;