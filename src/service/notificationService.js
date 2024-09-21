import webSocketService from "./websocketService";

export const connectToNotifications = (onNotificationReceived) => {
    const destination = '/user/queue/notifications';
    webSocketService.subscribe(destination, (message) => {
        console.log("Received notification: ", message.body);
        onNotificationReceived(JSON.parse(message.body));
    });
};