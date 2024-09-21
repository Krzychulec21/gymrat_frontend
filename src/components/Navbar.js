// Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Box, Badge, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import CustomButton from "./button/CustomButton";

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
                            <List>
                                {notifications.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="Brak nowych powiadomień" />
                                    </ListItem>
                                ) : (
                                    notifications.map((notification) => (
                                        <ListItem key={notification.id}>
                                            <ListItemText primary={notification.content} secondary={new Date(notification.timestamp).toLocaleString()} />
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
