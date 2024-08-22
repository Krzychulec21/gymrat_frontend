import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import {styled} from "@mui/material";

const StyledButton = styled(Button)(({theme}) => ({
    backgroundColor: 'red',
    color: 'white',
    margin: '20px',
    '&:hover': {
        backgroundColor: 'darkred',
    },
}));
export default function CustomButton({ children, to, type = 'button', variant = 'contained', ...props }) {
    return (
        <StyledButton
            component={to ? Link : 'button'}
            to={to}
            type={to ? undefined : type}
            variant={variant}
            {...props}
        >
            {children}
        </StyledButton>
    );
}
