import React, { useEffect, useState } from 'react';
import RoomCard from '../components/RoomCard';
import { getAllRooms } from '../services/room';

const RentRoom = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAllRooms();
                setRooms(data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            
            {rooms.map(room => (
                <RoomCard key={room.id} room={room} />
            ))}
        </div>
    );
};

export default RentRoom;