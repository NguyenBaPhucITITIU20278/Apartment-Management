import React from 'react';

const RoomCard = ({ room }) => {
    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', margin: '16px 0', display: 'flex', alignItems: 'center' }}>
            {/* <img src={room.image} alt="Room" style={{ width: '100px', height: '100px', marginRight: '16px' }} /> */}
            <div>
                <h2>{room.name}</h2>
                <p className='price font-bold'> Price: <span className= 'font-normal'>{room.price}</span></p>
                <p className='bedrooms font-bold'> Bedrooms: <span className='font-normal'>{room.numberOfBedrooms}</span></p>
                <p className='description font-bold'> Description: <span className='font-normal'>{room.description}</span></p>
                <button style={{ backgroundColor: '#FFD700', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                    Call: {room.phoneNumber}
                </button>
            </div>
        </div>
    );
};

export default RoomCard;