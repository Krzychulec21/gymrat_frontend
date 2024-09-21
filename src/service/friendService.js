import axiosInstance from "../utils/axiosInstance";
export const getFriends = async () => {
    try {
        const response = await axiosInstance.get('/friends');
        return response.data;
    } catch (error) {
        console.error('Error fetching friends', error);
        throw error;
    }
};

// Get the list of pending friend requests
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

// Get the list of users with their request status
export const getUsersWithRequestStatus = async () => {
    try {
        const response = await axiosInstance.get("/friends/users-with-request-status");
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Send a friend request to another user
export const sendFriendRequest = async (receiverEmail) => {
    try {
        await axiosInstance.post('/friends/send-request', {email: receiverEmail});
    } catch (error) {
        console.error('Error sending friend request', error);
        throw error;
    }
};

// Respond to a friend request (accept or reject)
export const respondToFriendRequest = async (requestId, accepted) => {
    try {
        const data = { requestId, accepted };
        await axiosInstance.post('/friends/respond-request', data);
    } catch (error) {
        console.error('Error responding to friend request', error);
        throw error;
    }
};

// Remove a friend by email
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



