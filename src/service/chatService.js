import axiosInstance from '../utils/axiosInstance';
import websocketService from "./websocketService";


export const getChatRoomId = async (currentUserId, friendId) => {
    try {

        const response = await axiosInstance.get(`/chat/room?senderId=${currentUserId}&receiverId=${friendId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat room ID:", error);
        return null;
    }
};


export const getChatHistory = async (chatRoomId) => {
    try {
        const response = await axiosInstance.get(`/chat/history/${chatRoomId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
};

//WebSocket methods

export const connectToChatRoom = (chatRoomId, onMessageReceived) => {
    const destination = `/user/queue/chat/${chatRoomId}`;
    websocketService.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body);
        onMessageReceived(parsedMessage);
    });
};

export const sendMessage = (chatRoomId, message) => {
    const destination = '/app/chat.sendMessage';
    websocketService.send(destination, message);
};

