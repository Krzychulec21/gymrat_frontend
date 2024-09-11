import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

// Inicjalizacja połączenia WebSocket
export const connectToWebSocket = (chatRoomId, onMessageReceived) => {
    //const socket = new SockJS('http://localhost:8080/ws');  // URL backendu
    const socket = new SockJS('http://192.168.0.104:8080/ws');  // Zamień localhost na adres IP komputera

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('WebSocket connected, subscribing to chat room:', chatRoomId);

            // Dodanie opóźnienia, aby upewnić się, że połączenie jest stabilne
            setTimeout(() => {
                stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
                    console.log("Received message: ", message.body);
                    onMessageReceived(message);  // Przekazuje wiadomość do funkcji obsługi
                });
                console.log('Subscription registered');
            }, 500);  // Opóźnienie 500ms
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

    stompClient.activate();  // Uruchomienie połączenia WebSocket
};


// Funkcja wysyłania wiadomości
export const sendMessage = (chatRoomId, message) => {
    if (stompClient && stompClient.connected) {
        console.log("Sending message to chatRoomId: ", chatRoomId, message);
        stompClient.publish({
            destination: `/app/chat.sendMessage`,  // Destination to match backend mapping
            body: JSON.stringify(message)
        });
    } else {
        console.error('WebSocket is not connected.');
    }
};
