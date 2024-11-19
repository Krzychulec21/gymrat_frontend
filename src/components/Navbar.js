import React, {useContext, useEffect, useState} from 'react';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useAuth} from '../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../assets/logo.svg';
import {useNotifications} from "../context/NotificationContext";
import MenuItemComponent from "./MenuItemComponent";
import Button from "@mui/material/Button";
import {getUserAvatar} from "../service/userService";
import {AvatarContext} from "../context/AvatarContext";

function Navbar() {
    const {isAuthenticated, logout} = useAuth();
    const {notifications, markNotificationsAsRead} = useNotifications();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const { avatar, refreshAvatar } = useContext(AvatarContext);



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

    const nonAuthMenuItems = [
        {label: 'Home', to: 'home', type: 'scroll'},
        {label: 'Plans', to: 'plans', type: 'scroll'},
        {label: 'Community', to: 'community', type: 'scroll'},
        {label: 'Stats', to: 'stats', type: 'scroll'},
        {label: 'Challenges', to: 'challenges', type: 'scroll'},
    ];

    const authMenuItems = [
        {label: 'Znajomi', to: '/friends', type: 'navigate'},
        {label: 'Plany', to: '/plans', type: 'navigate'},
        {label: 'Wyzwania', to: '/challenges', type: 'navigate'},
        {label: 'Treningi', to: '/stats', type: 'navigate'}
    ];

    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;


    return (
        <AppBar
            position={isAuthenticated ? 'static' : 'absolute'}
            sx={{backgroundColor: 'inherit', boxShadow: 'none'}}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: {xs: 1, md: 2},
                    paddingRight: {xs: 1, md: 2},
                }}
            >
                {/* Mobile Menu Icon */}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenuOpen}
                    sx={{display: {xs: 'flex', md: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>

                {/* Logo */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: {
                            md: 'left', xs: 'center'
                        },
                    }}
                >
                    <Link to="/">
                        <Box
                            component="img"
                            src={logo}
                            alt="App Logo"
                            sx={{
                                width: {sm: '6vw', md: '2vw', xs: '10vw'},
                                cursor: 'pointer',
                            }}
                        />
                    </Link>
                </Box>

                {/* Non-Authenticated Menu Items */}
                {!isAuthenticated && (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/auth')}
                            sx={{
                                display: {xs: 'flex', md: 'flex'},
                                fontSize: {xs: '0.75rem', md: '1rem'},
                            }}
                        >
                            Join Us
                        </Button>
                        <Box
                            sx={{
                                display: {xs: 'none', md: 'flex'},
                                gap: 4,
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            {nonAuthMenuItems.map((item) => (
                                <MenuItemComponent item={item} isMobile={false} key={item.label}/>
                            ))}
                        </Box>
                    </>
                )}

                {isAuthenticated && (
                    <>
                        <Box sx={{
                            display: {xs: 'none', md: 'flex'},
                            gap: 4,
                            alignItems: 'center',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                        >
                            {authMenuItems.map((item) => (
                                <MenuItemComponent item={item} isMobile={false} key={item.label}/>
                            ))}
                        </Box>
                        <IconButton color="inherit" onClick={handleNotificationsOpen}>
                            <Badge badgeContent={unreadNotificationsCount} color="error">
                                <NotificationsIcon/>
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
                            <List sx={{width: '350px'}}>
                                {notifications.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="No new notifications"/>
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
                            <Avatar src={avatar} />
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
                            <MenuItem
                                onClick={() => {
                                    navigate('/profile');
                                    handleMenuClose();
                                }}>Profil</MenuItem>
                            <MenuItem
                                onClick={handleLogout}>Wyloguj</MenuItem>
                        </Menu>
                    </>
                )}

                {/*Mobile menu*/}
                <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={Boolean(mobileMenuAnchorEl)}
                    onClose={handleMobileMenuClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                    transformOrigin={{vertical: 'top', horizontal: 'left'}}
                >
                    {(isAuthenticated ? authMenuItems : nonAuthMenuItems).map((item) => (
                        <MenuItemComponent
                            item={item}
                            isMobile={true}
                            handleClose={handleMobileMenuClose}
                            key={item.label}
                        />
                    ))}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
