import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleRoomClick = () => {
    navigate(`/room-detail/${room.id}`); // Navigate to room-detail with room.id
  };

  return (
    <div
      onClick={handleRoomClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      {room.imagePath && (
        <img
          src={`http://localhost:8080/images/room/${room.imagePath}`}
          alt="Room"
          style={{ width: "100px", height: "100px", marginRight: "16px" }}
        />
      )}
      <div>
        <h2 className="Name font-bold">
          Name: <span className="font-normal">{room.name}</span>
        </h2>
        <p className="price font-bold">
          Price: <span className="font-normal">{room.price}</span>
        </p>
        <p className="bedrooms font-bold">
          Bedrooms: <span className="font-normal">{room.numberOfBedrooms}</span>
        </p>
        {/* <p className="description font-bold">
          Description: <span className="font-normal">{room.description}</span>
        </p> */}
        <p className="address font-bold">
          Address: <span className="font-normal">{room.address}</span>
        </p>
        <button
          style={{
            backgroundColor: "#FFD700",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Call: {room.phoneNumber}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
