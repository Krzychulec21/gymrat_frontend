import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Box, } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import CustomButton from "./Button/CustomButton";

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

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

    return (
        <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar sx={{alignItems:'center'}}>
                <Box sx={{ flexGrow: 1, marginTop: '10px' }}>
                    <Link to="/">
                        <img src={logo} alt="App Logo" style={{ width: '5vw' }} />
                    </Link>
                </Box>
                {isAuthenticated ? (
                    <>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <Avatar alt="Profile Picture" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
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
