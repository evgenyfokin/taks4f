import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [regStatus, setRegStatus] = useState(null);
    const navigate = useNavigate();
    const apiUrl = 'https://chatf-594d6adb216e.herokuapp.com' || 'http://localhost:3000'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegStatus(null);

        try {
            const response = await axios.post(`${apiUrl}/register`, {
                name: name,
                email: email,
                password: password,
            });

            if (response.data.error) {
                setRegStatus(response.data.error);
            } else {
                setRegStatus("Successfully registered");
                navigate("/login")
            }
        } catch (error) {
            if (error.response) {
                setRegStatus("Registration failed: existed user");
            } else if (error.request) {
                setRegStatus("Registration failed: no response from server");
            } else {
                setRegStatus("Registration failed: " + error.message);
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="registerPage w-25">
                <h2 className="text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
                {regStatus && <div className="alert alert-info mt-3">Status: {regStatus}</div>}
                <Link to="/" className="mt-3 d-block text-center">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default RegisterPage;