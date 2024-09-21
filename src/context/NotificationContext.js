// NotificationsContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {connectToNotifications} from "../service/notificationService";

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

       connectToNotifications((notification) => {
           setNotifications((prevNotifications) => [...prevNotifications, notification]);
       });
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
