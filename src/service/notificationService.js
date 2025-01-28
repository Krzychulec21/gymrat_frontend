import webSocketService from "./websocketService";

export const connectToNotifications = (onNotificationReceived) => {
    const destination = '/user/queue/notifications';
    webSocketService.subscribe(destination, (message) => {
        onNotificationReceived(JSON.parse(message.body));
    });
};