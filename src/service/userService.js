import axiosInstance from '../utils/axiosInstance';
export const getCurrentUserId = async () => {
    try {
        const response = await axiosInstance.get('/user/email');
        return response.data;
    } catch (error) {
        console.error("Error fetching current user", error);
        return null;
    }
};

