import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state with user data from sessionStorage if available
    const [user, setUser] = useState(() => {
        const storedEmail = sessionStorage.getItem('email');
        const storedToken = sessionStorage.getItem('token');
        return storedEmail && storedToken ? { name: storedEmail } : null;
    });

    const navigate = useNavigate();

    // Persist user data to sessionStorage whenever it changes
    useEffect(() => {
        if (user) {
            sessionStorage.setItem('email', user.name);
            // Note: Token is typically set during login, not here, unless user object includes it
        } else {
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('token');
        }
    }, [user]);

    // Login function to be used by components
    const login = (userData, token) => {
        // userData should include at least { name: email }
        // token is the authentication token from your backend
        setUser({ name: userData.name });
        sessionStorage.setItem('email', userData.name);
        sessionStorage.setItem('token', token);
    };

    // Logout function to clear user data and navigate to home page
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
        navigate('/'); // Navigate to home page
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