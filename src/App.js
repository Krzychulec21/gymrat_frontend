import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {NotificationsProvider} from './context/NotificationContext';
import { ThemeProvider} from '@mui/material/styles';
import Layout from "./utils/Layout";
import theme from "./utils/theme"
import {CssBaseline} from "@mui/material";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
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
