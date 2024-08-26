import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getRoomById } from "../services/room.js";
import { useMutationHook } from "../hooks/useMutationHook.jsx";
import Header from "../components/header.jsx";


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
          <div
          >
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
            <span style={{ fontWeight: "bold" }}>Area:</span> {room.area}{" "}
            m²
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Posted Time:</span>{room.postedTime}  {" "}
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
          }}
        >
          {/* <div style={{ textAlign: "center" }}>
            <img
              src={`http://localhost:8080/images/room/${room.imagePath}`}
              alt="room"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginBottom: "16px",
              }}
            />
            <h3>{room.ownerName}</h3>
            <p style={{ color: "green" }}>Active</p>
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {room.ownerPhone}
            </button>
            <button
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Chat
            </button>
            <button
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Like
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );    
};

export default RoomDetail;
