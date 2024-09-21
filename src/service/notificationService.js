import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axiosInstance from "../utils/axiosInstance";

export const getUnreadNotifications = async () => {
    try {
        const response = await axiosInstance.get('/notifications/unread');
        return response.data;
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        return [];
    }
};

export const markNotificationsAsRead = async (notificationIds) => {
    try {
        await axiosInstance.post('/notifications/read', notificationIds);
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        throw error;
    }
};

let stompClient = null;


export const connectToNotificationWebSocket = (onNotificationReceived) => {
    const socket = new SockJS('http://localhost:8080/secured/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: (frame) => {
            console.log('Connected to Notification WebSocket');
            console.log('Connected to server:', frame);

            // Wywołaj funkcję subskrypcji po nawiązaniu połączenia
            subscribeToNotifications(onNotificationReceived);
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message'], frame.body);
        },
        onWebSocketError: (error) => {
            console.error('WebSocket error:', error);
        },
        debug: (str) => {
            console.log(new Date(), str);
        },
    });

    stompClient.activate();
};

// Funkcja obsługująca subskrypcję powiadomień
const subscribeToNotifications = (onNotificationReceived) => {
    // Sprawdzamy, czy klient WebSocket jest aktywny i połączony
    if (stompClient && stompClient.connected) {
        stompClient.subscribe('/user/queue/notifications', (message) => {
            console.log('Notification received:', message.body);
            onNotificationReceived(JSON.parse(message.body));
        });
        console.log('Subscription to notifications successful');
    } else {
        console.error('WebSocket is not connected yet. Retrying subscription...');
        setTimeout(() => subscribeToNotifications(onNotificationReceived), 1000);  // Ponów próbę subskrypcji po 1 sekundzie
    }
};