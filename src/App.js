import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage';
import UserPage from './UserPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/users" element={<UserPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;