import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#121212',
                color: '#fff',
                position: 'static',
                width: '100%',
                textAlign: 'center',
                py: 2,
                mt: 'auto',
                borderTop: '1px solid white'
            }}
        >
            <Typography variant="body2">
                GYMRAT©  2024
            </Typography>
        </Box>
    );
}

export default Footer;
