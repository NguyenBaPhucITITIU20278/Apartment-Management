import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getRoomById, updateRoomDetails } from "../services/room.js";
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
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  deleteRoomImage,
  deleteRoomModel,
  deleteRoomWeb360,
  deleteEntireRoom,
  updateRoomImages,
  updateRoomModel,
  updateRoomWeb360
} from "../services/room.js";

// Add this after your imports to fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Thêm component để cập nhật view của map
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedWeb360Files, setSelectedWeb360Files] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    setIsLoggedIn(!!token); // Set to true if token exists
  }, []);

  const fetchRoomData = async () => {
    try {
      const fetchedRoom = await getRoomById(roomId);
      setRoom(fetchedRoom);
      setLoading(false);

      // Thêm "Vietnam" vào địa chỉ để tăng độ chính xác
      const searchAddress = `${fetchedRoom.address}, Vietnam`;
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&countrycodes=vn`,
        {
          headers: {
            'User-Agent': 'ApartmentManagement/1.0'
          }
        }
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length > 0) {
        const newCenter = {
          lat: parseFloat(geocodeData[0].lat),
          lng: parseFloat(geocodeData[0].lon)
        };
        setCenter(newCenter);
        console.log("Location found:", newCenter);
      } else {
        console.log("Could not find coordinates for address:", searchAddress);
        // Set default center to Vietnam if coordinates not found
        setCenter({ lat: 10.762622, lng: 106.660172 });
      }
    } catch (err) {
      console.error("Error fetching room data:", err);
      setError(null);
      setLoading(false);
      alert("Please log in to see the details of the apartment.");
      navigate("/");
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
      alert("Please log in correct account to delete the details of the apartment.");
      console.error("Error deleting image:", error);
      window.location.reload();
    }
  };

  const handleDeleteModel = async () => {
    try {
      await deleteRoomModel(roomId);
      // Refresh room data
      fetchRoomData();
      setShow3DViewer(false);
    } catch (error) {
      alert("Please log in correct account to delete the details of the apartment.");
      setError("Error deleting 3D model");
      window.location.reload();
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
      alert("Please log in correct account to delete the details of the apartment.");
      setError("Error deleting 360 image");
      window.location.reload();
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      try {
        await deleteEntireRoom(roomId);
        // Điều hướng về trang chủ sau khi xóa thành công
        navigate('/');
      } catch (error) {
        alert("Please log in with the correct account to update the images of the apartment.");
        console.error("Error updating images:", error.response ? error.response.data : error.message);
        window.location.reload(); 
      }
    }
  };

  const handleUpdateImages = async (newImages) => {
    console.log("Images to update:", newImages); 
    const formData = new FormData();

    newImages.forEach((image) => {
      console.log("Appending image:", image); 
      formData.append('files', image); 
    });

    console.log("FormData entries before sending:", Array.from(formData.entries())); // Log các mục trong FormData

    try {
      await updateRoomImages(roomId, formData); // Gửi formData
      fetchRoomData(); // Refresh room data
      console.log("Successfully updated images");
    } catch (error) {
      alert("Please log in with the correct account to update the images of the apartment.");
      console.error("Error updating images:", error.response ? error.response.data : error.message);
      window.location.reload(); // Reload the page after showing the alert
    }
  };

  const handleUpdateModel = async (newModel) => {
    try {
      await updateRoomModel(roomId, newModel);
      fetchRoomData();
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  const handleUpdateWeb360 = async (newWeb360Files) => {
    try {
      await updateRoomWeb360(roomId, newWeb360Files);
      fetchRoomData();
    } catch (error) {
      console.error("Error updating web360:", error);
    }
  };

  const handleUpdateRoomDetails = async (updatedRoomData) => {
    console.log("Attempting to update room details with data:", updatedRoomData);
    try {
      const response = await updateRoomDetails(roomId, {
        ...updatedRoomData,
        web360Paths: updatedRoomData.web360Paths.map(path => path.toString())
      });
      console.log("Update successful, response:", response);
      // window.location.reload(); // Reload the page to fetch updated data
    } catch (error) {
      alert("Please log in correct account to update the details of the apartment.");
      console.error("Error updating room details:", error);
      window.location.reload();
    }
  };

  const isRoomOwner = room && room.username === localStorage.getItem("userName");

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

      {/* Display message if user is not logged in */}
      {!isLoggedIn && (
        <div className="alert alert-warning" style={{ color: 'red', margin: '20px' }}>
          Please log in to edit or delete this room.
        </div>
      )}

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

        {/* Room details section */}
        <div className="flex-3" style={{ marginLeft: '150px' }}>
          <div className="image-carousel-container" style={{ height: '500px', marginBottom: '30px' }}>
            <ImageCarousel
              images={images}
              address={room.address}
              onDeleteImage={isEditing ? handleDeleteImage : undefined}
            />
          </div>

          {isEditing ? (
            <>
              <div className="flex items-center mb-2">
                <label className="font-bold mr-2">Address:</label>
                <input
                  type="text"
                  className="text-500"
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                  value={room.address}
                  onChange={(e) => setRoom({ ...room, address: e.target.value })}
                />
              </div>

              <div className="flex items-center mb-2">
                <label className="font-bold mr-2">Price:</label>
                <input
                  type="number"
                  className="text-500 font-bold"
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                  value={room.price}
                  onChange={(e) => setRoom({ ...room, price: e.target.value })}
                />
              </div>

              <div className="flex items-center mb-2">
                <label className="font-bold mr-2">Area:</label>
                <input
                  type="number"
                  style={{ border: 'none', background: 'transparent', width: '100%' }}
                  value={room.area}
                  onChange={(e) => setRoom({ ...room, area: e.target.value })}
                />
              </div>

              <div className="flex items-center mb-2">
                <label className="font-bold mr-2">Description:</label>
                <textarea
                  className="w-1/4 min-h-[100px] p-2 border border-gray-200 rounded-md bg-gray-50 resize-vertical"
                  value={room.description}
                  onChange={(e) => setRoom({ ...room, description: e.target.value })}
                />
              </div>

              {/* New section for updating images */}
              <div className="flex items-center mb-2">
                <label className="font-bold mr-2">Update Images:</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    console.log("Selected files:", files); // Log selected files
                    handleUpdateImages(files); // Call the function to update images
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mt-6">
                <h2 className="text-2xl font-bold text-gray-800">{room.title}</h2>
                <p className="text-xl font-bold text-green-600">{room.price} VND/month</p>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold mb-2">Description Information</h3>
                  <p className="text-gray-700 w-1/4"><span className="font-medium">Address:</span> {room.address}</p>
                  <p className="text-gray-700 w-1/4"><span className="font-medium">Area:</span> {room.area} m²</p>
                  <p className="text-gray-700 w-1/4"><span className="font-medium">Posted Date:</span> {room.postedTime}</p>
                  <p className="text-gray-700 w-1/4"><span className="font-medium">Room ID:</span> {room.id}</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">Details</h3>
                  <div className="whitespace-pre-line text-gray-700 w-1/2 bg-gray-50 p-4 rounded-md border border-gray-200">
                    {room.description}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">Location</h3>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Current Address:</span> {address}
                  </p>
                  <div className="w-full">
                    <MapContainer 
                      center={center} 
                      zoom={15} 
                      style={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                      scrollWheelZoom={true}
                    >
                      <ChangeView center={center} zoom={15} />
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {center.lat !== 0 && center.lng !== 0 && (
                        <Marker position={center}>
                          <Popup>
                            <div>
                              <strong>Address:</strong><br />
                              {address}
                            </div>
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </>
          )}
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
      {isRoomOwner && (
        <button
          className="fixed bottom-4 left-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => {
            if (isEditing) {
              handleUpdateRoomDetails(room); // Update room details when done editing
            }
            setIsEditing(!isEditing);
          }}
          disabled={!isLoggedIn} // Disable button if not logged in
        >
          {isEditing ? 'Done Editing' : 'Edit Room'}
        </button>
      )}

      {isRoomOwner && (
        <button
          className="fixed bottom-4 right-10 bg-red-500 text-white py-2 px-4 rounded"
          onClick={handleDeleteRoom}
          disabled={!isLoggedIn} // Disable button if not logged in
        >
          Delete Room
        </button>
      )}
    </div>
  );
};

export default RoomDetail;