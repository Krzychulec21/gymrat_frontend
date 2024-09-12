import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {pem as jwt} from "node-forge";

const API_URL = 'http://localhost:8080/api/v1/auth';

const authService = {
    handleToken: (token) => {
        const decodedToken = jwtDecode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('email', decodedToken.sub);
        localStorage.setItem('id', decodedToken.id);
    },

    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/authenticate`, credentials);
        authService.handleToken(response.data.token);
    },
    register: async (data) => {
        const response = await axios.post(`${API_URL}/register`, data);
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
    }
};

export default authService;
