import axiosInstance from "../utils/axiosInstance";

export const getFriends = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get('/friends', {
            params: {
                page: page,
                size: size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching friends', error);
        throw error;
    }
};

export const getPendingRequests = async () => {
    try{
        const response = await axiosInstance.get('/friends/pending-requests');
        return response.data;
    }
    catch (error) {
        console.error('Error fetching pending requests', error);
        throw error;
    }
};

export const getUsersWithRequestStatus = async () => {
    try {
        const response = await axiosInstance.get("/friends/users-with-request-status");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const sendFriendRequest = async (receiverEmail) => {
    try {
        await axiosInstance.post('/friends/send-request', {email: receiverEmail});
    } catch (error) {
        console.error('Error sending friend request', error);
        throw error;
    }
};

export const respondToFriendRequest = async (requestId, accepted) => {
    try {
        const data = { requestId, accepted };
        await axiosInstance.post('/friends/respond-request', data);
    } catch (error) {
        console.error('Error responding to friend request', error);
        throw error;
    }
};


export const removeFriend = async (friendEmail) => {
    try {
        await axiosInstance.delete('/friends/remove-friend', {
            params: { friendEmail: friendEmail}
        });
    } catch (error) {
        console.error('Error removing friend', error);
        throw error;
    }
}

export const searchUsersWithRequestStatus = async (query, page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get('/friends/search', {
            params: {
                query: query,
                page: page,
                size: size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching friends', error);
        throw error;
    }
};



