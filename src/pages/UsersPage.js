import React, { useState, useEffect } from 'react';
import instance from '../api';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let userId;
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwt_decode(token);
            userId = decodedToken.id;
        }

        const getUsers = async () => {
            try {
                const response = await instance.get('http://localhost:3000/users', {
                    headers: { 'x-access-token': token }
                });
                setUsers(response.data);
            } catch (error) {
                console.error(`Error getting users: ${error}`);
                if (error.response && error.response.status === 403) {
                    navigate('/login');
                }
            }
        };

        getUsers();
    }, [navigate]);

    return (
        <div className="usersPage">
            <h1>Users</h1>
            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
};

export default UsersPage;