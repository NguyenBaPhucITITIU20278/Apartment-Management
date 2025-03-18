import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getRoomById } from "../services/room.js";
import { useMutationHook } from "../hooks/useMutationHook.jsx";
import Header from "../components/header.jsx";
import userProfile from "../assets/user1.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageCarousel from "./ImageCarousel";
import ThreeDViewer from "../components/ThreeDViewer";
import ThreeSixtyImageViewer from "../components/ThreeSixtyImageViewer";
import Draggable from 'react-draggable';
import button360Image from '../assets/360button.png';
import button3DImage from '../assets/3Dbutton.png';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { 
  deleteRoomImage, 
  deleteRoomModel, 
  deleteRoomWeb360, 
  deleteEntireRoom 
} from "../services/room.js";

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [show360Viewer, setShow360Viewer] = useState(false);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [isEditing, setIsEditing] = useState(false);

  const fetchRoomData = async () => {
    try {
      const fetchedRoom = await getRoomById(roomId);
      setRoom(fetchedRoom);
      setLoading(false);

      // Geocode the address to get latitude and longitude
      const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fetchedRoom.address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results.length > 0) {
        const location = geocodeData.results[0].geometry.location;
        setCenter({ lat: location.lat, lng: location.lng });
      }
    } catch (err) {
      setError("Login to see the detail of the apartment");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [roomId]);

  const handleView3D = () => {
    setShow3DViewer(true);
  };

  const handleView360 = () => {
    setShow360Viewer(!show360Viewer);
  };

  const handleDeleteImage = async (imageName) => {
    try {
      await deleteRoomImage(roomId, imageName);
      fetchRoomData();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteModel = async () => {
    try {
      await deleteRoomModel(roomId);
      // Refresh room data
      fetchRoomData();
      setShow3DViewer(false);
    } catch (error) {
      setError("Error deleting 3D model");
    }
  };

  const handleDeleteWeb360 = async (web360Name) => {
    try {
      await deleteRoomWeb360(roomId, web360Name);
      // Refresh room data
      fetchRoomData();
      if (room.web360Paths.length === 0) {
        setShow360Viewer(false);
      }
    } catch (error) {
      setError("Error deleting 360 image");
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      try {
        await deleteEntireRoom(roomId);
        // Điều hướng về trang chủ sau khi xóa thành công
        navigate('/');
      } catch (error) {
        setError("Error deleting room");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!room) {
    return <div>No room details available</div>;
  }
  const address = room.address;
  const images = room.imagePaths || [];
  const formattedAddress = room.address.replace(/\s+/g, "_");
  const modelPath = room.modelPath;
  const modelName = modelPath ? modelPath.split('/').pop().split('.')[0] : null;
  const image360Paths = room.web360Paths || [];
  const formatted360Paths = image360Paths.map(path => `http://localhost:8080/images/${formattedAddress}/web360/${path.split('/').pop()}`);
  const fullModelPath = modelName ? `http://localhost:8080/images/${formattedAddress}/models/${modelName}.glb` : null;

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  console.log("Image URL", images);
  console.log("Path:", modelPath);
  console.log("Web360 Paths:", image360Paths);
  return (
    <div>
      <Header />
      {error && <div>Error: {error}</div>}
      {!room && <div>No room details available</div>}
      
      {/* Main content section */}
      <div className="flex my-2">
        <div className="flex flex-row justify-center md:flex-col gap-5 active" style={{ position: 'fixed', left: '20px', top: '100px' }}>
          <button
            className="py-2 px-4 rounded cursor-pointer mt-2 mb-2 flex items-center justify-center"
            onClick={handleView3D}
          >
            <img src={button3DImage} alt="3D" className="w-16 h-16 mr-2" />
          </button>
          <button
            className="py-2 px-4 rounded cursor-pointer mt-2 mb-2 flex items-center justify-center"
            onClick={handleView360}
          >
            <img src={button360Image} alt="360" className="w-16 h-16 mr-2" />
          </button>
        </div>

        {/* Room details and map section - Tăng kích thước hình ảnh */}
        <div className="flex-3 mr-4" style={{ marginLeft: '150px' }}>
          <div className="image-carousel-container" style={{ height: '500px', marginBottom: '30px' }}>
            <ImageCarousel 
              images={images} 
              address={room.address}
              onDeleteImage={isEditing ? handleDeleteImage : undefined}
            />
          </div>
          <h2 className="text-red-500 font-bold mt-4">{room.title}</h2>
          <p className="text-green-500 font-bold">{room.price} VND/month</p>
          <p><span className="font-bold">Address:</span> {room.address}</p>
          <p><span className="font-bold">Area:</span> {room.area} m²</p>
          <p><span className="font-bold">Posted Time:</span> {room.postedTime}</p>
          <p><span className="font-bold">Id:</span> {room.id}</p>
          <div>
            <h3 className="font-bold">Description</h3>
            <p>{room.description}</p>
          </div>
        </div>

        <div className="flex-1" style={{ marginLeft: '70px' }}>
          <div className="map-container">
            <LoadScript googleMapsApiKey="AIzaSyCWEvmo5M3vR4JGCiMfpyb2ZeWkV7a15F0">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        <Draggable>
          <div className="flex-1 bg-white p-2 rounded-lg text-center shadow-md" 
               style={{ width: '220px', position: 'fixed', right: '20px', top: '100px' }}>
            <img
              src={userProfile}
              alt="room"
              className="w-20 h-20 rounded-full mx-auto mb-2"
            />
            <h3 className="mb-1">{room.name}</h3>
            <p className="mb-2 font-bold">{room.phoneNumber}</p>
            <a href={`tel:${room.phoneNumber}`}>
              <button className="bg-blue-500 text-white py-1 px-2 rounded cursor-pointer w-full">
                Phone
              </button>
            </a>
          </div>
        </Draggable>
      </div>

      {/* 3D and 360 viewers section - Tăng kích thước */}
      <div className="mt-8">
        {show3DViewer && fullModelPath && (
          <div className="mb-8 w-full" style={{ height: '800px' }}>
            <h3 className="text-xl font-bold mb-4">3D Model View</h3>
            <ThreeDViewer 
              modelPath={fullModelPath} 
              onDelete={isEditing ? handleDeleteModel : null}
            />
          </div>
        )}

        {show360Viewer && formatted360Paths.length > 0 && (
          <div className="w-full" style={{ height: '800px' }}>
            <h3 className="text-xl font-bold mb-4">360° View</h3>
            <ThreeSixtyImageViewer 
              image360Path={formatted360Paths}
              onDelete={isEditing ? handleDeleteWeb360 : null}
            />
          </div>
        )}
      </div>

      {/* Edit mode toggle button */}
      {isEditing && (
        <button
          className="fixed bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded"
          onClick={handleDeleteRoom}
        >
          Delete Room
        </button>
      )}
      <button
        className="fixed bottom-4 left-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? 'Done Editing' : 'Edit Room'}
      </button>
    </div>
  );
};

export default RoomDetail;