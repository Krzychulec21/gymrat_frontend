import React from 'react';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';


export default function CustomButton({ children, to, type = 'button', variant = 'contained', ...props }) {
    return (
        <Button
            component={to ? Link : 'button'}
            to={to}
            type={to ? undefined : type}
            variant={variant}
            {...props}
        >
            {children}
        </Button>
    );
}
