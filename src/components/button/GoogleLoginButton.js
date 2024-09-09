import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google'; // Dodaj to po zainstalowaniu @mui/icons-material

const GoogleLoginButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    color: '#757575',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        backgroundColor: '#f5f5f5',
        border: '1px solid #bbb',
    },
}));

const GoogleLogin = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <GoogleLoginButton onClick={handleLogin}>
            <GoogleIcon style={{ color: '#4285F4', marginRight: 8 }} />
            Login with Google
        </GoogleLoginButton>
    );
};

export default GoogleLogin;
