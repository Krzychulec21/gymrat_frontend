import {Client} from '@stomp/stompjs';
import authService from './authService';

let stompClient = null;

export const connectToNotificationsWebSocket = (onMessageReceived) => {
    const token = encodeURIComponent(authService.getToken());
    const wsUrl = `ws://localhost:8080/ws?token=${token}`;

    stompClient = new Client({
        brokerURL: wsUrl,
        reconnectDelay: 5000,
        onConnect: () => {

            stompClient.subscribe('/user/queue/notifications', (message) => {
                onMessageReceived(message);
            });
        },
        debug: (str) => {
        }
    });

    stompClient.activate();

    return () => {
        if (stompClient) {
            stompClient.deactivate();
        }
    };
};
