import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms } from '../services/room.js';
import { formatAddress } from '../utils/addressFormatter';

const FeaturedListings = ({ currentAddress, currentRoomId }) => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getMajorCity = (address) => {
    if (!address) return null;

    const majorCities = {
      'Ho Chi Minh': ['ho chi minh', 'hcm', 'saigon', 'sài gòn', 'hồ chí minh', 'tphcm', 'tp hcm', 'thành phố hồ chí minh'],
      'Ha Noi': ['ha noi', 'hanoi', 'hn', 'hà nội', 'thành phố hà nội'],
      'Da Nang': ['da nang', 'danang', 'đà nẵng', 'thành phố đà nẵng']
    };

    const normalizedAddress = address.toLowerCase().trim();
    console.log('Checking address:', normalizedAddress);

    for (const [city, variants] of Object.entries(majorCities)) {
      if (variants.some(variant => normalizedAddress.includes(variant))) {
        console.log('Found city match:', city, 'for address:', normalizedAddress);
        return city;
      }
    }
    console.log('No city match found for address:', normalizedAddress);
    return null;
  };

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        setLoading(true);
        console.log('Current address:', currentAddress);

        const rooms = await getAllRooms();
        console.log('All rooms:', rooms.length);

        const currentCity = getMajorCity(currentAddress);
        console.log('Current city detected:', currentCity);

        if (currentCity) {
          const sameCityRooms = rooms.filter(room => {
            const roomCity = getMajorCity(room.address);
            console.log('Checking room:', room.id, 'address:', room.address, 'detected city:', roomCity);
            return room.id !== currentRoomId && roomCity === currentCity;
          });

          console.log('Rooms in same city:', sameCityRooms.length);

          const sortedRooms = sameCityRooms.sort((a, b) =>
            new Date(b.postedTime) - new Date(a.postedTime)
          ).slice(0, 5);

          console.log('Final featured rooms:', sortedRooms.length);
          setFeaturedRooms(sortedRooms);
        } else {
          console.log('No city detected for current address');
          setFeaturedRooms([]);
        }
      } catch (error) {
        console.error('Error fetching featured rooms:', error);
        setError('Unable to load room list');
      } finally {
        setLoading(false);
      }
    };

    if (currentAddress) {
      fetchFeaturedRooms();
    }
  }, [currentAddress, currentRoomId]);

  const handleRoomClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="featured-listings bg-white rounded-lg shadow-md p-4"
        style={{
          width: '300px',
          height: '200px',
          position: 'fixed',
          right: '270px',
          top: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-listings bg-white rounded-lg shadow-md p-4"
        style={{
          width: '300px',
          height: '200px',
          position: 'fixed',
          right: '270px',
          top: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="featured-listings bg-white rounded-lg shadow-md p-4"
      style={{
        width: '300px',
        maxHeight: '600px',
        overflowY: 'auto',
        position: 'fixed',
        right: '270px',
        top: '100px'
      }}>
      <h3 className="text-lg font-bold mb-4 text-center text-blue-600">Featured Listings</h3>
      {featuredRooms.length > 0 ? (
        <div className="space-y-4">
          {featuredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 flex-shrink-0">
                  {room.imagePaths && room.imagePaths.length > 0 ? (
                    <img
                      src={`http://localhost:8080/images/${formatAddress(room.address)}/images/${room.imagePaths[0].split('/').pop()}`}
                      alt={room.name || 'Room'}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm line-clamp-2">{room.name || "Room for Rent"}</p>
                  <p className="text-green-600 font-bold text-sm">{room.price} million/month</p>
                  <p className="text-gray-500 text-xs">{room.postedTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No similar listings found</p>
      )}
    </div>
  );
};

export default FeaturedListings; 