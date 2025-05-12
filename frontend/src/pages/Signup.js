import React, { useState, useEffect } from "react";
import axios from "axios";
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideHome, LucideCalendar, LucideUserCheck } from "lucide-react";
import Footer from "../components/Footer";
import '../components/Sidebar.css';

const SuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-gray-800 border border-indigo-500 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl animate-pop-in">
        {/* Gradient circle decoration */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
        
        {/* Main content */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 mb-4">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Welcome!</h3>
          <p className="text-gray-300 mb-6">
            Your account has been successfully created. Start managing your expenses like a pro!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            Let's Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  const [loaded, setLoaded] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    address: "",
    dob: "",
    password: "",
  });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if the email already exists before submitting the form
      const checkResponse = await axios.post("https://expensemanager-jite.onrender.com/api/auth/check-email", { email: formData.email });
  
      if (checkResponse.data.exists) {
        alert("Email is already registered. Please use another email.");
        return;
      }
  
      // Proceed with registration if email doesn't exist
      const response = await axios.post("https://expensemanager-jite.onrender.com/api/auth/register", formData);
      setShowSuccessPopup(true);
  
      // Clear form after success
      setFormData({
        name: "",
        email: "",
        phoneno: "",
        address: "",
        dob: "",
        password: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Show duplicate email error
      } else {
        alert("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <div className={`flex min-h-screen flex-col lg:flex-row bg-gray-900 transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
        {/* Left Side - Fullscreen Image with Overlay */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-1000 ease-in-out transform hover:scale-105 min-h-[50vh] lg:min-h-screen">
          {/* Floating Gradient Circle for Depth */}
          <div className="absolute -top-20 -left-32 w-72 h-72 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-3xl rounded-full"></div>

          {/* Content */}
          <div className="relative text-white text-left px-6 lg:px-14 max-w-lg">
            {/* Finance Icon Animation */}
            <div className="flex items-center space-x-3 mb-6 animate-float">
              <div className="p-4 bg-gray-800 rounded-xl shadow-md transition-all hover:scale-110">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M9 21V3m12 6H9m12 5H9m6 5h-6"></path>
                </svg>
              </div>
              <span className="text-xl font-semibold text-indigo-400">Smart Expense Management</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight transition-all duration-700 hover:scale-105 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
              Take Control of <span className="text-indigo-400 animate-pulse">Your Finances</span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-base lg:text-lg opacity-90 animate-slide-in transition-all duration-700 hover:text-indigo-300 hover:scale-105 text-gray-200">
              Manage, track, and optimize your expenses with ease. Gain financial freedom and control your future with smart insights.
            </p>
          </div>
        </div>

        {/* Right Side - Compact Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-6 py-10 lg:pt-24">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-6 lg:p-8 w-full max-w-sm sm:max-w-md border border-gray-700 transform transition-all duration-700 ease-in-out hover:scale-[1.04] hover:shadow-lg">
            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-5 text-white animate-slide-up">Create Account</h2>

            {/* Feature Icons */}
            <div className="flex justify-center space-x-4 mb-5">
              <div className="p-3 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-pulse hover:scale-110 shadow-md">
                <LucideUserCheck size={20} color="white" />
              </div>
              <div className="p-3 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-pulse delay-100 hover:scale-110 shadow-md">
                <LucideMail size={20} color="white" />
              </div>
              <div className="p-3 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-pulse delay-200 hover:scale-110 shadow-md">
                <LucideLock size={20} color="white" />
              </div>
            </div>

            {/* Input Fields */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="relative">
                  <LucideUser className="absolute top-3.5 left-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-11 w-full p-3.5 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="relative">
                  <LucideMail className="absolute top-3.5 left-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-11 w-full p-3.5 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="relative">
                  <LucidePhone className="absolute top-3.5 left-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="phoneno"
                    placeholder="Phone"
                    value={formData.phoneno}
                    onChange={handleInputChange}
                    className="pl-11 w-full p-3.5 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="relative">
                  <LucideHome className="absolute top-3.5 left-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-11 w-full p-3.5 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="relative col-span-1 lg:col-span-2">
                  <LucideCalendar className="absolute top-3.5 left-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="pl-11 w-full p-3.5 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative mt-5">
                <LucideLock className="absolute top-3.5 left-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-11 w-full p-3.5 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                  required
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="relative w-full p-3.5 mt-6 bg-indigo-500 text-white rounded-md shadow-lg transition-all transform hover:scale-[1.05] hover:bg-indigo-600 active:scale-95"
              >
                <span className="relative z-10 text-base sm:text-lg font-semibold">REGISTER</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} />}

      <Footer />
    </>
  );
};

export default Signup;