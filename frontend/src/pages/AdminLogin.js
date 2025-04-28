import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LucideUser, LucideKey, LucideShield } from "lucide-react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer";
const AdminLogin = () => {
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // Load animations on mount
  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const handleAdminLogin = async () => {
    // Static credentials for admin login
    const staticUsername = "simar";
    const staticPassword = "12345";

    if (username === staticUsername && password === staticPassword) {
      // Store admin login status in localStorage
      localStorage.setItem("isAdmin", "true");

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } else {
      toast.error("Invalid username or password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <div className={`flex min-h-screen transition-all duration-1000 ease-out ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        {/* Left Side - Animated Background with Floating Overlay Text */}
        <div
          className="relative w-1/2 hidden lg:flex items-center justify-center bg-cover bg-center transition-all duration-1000 ease-in-out transform hover:scale-105"
          style={{
            backgroundImage: "url('https://img.lovepik.com/background/20211022/large/lovepik-simple-geometric-business-background-image_402009661.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div> {/* Dark Overlay */}
          <div className="relative text-white px-10 text-center">
            <h1 className="text-5xl font-extrabold leading-tight animate-float hover:animate-glow transition-all duration-700">
              Admin <span className="text-indigo-400 animate-pulse">Dashboard</span>
            </h1>
            <p className="mt-4 text-lg opacity-90 animate-slide-in hover:text-indigo-300 transition-all duration-700 hover:scale-105">
              Secure. Fast. Reliable.
            </p>
          </div>
        </div>

        {/* Right Side - Animated Admin Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-900 px-8 pt-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-10 w-full max-w-md border border-gray-700 transform transition-all duration-700 ease-in-out hover:scale-[1.05] hover:shadow-indigo-500/50">
            <h2 className="text-4xl font-semibold text-center mb-6 text-white animate-slide-up">Admin Login</h2>

            {/* Feature Icons - Smooth Floating */}
            <div className="flex justify-center space-x-6 mb-6">
              <div className="p-4 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-float hover:rotate-12 shadow-md hover:shadow-indigo-400/50">
                <LucideUser size={26} color="white" />
              </div>
              <div className="p-4 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-float delay-100 hover:rotate-12 shadow-md hover:shadow-indigo-400/50">
                <LucideKey size={26} color="white" />
              </div>
              <div className="p-4 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-float delay-200 hover:rotate-12 shadow-md hover:shadow-indigo-400/50">
                <LucideShield size={26} color="white" />
              </div>
            </div>

            <p className="text-sm text-center mb-4 text-gray-300 animate-fade-in">
              Enter your admin credentials to access the dashboard.
            </p>

            {/* Input Fields with Smooth Neon Glow */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:ring-2 hover:ring-gray-500 animate-glow"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:ring-2 hover:ring-gray-500 animate-glow"
            />

            {/* Login Button - **ULTIMATE BUTTON ANIMATION!** */}
            <button 
              onClick={handleAdminLogin}
              className="relative w-full p-3 mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-indigo-500/50 active:scale-95 group"
            >
              <span className="relative z-10 text-lg font-semibold">LOGIN</span>
              <div className="absolute inset-0 bg-indigo-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute -inset-3 bg-indigo-500 blur-md opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container for Error Messages Only */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </>
  );
};

export default AdminLogin;