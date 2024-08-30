import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";
import { getAllRooms, getRoomByAddress, addRoom } from "../services/room";
import { useMutationHook } from "../hooks/useMutationHook";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { searchRooms } from "../services/room";
import FeaturedAreas from "../components/featureAreas";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [bedroom, setBedroom] = useState(0);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const roomsPerPage = 6; // Số lượng RoomCard trên mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let data;
        if (address) {
          data = await getRoomByAddress({ address });
        } else {
          data = await getAllRooms();
        }
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRooms();
  }, [address]);

  const searchMutation = useMutationHook((data) => searchRooms(data));
  const addRoomMutation = useMutationHook(addRoom);
  const {
    data: searchData,
    isError: isSearchError,
    isSuccess: isSearchSuccess,
  } = searchMutation;
  const { isError: isAddError, isSuccess: isAddSuccess } = addRoomMutation;

  const handleSearch = (address) => {
    console.log({ address });
    searchMutation.mutate({ address });
  };
  const handleAreaClick = (address) => {
    setAddress(address);
    setId(id);
    handleSearch(address);
  };

  const handleAddRoom = () => {
    const parsedBedroom = parseInt(bedroom, 10);
    if (isNaN(parsedBedroom)) {
      console.error("Invalid number of bedrooms:", bedroom);
      setError("Invalid number of bedrooms");
      return;
    }
    addRoomMutation.mutate({ id, address, bedroom: parsedBedroom });
  };

  const handleRoomClick = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  // Tính toán các RoomCard cần hiển thị dựa trên trang hiện tại
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Thêm debounce để giảm số lần gọi API khi người dùng nhập
  const debouncedSearch = debounce((value) => {
    setAddress(value);
  }, 300);

  const handleInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    if (address.length > 0) {
      searchMutation.mutate({ address });
    }
  }, [address]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Find your perfect home with us
      </h1>
      <p className="text-gray-500 mb-4">
        Search for your dream home and book it now!
      </p>
      <FeaturedAreas onAreaClick={handleAreaClick} />
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : null}
      <div className="p-2 text-base border border-yellow-300 rounded-md flex-1 w-3/12">
        <input
          type="text"
          placeholder="Where would you like to stay?"
          className="p-2 border border-gray-300 rounded-md flex-1 w-4/6"
          name="address"
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-6"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : currentRooms.length > 0 ? (
        currentRooms.map((room) => (
          <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
        ))
      ) : (
        <p>No rooms available</p>
      )}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(rooms.length / roomsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`p-2 ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
