import React, { useEffect, useState } from 'react';
import RoomCard from '../components/RoomCard';
import { getAllRooms } from '../services/room';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRooms();
                if (Array.isArray(data)) {
                    setRooms(data);
                } else {
                    console.error('Expected an array but got:', data);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            <h1>List Post</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : Array.isArray(rooms) ? (
                rooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                ))
            ) : (
                <p>No rooms available</p>
            )}
        </div>
    );
}

export default Home;