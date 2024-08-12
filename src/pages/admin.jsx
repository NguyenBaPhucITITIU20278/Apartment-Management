import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { useMutation } from '@tanstack/react-query';
import {findUser} from '../services/admin';
import { useEffect } from 'react';  

const AdminPage = () => {
    const [userName, setUserName] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const navigate = useNavigate();

   
    const {data, isSuccess, isError, error} = useMutation({
        mutationFn: findUser,
    });

    const handleSearch = () => {
        console.log(userName);
        findUser(userName);
    };

    useEffect(() => {
        console.log(data);
        if (isSuccess) {    
            setFoundUser(data);
        }
        if (isError) {
            console.error('Error fetching user:', error);
        }
    }, [data, isSuccess, isError, error]);

    return (
        <div>
            <h1>Admin Page</h1>
            <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Search by username" 
            />
            <button onClick={handleSearch}>Find User</button>
            {foundUser && (
                <div>
                    <h2>User Details</h2>
                    <p>ID: {foundUser.id}</p>
                    <p>Username: {foundUser.username}</p>
                    <p>Email: {foundUser.email}</p>
                </div>
            )}
        </div>
    );
};

export default AdminPage;