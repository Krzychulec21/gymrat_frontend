import React, {useState} from 'react';
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
import CustomButton from "./button/CustomButton";
import {useNotifications} from "../context/NotificationContext";
import MenuItemComponent from "./MenuItemComponent";

function Navbar() {
    const {isAuthenticated, logout} = useAuth();
    const {notifications, markNotificationsAsRead} = useNotifications();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

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
        {label: 'Friends', to: '/friends', type: 'navigate'},
        {label: 'Plans', to: '/plans', type: 'navigate'},
        {label: 'Challenges', to: '/challenges', type: 'navigate'},
    ];

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
                                marginTop: '1vh',
                            }}
                        />
                    </Link>
                </Box>

                {/* Non-Authenticated Menu Items */}
                {!isAuthenticated && (
                    <>
                        <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/auth')}
                            sx={{
                                display: {xs: 'flex', md: 'flex'},
                                fontSize: {xs: '0.75rem', md: '1rem'},
                            }}
                        >
                            Join Us
                        </CustomButton>
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
                            <Badge badgeContent={notifications.length} color="error">
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
                            <Avatar alt="Profile Picture"/>
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
                            <MenuItem onClick={() => {
                                navigate('/friends');
                                handleMenuClose();
                            }}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
