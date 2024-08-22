import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { Box, Button } from '@mui/material';
import logo from '../assets/logo.svg';

function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2}}>
            <img src={logo} alt="App Logo" style={{width: '8vw', marginBottom: '20px'}}/>
            <Box sx={{display: 'flex', gap: 5, mb: 2, marginBottom: '20px'}}>
                <Button
                    onClick={() => setIsSignUp(false)}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: !isSignUp ? 'darkred' : 'darkgray'
                        },
                        borderBottom: !isSignUp ? '2px solid red' : 'none',
                        fontWeight: !isSignUp ? 'bold' : 'normal',
                        borderRadius: 0,
                        width: '10vw'
                    }}
                >
                    Sign In
                </Button>
                <Button
                    onClick={() => setIsSignUp(true)}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: isSignUp ? 'darkred' : 'darkgray'
                        },
                        borderBottom: isSignUp ? '2px solid red' : 'none',
                        fontWeight: isSignUp ? 'bold' : 'normal',
                        borderRadius: 0,
                        width: '10vw'
                    }}
                >
                    Sign Up
                </Button>
            </Box>
            {isSignUp ? <SignUp/> : <SignIn/>}
        </Box>
    );
}

export default AuthPage;
