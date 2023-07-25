import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom';
import styles from './form.module.css'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const navigate = useNavigate();
    const apiUrl = 'https://chatf-594d6adb216e.herokuapp.com' || 'http://localhost:3000'
    const login = () => {
        axios
            .post(`${apiUrl}/login`, {
                email: email,
                password: password,
            })
            .then((response) => {
                if (response.data.token) {
                    setLoginStatus(`Logged in as ${email}`);
                    localStorage.setItem('token', response.data.token);
                    navigate("/users");
                } else {
                    setLoginStatus(response.data.message || 'An unexpected error has occurred');
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setLoginStatus('Invalid email or password');
                } else {
                    setLoginStatus('An unexpected error has occurred');
                }
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="loginPage">
                <h1 className="text-center">Login</h1>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Email..."
                        className="form-control"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        placeholder="Password..."
                        className="form-control"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <button className="btn btn-primary w-100" onClick={login}> Login </button>
                {loginStatus && <div className="alert alert-info mt-3">{loginStatus}</div>}
                <Link to="/register" className="mt-3 d-block text-center">Don't have an account? Register</Link>
            </div>
        </div>
    );
};

export default LoginPage;