import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#000',
                color: '#fff',
                position: 'static', // Ensure footer is positioned normally within parent
                left: 0,
                width: '100%',
                textAlign: 'center',
                py: 2,
                mt: 'auto' // Pushes the footer to the bottom if there's space
            }}
        >
            <Typography variant="h6">
                GYMRAT©  2024
            </Typography>
        </Box>
    );
}

export default Footer;
