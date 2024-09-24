// websocketService.js
import { Client } from '@stomp/stompjs';
import authService from "./authService";

class WebsocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = {};
        this.activeSubscriptions = {};
        this.connected = false;
    }

    connect() {
        const token = encodeURIComponent(authService.getToken());
        if(!token || token === "null") {
            console.warn("No token found");
            return;
        }

        if (this.stompClient && this.stompClient.connected) {
            console.log("WebSocket is already connected");
            return;
        }

        const wsUrl = `ws://localhost:8080/ws?token=${token}`;

        this.stompClient = new Client({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            onConnect: () => {
                this.connected = true;
                console.log("Connected to WebSocket");
                this.reconnectSubscriptions();
            },
            onDisconnect: () => {
                this.connected = false;
                console.log("WebSocket disconnected");
            },
            onStompError: (frame) => {
                console.error("STOMP error: ", frame.headers["message"], frame.body);
            },
            onWebSocketError: (error) => {
                console.error("WebSocket error: ", error);
            }
        });

        this.stompClient.activate();
    }

    reconnectSubscriptions() {
        if (!this.connected) return;
        console.log("Reconnecting subscriptions...");
        for (const [destination, callback] of Object.entries(this.subscriptions)) {
            this.subscribe(destination, callback);
        }
    }

    subscribe(destination, callback) {
        if (!this.subscriptions[destination]) {
            this.subscriptions[destination] = callback;
            console.log(`Stored subscription callback for ${destination}`);
        } else {
            console.log(`Subscription callback already stored for ${destination}`);
        }

        if (!this.stompClient) {
            console.warn("STOMP client is not initialized. Initializing connection...");
            this.connect();
            return;
        }

        if (!this.connected) {
            console.warn(`WebSocket is not connected. Subscription to ${destination} will be established upon connection.`);
            return;
        }

        if (this.activeSubscriptions[destination]) {
            console.log(`Already subscribed to ${destination}`);
            return;
        }

        const subscription = this.stompClient.subscribe(destination, callback);
        this.activeSubscriptions[destination] = subscription;
        console.log(`Subscribed to ${destination}`);
    }

    unsubscribe(destination) {
        if (this.activeSubscriptions[destination]) {
            this.activeSubscriptions[destination].unsubscribe();
            delete this.activeSubscriptions[destination];
            console.log(`Unsubscribed from ${destination}`);
        }

        if (this.subscriptions[destination]) {
            delete this.subscriptions[destination];
            console.log(`Removed subscription callback for ${destination}`);
        }
    }

    send(destination, message) {
        if (this.stompClient && this.connected) {
            this.stompClient.publish({
                destination: destination,
                body: JSON.stringify(message)
            });
            console.log(`Sent message to ${destination}: `, message);
        }
        else {
            console.error("WebSocket is not connected. Cannot send message.");
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.connected = false;
            console.log("WebSocket disconnected");
        }
    }
}

const webSocketService = new WebsocketService();
export default webSocketService;
