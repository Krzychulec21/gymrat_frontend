import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {NotificationsProvider} from './context/NotificationContext';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Layout from "./utils/Layout"; // Import ThemeProvider and createTheme from @mui/material/styles

const theme = createTheme({
    typography: {
        fontSize: 14,
        pxToRem: (size) => `${size / 16}rem`,
    },
    spacing: 8,
});

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
