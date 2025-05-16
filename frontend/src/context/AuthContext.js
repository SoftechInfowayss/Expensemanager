import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state with user data from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const navigate = useNavigate();

    // Persist user data to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Login function to be used by components
    const login = (userData) => {
        setUser(userData);
    };

    // Logout function to clear user data and navigate to home page
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/'); // Navigate to home page
        // Add any other cleanup here (e.g., clearing tokens)
    };

    // Value provided to consumers
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user, // Convenience boolean
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;