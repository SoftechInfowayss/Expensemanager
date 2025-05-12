import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LucideUserCheck, LucideKeyRound, LucideShieldCheck } from "lucide-react";
import Footer from "../components/Footer";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginSuccessPopup = ({ onClose }) => {
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
          <h3 className="text-2xl font-bold text-white mb-2">Welcome Back!</h3>
          <p className="text-gray-300 mb-6">
            You've successfully logged in. Redirecting to your dashboard...
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  // Load animations on mount
  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://expensemanager-jite.onrender.com/api/auth/login', {
        email,
        password
      });

      // Store email in localStorage
      localStorage.setItem("email", email);

      console.log('Login successful:', response.data);
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/user');
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div className={`flex min-h-screen flex-col lg:flex-row transition-all duration-1000 ease-out ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        {/* Left Side - Animated Background with Floating Overlay Text */}
        <div
          className="relative w-full lg:w-1/2 flex items-center justify-center bg-cover bg-center transition-all duration-1000 ease-in-out transform hover:scale-105 min-h-[50vh] lg:min-h-screen"
          style={{
            backgroundImage: "url('https://media.istockphoto.com/id/1335717953/photo/project-manager-working-on-computer-at-the-office-concept-with-icons-of-management-areas-such.jpg?s=612x612&w=0&k=20&c=HKKel0F9p7u9JL54sDOtYOuR1yVv81LA2ISHmuU7mdM=')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div> {/* Dark Overlay */}
          <div className="relative text-white px-6 lg:px-10 text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight animate-float hover:animate-glow transition-all duration-700">
              Take Control of <span className="text-indigo-400 animate-pulse">Your Finances</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg opacity-90 animate-slide-in hover:text-indigo-300 transition-all duration-700 hover:scale-105">
              Secure. Fast. Reliable.
            </p>
          </div>
        </div>

        {/* Right Side - Animated Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-900 px-4 lg:px-8 py-10 lg:pt-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-8 lg:p-10 w-full max-w-md border border-gray-700 transform transition-all duration-700 ease-in-out hover:scale-[1.05] hover:shadow-indigo-500/50">
            <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-6 text-white animate-slide-up">Login</h2>

            {/* Feature Icons - Smooth Floating */}
            <div className="flex justify-center space-x-6 mb-6">
              <div className="p-4 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-float hover:rotate-12 shadow-md hover:shadow-indigo-400/50">
                <LucideUserCheck size={26} color="white" />
              </div>
              <div className="p-4 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-float delay-100 hover:rotate-12 shadow-md hover:shadow-indigo-400/50">
                <LucideKeyRound size={26} color="white" />
              </div>
              <div className="p-4 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-float delay-200 hover:rotate-12 shadow-md hover:shadow-indigo-400/50">
                <LucideShieldCheck size={26} color="white" />
              </div>
            </div>

            <p className="text-sm text-center mb-4 text-gray-300 animate-fade-in">
              Enter your credentials to access your account.
            </p>

            {/* Input Fields with Smooth Neon Glow */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:ring-2 hover:ring-gray-500 animate-glow"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:ring-2 hover:ring-gray-500 animate-glow"
            />

            {/* Forgot Password */}
            <div className="text-sm text-center text-gray-400 hover:text-indigo-400 transition hover:animate-pulse">
              <a href="#">Forgot password?</a>
            </div>

            {/* Login Button - **ULTIMATE BUTTON ANIMATION!** */}
            <button 
              onClick={handleLogin}
              className="relative w-full p-3 mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-indigo-500/50 active:scale-95 group"
            >
              <span className="relative z-10 text-lg font-semibold">LOGIN</span>
              <div className="absolute inset-0 bg-indigo-700 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute -inset-3 bg-indigo-500 blur-md opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && <LoginSuccessPopup />}

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
        theme="dark"
      />

      <Footer />
    </>
  );
};

export default Login;