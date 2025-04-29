import React from 'react';
import Sidebar from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddTransaction from './AddTransaction';
import Profile from './Profile';
import FinancialAdvice from './FinanceAdvice';

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
                    <Route path="/advice" element={<FinancialAdvice />} />
                </Routes>
            </div>
        </div>
    );
};

export default User;