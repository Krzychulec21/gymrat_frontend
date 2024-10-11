import axiosInstance from '../utils/axiosInstance';


export const getUserAvatar = async () => {
    try {
        const response = await axiosInstance.get('/avatar', {
            responseType: 'arraybuffer',
        });

        const base64Image = btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),''
            )
        );
        return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
        throw error;
    }
}

export const updatePersonalInfo = async (data) => {
    const response = await axiosInstance.patch('/personal-info', data);
    return response.data;
};

export const getUserPersonalInfo = async () => {
    try {
        const response = await axiosInstance.get('/personal-info');
        console.log("Personal Info response:", response.data); // Dodaj logowanie
        return response.data;
    } catch (error) {
        console.error("Failed to fetch personal info:", error);
        throw error;
    }
};

export const getUser = async () => {
    try {
        const response = await axiosInstance.get('/user');
        console.log("User response:", response.data); // Dodaj logowanie
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;
    }
};



