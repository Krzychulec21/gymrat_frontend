import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import SignIn from '../components/authentication/SignIn';
import SignUp from '../components/authentication/SignUp';
import ForgotPassword from '../components/authentication/ForgotPassword';
import ResetPassword from '../components/authentication/ResetPassword';
import {Box, Button} from '@mui/material';
import logo from '../assets/logo.svg';

function AuthPage() {
    const [activeView, setActiveView] = useState('signin');
    const location = useLocation();

    useEffect(() => {

        const params = new URLSearchParams(location.search);
        if (params.get('token')) {
            setActiveView('resetPassword');
        }
    }, [location]);

    const renderActiveView = () => {
        switch (activeView) {
            case 'signin':
                return <SignIn onForgotPassword={() => setActiveView('forgot')}/>;
            case 'signup':
                return <SignUp/>;
            case 'forgot':
                return <ForgotPassword onBackToSignIn={() => setActiveView('signin')}/>;
            case 'resetPassword':
                return <ResetPassword onBackToSignIn={() => setActiveView('signin')}/>;
            default:
                return <SignIn onForgotPassword={() => setActiveView('forgot')}/>;
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 3,
            mb: 12,
            maxWidth: '600px',
            mx: 'auto',
            padding: 4,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            border: '5px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
        }}>
            <Link to="/" style={{textDecoration: 'none'}}>
                <img src={logo} alt="App Logo" style={{width: '8vw', marginBottom: '20px'}}/>
            </Link>
            {activeView !== 'resetPassword' && (
                <Box sx={{display: 'flex', gap: 5, mb: 2, marginBottom: '20px'}}>
                    <Button
                        onClick={() => setActiveView('signin')}
                        variant="text"
                        sx={{
                            color: 'white',
                            backgroundColor: 'inherit',
                            borderBottom: activeView === 'signin' ? '2px solid red' : 'none',
                            fontWeight: activeView === 'signin' ? 'bold' : 'normal',
                            borderRadius: 0,
                            width: '150px',
                        }}
                    >
                        Zaloguj się
                    </Button>
                    <Button
                        onClick={() => setActiveView('signup')}
                        variant="text"
                        sx={{
                            color: 'white',
                            backgroundColor: 'inherit',
                            borderBottom: activeView === 'signup' ? '2px solid red' : 'none',
                            fontWeight: activeView === 'signup' ? 'bold' : 'normal',
                            borderRadius: 0,
                            width: '150px',
                        }}
                    >
                        Utwórz konto
                    </Button>
                </Box>
            )}
            {renderActiveView()}
            <Link to="/" style={{textDecoration: 'none'}}>
                <Button variant="contained" sx={{
                    backgroundColor: 'inherit',
                    border: '2px solid red',
                    mt: 2,
                    alignSelf: 'flex-start'
                }}>Wróc do strony głównej</Button>
            </Link>

        </Box>
    );
}

export default AuthPage;
