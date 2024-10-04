import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import Button from "@mui/material/Button";


const GoogleLogin = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <Button variant="google" onClick={handleLogin}>
            <GoogleIcon style={{color: '#4285F4', marginRight: 8}}/>
            Login with Google
        </Button>
    );
};

export default GoogleLogin;
