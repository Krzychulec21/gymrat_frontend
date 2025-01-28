import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {connectToNotifications} from "../service/notificationService";
import {useAuth} from "./AuthContext";
import websocketService from "../service/websocketService";

const NotificationsContext = createContext();

export const NotificationsProvider = ({children}) => {
    const [aggregatedNotifications, setAggregatedNotifications] = useState([]);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;

        axiosInstance.get('/notifications/unread')
            .then(response => {
                const aggregated = aggregateNotifications(response.data);
                setAggregatedNotifications(aggregated);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });

        connectToNotifications((notification) => {
            setAggregatedNotifications((prevNotifications) => aggregateAndAddNotification(prevNotifications, notification));
        });

        return () => {
            websocketService.unsubscribe('/user/queue/notifications');
        };
    }, [isAuthenticated]);


    const aggregateNotifications = (notificationsList) => {
        const aggregated = [];

        notificationsList.forEach(notification => {
            if (notification.notificationType === 'MESSAGE') {
                const existing = aggregated.find(n => n.senderEmail === notification.senderEmail && n.notificationType === 'MESSAGE');
                if (existing) {
                    existing.count += 1;
                    existing.ids.push(notification.id);
                    if (new Date(notification.timestamp) > new Date(existing.lastTimestamp)) {
                        existing.lastMessage = notification.content;
                        existing.lastTimestamp = notification.timestamp;
                    }
                } else {
                    aggregated.push({
                        id: notification.id,
                        content: notification.content,
                        timestamp: notification.timestamp,
                        notificationType: notification.notificationType,
                        isRead: notification.isRead,
                        senderName: notification.senderName,
                        senderEmail: notification.senderEmail,
                        count: 1,
                        ids: [notification.id],
                    });
                }
            } else {
                aggregated.push({
                    id: notification.id,
                    content: notification.content,
                    timestamp: notification.timestamp,
                    notificationType: notification.notificationType,
                    isRead: notification.isRead,
                    senderName: notification.senderName,
                    senderEmail: notification.senderEmail,
                    count: 1, // Single notification
                    relatedResourceId: notification.relatedResourceId,
                    ids: [notification.id],
                });
            }
        });

        return aggregated;
    };


    const aggregateAndAddNotification = (currentNotifications, newNotification) => {
        if (newNotification.notificationType === 'MESSAGE') {
            const existing = currentNotifications.find(n => n.senderEmail === newNotification.senderEmail && n.notificationType === 'MESSAGE');
            if (existing) {
                return currentNotifications.map(n => {
                    if (n.senderEmail === newNotification.senderEmail && n.notificationType === 'MESSAGE') {
                        return {
                            ...n,
                            count: n.count + 1,
                            lastMessage: newNotification.content,
                            lastTimestamp: newNotification.timestamp,
                            ids: [...n.ids, newNotification.id],
                        };
                    }
                    return n;
                });
            } else {
                return [...currentNotifications, {
                    id: newNotification.id,
                    content: newNotification.content,
                    timestamp: newNotification.timestamp,
                    notificationType: newNotification.notificationType,
                    isRead: newNotification.isRead,
                    senderName: newNotification.senderName,
                    senderEmail: newNotification.senderEmail,
                    count: 1,
                    ids: [newNotification.id],
                }];
            }
        } else {
            return [...currentNotifications, {
                id: newNotification.id,
                content: newNotification.content,
                timestamp: newNotification.timestamp,
                notificationType: newNotification.notificationType,
                isRead: newNotification.isRead,
                senderName: newNotification.senderName,
                senderEmail: newNotification.senderEmail,
                count: 1,
                relatedResourceId: newNotification.relatedResourceId,
                ids: [newNotification.id],
            }];
        }
    };


    const markNotificationsAsRead = () => {
        const updatedNotifications = aggregatedNotifications.map(notification => ({
            ...notification,
            isRead: true,
        }));
        setAggregatedNotifications(updatedNotifications);

        updatedNotifications.forEach((notification) => {
            if (!notification.deletionScheduled && notification.isRead) {
                notification.deletionScheduled = true;
                setTimeout(() => {
                    setAggregatedNotifications((prevNotifications) =>
                        prevNotifications.filter(n => n.id !== notification.id)
                    );
                }, 100000);
            }
        });


        const ids = updatedNotifications.flatMap(n => n.ids);
        axiosInstance.post('/notifications/read', ids)
            .catch(error => {
                console.error('Error marking notifications as read:', error);
            });
    };

    return (
        <NotificationsContext.Provider value={{notifications: aggregatedNotifications, markNotificationsAsRead}}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationsContext);
