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
import ThreeDViewer from "../components/ThreeDViewer";
import ThreeSixtyImageViewer from "../components/ThreeSixtyImageViewer";
import Draggable from 'react-draggable';
import button360Image from '../assets/360button.png';
import button3DImage from '../assets/3Dbutton.png';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const RoomDetail = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [show360Viewer, setShow360Viewer] = useState(false);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await getRoomById(roomId);
        console.log("Fetched room data:", data);
        setRoom(data);
        setLoading(false);

        // Geocode the address to get latitude and longitude
        const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.address)}&key=YOUR_GOOGLE_MAPS_API_KEY`);
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

    fetchRoom();
  }, [roomId]);

  const handleView3D = () => {
    setShow3DViewer(true);
  };

  const handleView360 = () => {
    setShow360Viewer(!show360Viewer);
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
  const image360Path = room.web360Path;
  const image360Name = image360Path ? image360Path.split('/').pop().split('.')[0] : null;
  const fullModelPath = modelName ? `http://localhost:8080/images/${formattedAddress}/models/${modelName}.glb` : null;
  const full360ImagePath = image360Name ? `http://localhost:8080/images/${formattedAddress}/web360/${image360Name}.jpg` : null;

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  console.log("Image URL", images);
  console.log("Path:", modelPath);
  console.log("Image360 URL:", full360ImagePath);
  return (
    <div>
      <Header />
      {error && <div>Error: {error}</div>}
      {!room && <div>No room details available</div>}
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
        <div className="flex-3 mr-4" style={{ marginLeft: '150px' }}>
          <ImageCarousel images={images} address={address} />
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
          <div className="flex-1 bg-white p-2 rounded-lg text-center shadow-md" style={{ width: '220px', position: 'fixed', right: '20px', top: '100px' }}>
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
      {show3DViewer && fullModelPath && (
        <div style={{ marginTop: '20px' }}>
          <ThreeDViewer modelPath={fullModelPath} />
        </div>
      )}
      {show360Viewer && (
        <div style={{ marginTop: '20px' }}>
          <ThreeSixtyImageViewer image360Path={full360ImagePath} />
        </div>
      )}
    </div>
  );
};

export default RoomDetail;