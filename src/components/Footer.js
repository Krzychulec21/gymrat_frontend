import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#000',
                color: '#fff',
                position: 'static',
                left: 0,
                width: '100%',
                textAlign: 'center',
                py: 2,
                mt: 'auto',
                borderTop: '3px solid white'
            }}
        >
            <Typography variant="h7">
                GYMRAT©  2024
            </Typography>
        </Box>
    );
}

export default Footer;
