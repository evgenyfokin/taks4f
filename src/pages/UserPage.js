import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import jwt_decode from "jwt-decode";

const apiUrl = 'https://chatf-594d6adb216e.herokuapp.com' || 'http://localhost:3000'

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();
    const [resetKey, setResetKey] = useState(Date.now());

    useEffect(() => {
        const getUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/users`, {
                    headers: { 'x-access-token': token }
                });
                setUsers(response.data);
            } catch (error) {
                console.error(`Error getting users: ${error}`);
                if (error.response && error.response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        };
        getUsers();
    }, [navigate]);

    const handleCheckboxChange = (event, userId) => {
        if (event.target.checked) {
            setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userId]);
        } else {
            setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(id => id !== userId));
        }
    };

    const handleSelectAllChange = (event) => {
        if (event.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };
    const areAllUsersSelected = users.length !== 0 && users.length === selectedUsers.length;


    const handleBlock = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwt_decode(token);
            const currentUserId = decodedToken.id;

            await axios.post(`${apiUrl}/blockUsers`, {
                userIds: selectedUsers
            }, {
                headers: { 'x-access-token': token }
            });
            const response = await axios.get('${apiUrl}/users', {
                headers: { 'x-access-token': token }
            });

            setUsers(response.data);

            if (selectedUsers.includes(currentUserId)) {
                localStorage.removeItem('token');
                navigate('/');
            }

            setSelectedUsers([]);
            setResetKey(Date.now())
        } catch (error) {
            console.error(`Error blocking users: ${error}`);
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    const handleUnblock = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${apiUrl}/updateUserStatus`, {
                userIds: selectedUsers,
                status: 'active'
            }, {
                headers: { 'x-access-token': token }
            });
            setSelectedUsers([]);
            const response = await axios.get(`${apiUrl}/users`, {
                headers: { 'x-access-token': token }
            });
            setUsers(response.data);
            setResetKey(Date.now())
        } catch (error) {
            console.error(`Error unblocking users: ${error}`);
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');

            // Get the current user id
            const decodedToken = jwt_decode(token);
            const currentUserId = decodedToken.id;

            await axios.post(`${apiUrl}/deleteUsers`, {
                userIds: selectedUsers
            }, {
                headers: { 'x-access-token': token }
            });

            const response = await axios.get(`${apiUrl}/users`, {
                headers: { 'x-access-token': token }
            });

            setUsers(response.data);

            if (selectedUsers.includes(currentUserId)) {
                localStorage.removeItem('token');
                navigate('/');
            }

            setSelectedUsers([]);
            setResetKey(Date.now())
        } catch (error) {
            console.error(`Error deleting users: ${error}`);
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };




    return (
        <div className="container mt-5">
            <h1>Users</h1>
            <div className="toolbar mb-3">
                <button className="btn btn-primary me-2" onClick={handleBlock}>Block</button>
                <button className="btn btn-secondary me-2" onClick={handleUnblock}>Unblock</button>
                <button className="btn btn-danger me-2" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                <button className="btn btn-info" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={areAllUsersSelected} onChange={handleSelectAllChange} />
                        </div>
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Register Date</th>
                    <th scope="col">Last Login Date</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" key={resetKey} checked={selectedUsers.includes(user.id)} onChange={event => handleCheckboxChange(event, user.id)} />
                            </div>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.register_date).toLocaleDateString()}</td>
                        <td>{new Date(user.last_login_date).toLocaleDateString()}</td>
                        <td>{user.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;