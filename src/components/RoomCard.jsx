import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAddress } from '../utils/addressFormatter';

const RoomCard = ({ room, onClick }) => {
  const navigate = useNavigate();

  const handleRoomClick = () => {
    navigate(`/room-detail/${room.id}`);
  };

  // Handle image paths correctly
  const getFirstImage = () => {
    if (!room.imagePaths || !Array.isArray(room.imagePaths) || room.imagePaths.length === 0) {
      console.log("No image paths found for room:", room.id);
      return null;
    }
    
    // Extract just the filename from the path
    const firstImage = room.imagePaths[0].split('/').pop();
    console.log("First image filename:", firstImage);
    return firstImage;
  };

  const firstImage = getFirstImage();
  const formattedAddress = room.address ? formatAddress(room.address) : "default_address";
  const imageUrl = firstImage 
    ? `http://localhost:8080/images/${formattedAddress}/images/${firstImage}`
    : null;

  console.log("Room data:", {
    id: room.id,
    address: room.address,
    formattedAddress,
    imagePaths: room.imagePaths,
    firstImage,
    imageUrl
  });

  return (
    <div
      onClick={handleRoomClick}
      className="flex items-center border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="w-32 h-32 mr-6 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${room.name || 'Room'}`}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.src = "https://via.placeholder.com/128?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-2">
          {room.name || "Unnamed Room"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-700">
            <span className="font-semibold">Price:</span> ${room.price || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Bedrooms:</span> {room.numberOfBedrooms || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Address:</span> {room.address || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Phone:</span> {room.phoneNumber || 'N/A'}
          </p>
        </div>
        {room.description && (
          <p className="text-gray-600 mt-2">
            <span className="font-semibold">Description:</span> {room.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
