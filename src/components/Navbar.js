// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Box, Badge, List, ListItem, ListItemText} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import CustomButton from "./button/CustomButton";
import {useNotifications} from "../context/NotificationContext";

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const { notifications, markNotificationsAsRead } = useNotifications();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page
        handleMenuClose();
    };

    const handleNotificationsOpen = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
        markNotificationsAsRead();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar sx={{ alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, marginTop: '10px' }}>
                    <Link to="/">
                        <img src={logo} alt="App Logo" style={{ width: '5vw' }} />
                    </Link>
                </Box>
                {isAuthenticated ? (
                    <>
                        <IconButton color="inherit" onClick={handleNotificationsOpen}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={notificationsAnchorEl}
                            open={Boolean(notificationsAnchorEl)}
                            onClose={handleNotificationsClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <List sx={{ width: '350px' }}>
                                {notifications.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="No new notifications" />
                                    </ListItem>
                                ) : (
                                    notifications.map((notification, index) => (
                                        <ListItem key={index} divider>
                                            <ListItemText
                                                primary={
                                                    notification.notificationType === 'MESSAGE' && notification.count > 1
                                                        ? `You have ${notification.count} new messages from ${notification.senderName}`
                                                        : notification.notificationType === 'MESSAGE'
                                                            ? `You have a new message from ${notification.senderName}`
                                                            : notification.senderEmail === null
                                                                ? `System Notification: ${notification.content}`
                                                                : notification.content
                                                }
                                                secondary={new Date(notification.timestamp).toLocaleString()}
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Menu>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <Avatar alt="Profile Picture" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={() => { navigate('/friends'); handleMenuClose(); }}>Friends</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <CustomButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/auth')}
                        sx={{ marginLeft: 'auto' }}
                    >
                        Join Us
                    </CustomButton>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
