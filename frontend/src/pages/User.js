import React from 'react';
import Sidebar from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddTransaction from './AddTransaction';
import Profile from './Profile';

const User = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {/* Content area */}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/add-transaction" element={<AddTransaction />} />
                </Routes>
            </div>
        </div>
    );
};

export default User;