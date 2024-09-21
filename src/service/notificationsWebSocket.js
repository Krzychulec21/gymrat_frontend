
import { Client } from '@stomp/stompjs';
import authService from './authService';

let stompClient = null;

export const connectToNotificationsWebSocket = (onMessageReceived) => {
    const token = encodeURIComponent(authService.getToken());
    const wsUrl = `ws://localhost:8080/ws?token=${token}`;

    stompClient = new Client({
        brokerURL: wsUrl,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('Connected to notifications WebSocket');

            stompClient.subscribe('/user/queue/notifications', (message) => {
                console.log("Received notification: ", message.body);
                onMessageReceived(message);
            });
        },
        debug: (str) => {
            console.log(new Date(), str);
        }
    });

    stompClient.activate();

    return () => {
        if (stompClient) {
            stompClient.deactivate();
        }
    };
};
