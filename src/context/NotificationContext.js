// NotificationsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { connectToNotificationsWebSocket } from '../service/notificationsWebSocket';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Pobierz nieodczytane powiadomienia
        axiosInstance.get('/notifications/unread')
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });

        // Połącz z WebSocket
        const disconnect = connectToNotificationsWebSocket((notification) => {
            setNotifications(prev => [...prev, JSON.parse(notification.body)]);
        });

        // Odłącz przy unmount
        return () => {
            disconnect();
        };
    }, []);

    const markNotificationsAsRead = () => {
        const ids = notifications.map(n => n.id);
        axiosInstance.post('/notifications/read', ids)
            .then(() => {
                setNotifications([]);
            })
            .catch(error => {
                console.error('Error marking notifications as read:', error);
            });
    };

    return (
        <NotificationsContext.Provider value={{ notifications, markNotificationsAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationsContext);
