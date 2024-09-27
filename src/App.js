import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import FriendPage from './pages/FriendPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Footer from "./components/Footer";
import {Box} from "@mui/material"; // Import ThemeProvider and createTheme from @mui/material/styles

const theme = createTheme({
    typography: {
        fontSize: 14,
        pxToRem: (size) => `${size / 16}rem`,
    },
    spacing: 8,
});

function Layout() {
    const location = useLocation();
    const showNavbar = location.pathname !== '/auth';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            {showNavbar && <Navbar />}
            <Box
                sx={{
                    flex: '1 0 auto'
                }}
            >
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                    <Route path="/friends" element={<FriendPage />} />
                </Routes>
            </Box>
            <Footer />
        </Box>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <NotificationsProvider>
                    <Router>
                        <Layout />
                    </Router>
                </NotificationsProvider>
            </AuthProvider>
        </ThemeProvider>

    );
}

export default App;
