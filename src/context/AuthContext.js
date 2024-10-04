import React, {createContext, useContext, useState, useEffect, useRef} from 'react';
import authService from '../service/authService';
import {jwtDecode} from "jwt-decode";
import webSocketService from "../service/websocketService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const logoutTimeRef = useRef(null);

    useEffect(() => {
        const token = authService.getToken();
        if (token !== null) {
            try {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp * 1000;
                const currentTime = Date.now();

                if (expirationTime < currentTime) {
                    logout();
                }
                else {
                    setIsAuthenticated(true);
                    webSocketService.connect(token);

                    if (logoutTimeRef.current) {
                        clearTimeout(logoutTimeRef.current);
                    }
                    const timeout = expirationTime - currentTime - 60000;
                    if (timeout > 0) {
                        logoutTimeRef.current = setTimeout(() => {
                            logout();
                        }, timeout);
                    }
                }
            } catch (error) {
                console.error(error);
                logout();
            }
        }
    }, []);

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        webSocketService.disconnect();
        if (logoutTimeRef.current) {
            clearTimeout(logoutTimeRef.current);
        }
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);