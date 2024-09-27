import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import {styled} from "@mui/system";

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'red',
    color: 'white',
    margin: '0px',
    padding: theme.spacing(1, 3),
    fontSize: theme.typography.pxToRem(16),

    [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.pxToRem(14),
        padding: theme.spacing(1, 2),
    },

    [theme.breakpoints.up('md')]: {
        fontSize: theme.typography.pxToRem(14),
        padding: theme.spacing(1, 2),
    },

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
