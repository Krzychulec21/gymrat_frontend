import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../components/button/CustomButton";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
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
