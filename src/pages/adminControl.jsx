import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { findUser } from '../services/admin';
import { useMutationHook } from '../hooks/useMutationHook';

const AdminPage = () => {
    const [name, setName] = useState('');
    const [foundUser, setFoundUser] = useState('');
    const navigate = useNavigate();

    const mutation = useMutationHook(
        data => findUser(name)
    );

    const handleSearch = () => {
        mutation.mutate({ name: name });
    };

    useEffect(() => {
        if (mutation.isSuccess) {
            setFoundUser(mutation.data);
        }
    }, [mutation.data, mutation.isSuccess]);

    return (
        <div>   
            <div className="container mx-auto p-4">
            
            <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
            <div className="mb-4">
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Search by username" 
                    className="border p-2 w-full"
                />
            </div>
            <button 
                onClick={handleSearch} 
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Find User
            </button>
            {foundUser && (
                <div className="mt-6 p-4 border rounded-lg shadow-lg">
                    <div className="flex">
                        <div className="w-1/3 bg-gray-200 rounded-lg p-4">
                            {/* Placeholder for user image */}
                        </div>
                        <div className="w-2/3 pl-4">
                            <h2 className="text-xl font-bold mb-2">User Details</h2>
                            <p className="mb-1"><strong>ID:</strong> {foundUser.id}</p>
                            <p className="mb-1"><strong>Username:</strong> {foundUser.userName}</p>
                            <p className="mb-1"><strong>First Name:</strong> {foundUser.firstName}</p>
                            <p className="mb-1"><strong>Last Name:</strong> {foundUser.lastName}</p>
                            <p className="mb-1"><strong>Email:</strong> {foundUser.email}</p>
                            <p className="mb-1"><strong>Password:</strong> {foundUser.password}</p>
                            <p className="mb-1"><strong>Phone:</strong> {foundUser.phone}</p>
                            <p className="mb-1"><strong>Role:</strong> {foundUser.role}</p>
                        </div>
                    </div>
                    <div className="flex mt-4 space-x-4">
                        <button className="bg-gray-200 p-2 rounded-lg w-1/3">Action 1</button>
                        <button className="bg-gray-200 p-2 rounded-lg w-1/3">Action 2</button>
                        <button className="bg-gray-200 p-2 rounded-lg w-1/3">Action 3</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default AdminPage;