import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_URL = 'http://localhost:8080/api/v1/auth';

const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/authenticate`, credentials);
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email)
    },
    register: async (data) => {
        const response = await axios.post(`${API_URL}/register`, data);
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email)
    },
    logout: () => {
        localStorage.removeItem('token');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    setToken: (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email)
    }
};

export default authService;
