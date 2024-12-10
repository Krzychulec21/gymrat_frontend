import axiosInstance from '../utils/axiosInstance';


export const getUserAvatar = async (userId) => {
    try {
        const url = userId ? `/personal-info/${userId}/avatar` : '/personal-info/avatar';
        const response = await axiosInstance.get(url, {
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
};

export const updatePersonalInfo = async (data) => {
    const response = await axiosInstance.patch('/personal-info', data);
    return response.data;
};

export const getUserPersonalInfo = async (userId) => {
    try {
        const url = userId ? `/personal-info/${userId}` : '/personal-info';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch personal info:", error);
        throw error;
    }
};

export const getUser = async (userId) => {
    try {
        const url = userId ? `/user/${userId}` : '/user';
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/user');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        throw error;
    }
};

export const getAllUsers = async (page = 0, size = 8, sortBy = 'lastName', sortDir = 'asc') => {
    try {
        const response = await axiosInstance.get('/user/users', {
            params: {
                page: page,
                size: size,
                sortBy: sortBy,
                sortDir: sortDir
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch current user:", error);
        throw error;
    }
}

export const blockUser = async (userId) => {
    try {
        await axiosInstance.patch(`/user/${userId}/block`);
    } catch (error) {
        console.error("Failed to block user", error);
    }
};

export const warnUser = async (userId, values) => {
    try {
        console.log("wyslane descriptin" + values)
         await axiosInstance.post(`/user/${userId}/warn`, {
             description: values.warningMessage
         });
    } catch (error) {
        console.error("Failed to warn user", error);
    }
};




