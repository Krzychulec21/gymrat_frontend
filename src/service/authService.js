import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/authenticate`, credentials);
        localStorage.setItem('token', response.data.token);
    },
    register: async (data) => {
        const response = await axios.post(`${API_URL}/register`, data);
        localStorage.setItem('token', response.data.token);
    },
    logout: () => {
        localStorage.removeItem('token');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    setToken: (token) => {
        localStorage.setItem('token', token);
    }
};

export default authService;
