import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
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
            <h1>Admin Page</h1>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Search by username" 
            />
            <button onClick={handleSearch}>Find User</button>
            {foundUser && (
                <div>
                    <h2>User Details</h2>
                    <p>ID: {foundUser.id}</p>
                    <p>Username: {foundUser.userName}</p>
                    <p>Email: {foundUser.email}</p>
                </div>
            )}
        </div>
    );
};

export default AdminPage;