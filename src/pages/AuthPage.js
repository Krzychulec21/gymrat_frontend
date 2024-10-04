import React, {useState} from 'react';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import {Box, Button} from '@mui/material';
import logo from '../assets/logo.svg';
import {Link, useNavigate} from 'react-router-dom';

function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt:3,
            mb:12
        }}>
            <Link to="/" style={{textDecoration: 'none'}}>
                <img src={logo} alt="App Logo" style={{width: '8vw', marginBottom: '20px'}}/>
            </Link>
            <Box sx={{display: 'flex', gap: 5, mb: 2, marginBottom: '20px'}}>
                <Button
                    onClick={() => setIsSignUp(false)}
                    variant="text"
                    sx={{
                        color: 'white',
                        backgroundColor:'inherit',
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
                    variant="text"
                    sx={{
                        color: 'white',
                        backgroundColor:'inherit',
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
            <Button variant="contained" onClick={handleClick} sx={{
                backgroundColor: 'inherit',
                border: '2px solid red',
                mt:2,
                ml:3,
                alignSelf: 'flex-start'
            }}>Wróc do strony głównej</Button>
        </Box>
    );
}

export default AuthPage;
