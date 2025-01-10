import React from 'react';
import {Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import CustomButton from "../components/button/CustomButton";
import authService from "../service/authService";
import {useAuth} from "../context/AuthContext";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const role = authService.getRole();
    const isAdmin = role === "ADMIN";
    const isLoggedIn = useAuth();
    const handleGoHome = () => {
        if (isLoggedIn) {
            if (isAdmin) {
                navigate('/admin/dashboard')
            } else navigate('/profile')
        } else navigate('/');
    };

    return (
        <Box
            sx={{
                textAlign: 'center',
                paddingTop: '50px',
                paddingBottom: '50px',
            }}
        >
            <Typography variant="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Oops! Taka strona nie istnieje.
            </Typography>
            <CustomButton onClick={handleGoHome}>
                Wróć na stronę główną
            </CustomButton>
        </Box>
    );
};

export default NotFoundPage;
