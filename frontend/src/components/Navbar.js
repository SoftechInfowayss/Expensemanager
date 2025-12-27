import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LucideUser, LucideMenu, LucideX, LucideInfo, LucideMail, LucideAlignLeft } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // NOTE: use logout() from your AuthContext (not setUser)
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isUserPage = location.pathname.startsWith("/user");

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleToggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    // Defensive: call logout() if provided by AuthContext
    try {
      if (typeof logout === 'function') {
        logout();
      } else {
        // Fallback: clear storage if logout isn't present
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
        // try to navigate home
        navigate('/');
      }
    } catch (err) {
      console.warn("Logout failed:", err);
      // still attempt to clear storage and navigate
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
      } catch (e) {}
      navigate('/');
    }

    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleAdminAccess = () => navigate("/adminlogin");

  return (
    <nav className="fixed w-full z-50 bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <div className="w-96 h-96 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
        </div>

        {isUserPage && (
          <button
            className="md:hidden text-white focus:outline-none order-1 mr-3"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <LucideX size={24} /> : <LucideAlignLeft size={24} />}
          </button>
        )}

        <div className="flex-1 text-center md:text-left order-2">
          <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-gray-100 hover:text-blue-400 transition duration-300">
            ExpenseEase
          </Link>
        </div>

        <button
          className="md:hidden text-white focus:outline-none order-3"
          onClick={handleToggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
        </button>

        <div className="hidden md:flex space-x-6 text-gray-300 text-lg font-medium items-center order-2">
          <NavItem to="/about" title="About Us" icon={<LucideInfo size={22} />} />
          <NavItem to="/contact" title="Contact Us" icon={<LucideMail size={22} />} />

          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <LucideUser size={22} />
                <span className="hidden sm:inline">{user.name}</span>
              </div>

              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Logout"
              >
                Logout
              </motion.button>
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
            </div>
          )}
        </div>
      </div>

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
        />
      )}
    </Link>
  </motion.div>
);

export default Navbar;
