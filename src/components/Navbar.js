import React, {useContext, useState} from 'react';
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
import {useNavigate} from 'react-router-dom';
import logo from '../assets/logo.svg';
import {useNotifications} from "../context/NotificationContext";
import MenuItemComponent from "./MenuItemComponent";
import Button from "@mui/material/Button";
import {AvatarContext} from "../context/AvatarContext";
import {useTranslation} from "react-i18next";

function Navbar() {
    const {isAuthenticated, logout} = useAuth();
    const {notifications, markNotificationsAsRead} = useNotifications();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const {avatar, refreshAvatar} = useContext(AvatarContext);
    const {t} = useTranslation('navbar');


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
        {label: t("homePage"), to: 'home', type: 'scroll'},
        {label: t("plans"), to: 'plans', type: 'scroll'},
        {label: t("community"), to: 'community', type: 'scroll'},
        {label: t("stats"), to: 'stats', type: 'scroll'},
        {label: t("challenges"), to: 'challenges', type: 'scroll'},
    ];

    const authMenuItems = [
        {label: t("friends"), to: '/friends', type: 'navigate'},
        {label: t("plans"), to: '/plans', type: 'navigate'},
        {label: t("challenges"), to: '/challenges', type: 'navigate'},
        {label: t("stats"), to: '/stats', type: 'navigate'}
    ];

    const handleNotificationClick = (notification) => {
        if (notification.notificationType === 'COMMENT' && notification.relatedResourceId) {
            navigate(`/plans/${notification.relatedResourceId}`);
        } else if (notification.notificationType === 'MESSAGE') {
            navigate('/friends');
        } else if (notification.notificationType === 'FRIEND_REQUEST') {
            navigate('/friends');
        } else {
        }
        setNotificationsAnchorEl(null);
    };


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

                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenuOpen}
                    sx={{display: {xs: 'flex', md: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>

                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        padding: 1,
                        justifyContent: {
                            md: 'left', xs: 'center'
                        },
                    }}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="App Logo"
                        sx={{
                            width: {sm: '6vw', md: '5vw', xs: '15vw'},
                            cursor: 'pointer',
                        }}
                    />
                </Box>

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
                            {t("signIn")}
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
                                        <ListItemText primary="Brak powiadomień"/>
                                    </ListItem>
                                ) : (
                                    notifications.map((notification, index) => (
                                        <ListItem key={index}
                                                  divider
                                                  sx={{
                                                      cursor: 'pointer',
                                                      backgroundColor: notification.notificationType === 'WARN' ? 'red' : 'inherit',
                                                  }}
                                                  onClick={() => handleNotificationClick(notification)}>
                                            <ListItemText
                                                primary={
                                                    notification.notificationType === 'MESSAGE' && notification.count > 1
                                                        ? `Masz ${notification.count} nowych wiadomości od ${notification.senderName}`
                                                        : notification.notificationType === 'MESSAGE'
                                                            ? `Masz nową wiadomość od ${notification.senderName}`
                                                            : notification.senderEmail === null
                                                                ? `System: ${notification.content}`
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
                            <Avatar src={avatar}/>
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
                                }}>{t("profile")}</MenuItem>
                            <MenuItem
                                onClick={handleLogout}>{t("signOut")}</MenuItem>
                        </Menu>
                    </>
                )}

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
