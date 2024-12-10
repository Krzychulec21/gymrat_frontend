import {jwtDecode} from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";

const authService = {
    handleToken: (token) => {
        try {
            const decodedToken = jwtDecode(token);
            localStorage.setItem('token', token);
            localStorage.setItem('email', decodedToken.sub);
            localStorage.setItem('id', decodedToken.id);
        } catch (error) {
            console.error("Invalid token: ", error);
            authService.logout();
        }
    },

    login: async (credentials) => {
        try {
            const response = await axiosInstance.post("/auth/authenticate", credentials);
            authService.handleToken(response.data.token);
        } catch (error) {
            throw error;
        }
    },

    register: async (data) => {
        await axiosInstance.post("/auth/register", data);
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('id');

        window.location.href = '/';
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    setToken: (token) => {
        authService.handleToken(token);
    },
    getToken: () => {
        return localStorage.getItem('token');
    },
    forgotPassword: async (email) => {
        await axiosInstance.post('/auth/forgot-password', {email});
    },

    resetPassword: async (token, newPassword) => {
        await axiosInstance.post(`/auth/reset-password?token=${token}`, {password: newPassword});
    },

    getRole: () => {
        const token = localStorage.getItem('token')
        if (token !== null) {
            const decodedToken = jwtDecode(token);
            return decodedToken.role;
        }
        return "";
    }
};

export default authService;
