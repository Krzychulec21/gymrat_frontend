import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;


export const connectToWebSocket = (chatRoomId, onMessageReceived) => {
    const socket = new SockJS('http://localhost:8080/ws');

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('WebSocket connected, subscribing to chat room:', chatRoomId);

            setTimeout(() => {
                stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
                    console.log("Received message: ", message.body);
                    onMessageReceived(message);
                });
                console.log('Subscription registered');
            }, 500);
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message'], frame.body);
        },
        onWebSocketError: (error) => {
            console.error('WebSocket error:', error);
        },
        debug: (str) => {
            console.log(new Date(), str);
        }
    });

    stompClient.activate();
};


export const sendMessage = (chatRoomId, message) => {
    if (stompClient && stompClient.connected) {
        console.log("Sending message to chatRoomId: ", chatRoomId, message);
        stompClient.publish({
            destination: `/app/chat.sendMessage`,  // destination to match backend mapping
            body: JSON.stringify(message)
        });
    } else {
        console.error('WebSocket is not connected.');
    }
};
