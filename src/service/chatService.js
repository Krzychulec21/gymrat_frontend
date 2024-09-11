import axiosInstance from '../utils/axiosInstance';


export const getChatRoomId = async (currentUserId, friendId) => {
    try {

        const response = await axiosInstance.get(`/chat/room?senderId=${currentUserId}&receiverId=${friendId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat room ID:", error);
        return null;
    }
};

// Pobieranie historii wiadomości
export const getChatHistory = async (chatRoomId) => {
    try {
        const response = await axiosInstance.get(`/chat/history/${chatRoomId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
};