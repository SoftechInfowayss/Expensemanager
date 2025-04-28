import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LucideUser, LucideMenu, LucideX, LucideInfo, LucideMail, LucideAlignLeft, LucideShield } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, setUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Determine if the current route is a user-related page (e.g., /user/*)
    const isUserPage = location.pathname.startsWith("/user");

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleToggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setUser(null);
        setDropdownOpen(false);
    };

    const handleAdminAccess = () => {
        navigate("/adminlogin"); // Navigate to the Admin Login Page
    };

    return (
        <nav className="fixed w-full z-50 bg-gray-900 shadow-lg border-b border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
                
                {/* Floating Background Effect */}
                <div className="absolute inset-0 flex justify-center items-center -z-10">
                    <div className="w-96 h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
                </div>

                {/* Left Side: Hamburger Button for Sidebar (Visible on Mobile, only on user pages) */}
                {isUserPage && (
                    <button 
                        className="md:hidden text-white focus:outline-none order-1 mr-3" 
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? <LucideX size={24} /> : <LucideAlignLeft size={24} />}
                    </button>
                )}

                {/* Brand Name - Centered in Mobile View */}
                <div className="flex-1 text-center md:text-left order-2">
                    <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-gray-100 hover:text-blue-400 transition duration-300">
                        ExpenseEase
                    </Link>
                </div>

                {/* Right-Side Mobile Menu Button */}
                <button 
                    className="md:hidden text-white focus:outline-none order-3" 
                    onClick={handleToggleMenu}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
                </button>

                {/* Right-Side Menu (About Us, Contact, Login, Sign Up, Admin Access) */}
                <div className="hidden md:flex space-x-6 text-gray-300 text-lg font-medium items-center order-2">
                    
                    {/* About Us */}
                    <NavItem to="/about" title="About Us" icon={<LucideInfo size={22} />} />

                    {/* Contact Us */}
                    <NavItem to="/contact" title="Contact Us" icon={<LucideMail size={22} />} />

                    {/* User Section */}
                    {user ? (
                        <div className="relative">
                            <button 
                                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-expanded={dropdownOpen}
                                aria-label="User menu"
                            >
                                <LucideUser size={24} />
                                <span>{user.name}</span>
                            </button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-3 w-48 bg-gray-900 text-white shadow-xl rounded-lg border border-gray-700 overflow-hidden"
                                    >
                                        <Link to="/profile" className="block px-4 py-3 hover:bg-gray-800 transition">Profile</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition">
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex space-x-4 items-center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link to="/login" className="px-5 py-2 text-gray-300 hover:text-blue-400 transition border border-gray-700 rounded-lg">
                                    Login
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Link to="/signup" className="bg-blue-600 px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition">
                                    Sign Up
                                </Link>
                            </motion.div>

                            {/* Admin Access Icon Button (To the right of Sign Up) */}
                            <motion.button
                                onClick={handleAdminAccess}
                                className="text-gray-300 hover:text-blue-400 transition"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Admin Access"
                            >
                                <LucideShield size={24} />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-gray-900 text-white text-center py-4 border-t border-gray-700 absolute top-[72px] left-0 w-full z-45"
                    >
                        <NavItem to="/about" title="About Us" icon={<LucideInfo size={22} />} mobile />
                        <NavItem to="/contact" title="Contact Us" icon={<LucideMail size={22} />} mobile />

                        {/* Admin Access Icon Button in Mobile Menu */}
                        <motion.button
                            onClick={handleAdminAccess}
                            className="flex items-center justify-center w-full px-6 py-3 hover:bg-gray-800 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Admin Access"
                        >
                            <LucideShield size={22} />
                        </motion.button>

                        {user ? (
                            <>
                                <Link to="/profile" className="block px-6 py-3 hover:bg-gray-800 transition">Profile</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-6 py-3 hover:bg-gray-800 transition">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link to="/login" className="block px-6 py-3 hover:bg-gray-800 transition">Login</Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link to="/signup" className="block px-6 py-3 bg-blue-600 hover:bg-blue-700 transition">Sign Up</Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// Navigation Item Component with Sliding Highlight Hover Effect
const NavItem = ({ to, title, icon, mobile = false }) => (
    <motion.div 
        className={`${mobile ? "block px-6 py-3" : "relative group"} flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition`}
        whileHover={{ scale: 1.1 }}
    >
        {icon}
        <Link to={to} className="relative overflow-hidden">
            {title}
            {!mobile && (
                <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                ></motion.div>
            )}
        </Link>
    </motion.div>
);

export default Navbar;