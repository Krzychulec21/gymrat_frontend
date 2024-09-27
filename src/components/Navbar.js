import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Box, Badge, List, ListItem, ListItemText, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import CustomButton from "./button/CustomButton";
import { useNotifications } from "../context/NotificationContext";

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const { notifications, markNotificationsAsRead } = useNotifications();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

    // eslint-disable-next-line no-restricted-globals
    const isHomePage = location.pathname === '/';

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsOpen = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
        markNotificationsAsRead();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleMenuClose();
    };

    return (
        <AppBar position="absolute" sx={{ backgroundColor: 'inherit', boxShadow: 'none' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: { xs: 1, md: 2 },
                    paddingRight: { xs: 1, md: 2 },
                }}
            >
                {/* Ikona Menu dla urządzeń mobilnych */}
                {(!isAuthenticated && isHomePage) && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMobileMenuOpen}
                        sx={{
                            display: { xs: 'flex', md: 'none' }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Logo */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: {
                            md:'left',xs:'center'
                        },
                    }}
                >
                    <Link to="/">
                        <Box
                            component="img"
                            src={logo}
                            alt="App Logo"
                            sx={{
                                width: { xs: '20vw', md: '8vw' },
                                cursor: 'pointer',
                                marginTop: '1vh',
                            }}
                        />
                    </Link>
                </Box>

                {/* Przycisk "Join Us" */}
                {!isAuthenticated && (
                    <CustomButton
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/auth')}
                        sx={{
                            display: { xs: 'flex', md: 'flex' },
                            fontSize: { xs: '0.75rem', md: '1rem' },
                        }}
                    >
                        Join Us
                    </CustomButton>
                )}

                {/* Ikony dla zalogowanych użytkowników */}
                {isAuthenticated && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color="inherit" onClick={handleNotificationsOpen}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <Avatar alt="Profile Picture" />
                        </IconButton>
                    </Box>
                )}

                {/* Menu z linkami dla większych ekranów */}
                {(!isAuthenticated && isHomePage) && (
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap:4,
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',

                        }}
                    >
                        <ScrollLink to="home" smooth duration={500}>
                            <Button color="inherit" sx={{ fontSize: '1.2rem' }}>Home</Button>
                        </ScrollLink>
                        <ScrollLink to="plans" smooth duration={500}>
                            <Button color="inherit" sx={{ fontSize: '1.2rem' }}>Plans</Button>
                        </ScrollLink>
                        <ScrollLink to="community" smooth duration={500}>
                            <Button color="inherit" sx={{ fontSize: '1.2rem' }}>Community</Button>
                        </ScrollLink>
                        <ScrollLink to="stats" smooth duration={500}>
                            <Button color="inherit" sx={{ fontSize: '1.2rem' }}>Stats</Button>
                        </ScrollLink>
                        <ScrollLink to="challenges" smooth duration={500}>
                            <Button color="inherit" sx={{ fontSize: '1.2rem' }}>Challenges</Button>
                        </ScrollLink>
                    </Box>
                )}

                {/* Mobile Menu */}
                <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={Boolean(mobileMenuAnchorEl)}
                    onClose={handleMobileMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                    <MenuItem onClick={handleMobileMenuClose}>
                        <ScrollLink to="home" smooth duration={500}>Home</ScrollLink>
                    </MenuItem>
                    <MenuItem onClick={handleMobileMenuClose}>
                        <ScrollLink to="plans" smooth duration={500}>Plans</ScrollLink>
                    </MenuItem>
                    <MenuItem onClick={handleMobileMenuClose}>
                        <ScrollLink to="community" smooth duration={500}>Community</ScrollLink>
                    </MenuItem>
                    <MenuItem onClick={handleMobileMenuClose}>
                        <ScrollLink to="stats" smooth duration={500}>Stats</ScrollLink>
                    </MenuItem>
                    <MenuItem onClick={handleMobileMenuClose}>
                        <ScrollLink to="challenges" smooth duration={500}>Challenges</ScrollLink>
                    </MenuItem>
                </Menu>
                {/* User Actions */}
                {isAuthenticated && (
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
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
