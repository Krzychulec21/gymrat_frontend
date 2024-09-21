import {jwtDecode} from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";

const authService = {
    handleToken: (token) => {
        const decodedToken = jwtDecode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('email', decodedToken.sub);
        localStorage.setItem('id', decodedToken.id);
    },

    login: async (credentials) => {
        const response = await axiosInstance.post("/auth/authenticate", credentials);
        authService.handleToken(response.data.token);
    },
    register: async (data) => {
        const response = await axiosInstance.post("/auth/register", data);
        authService.handleToken(response.data.token);
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    setToken: (token) => {
        authService.handleToken(token);
    },
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;
