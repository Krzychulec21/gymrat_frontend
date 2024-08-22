import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../service/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);