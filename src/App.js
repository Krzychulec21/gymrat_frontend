import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {NotificationsProvider} from './context/NotificationContext';
import {ThemeProvider} from '@mui/material/styles';
import Layout from "./utils/Layout";
import theme from "./utils/theme"
import {CssBaseline} from "@mui/material";
import {AvatarProvider} from "./context/AvatarContext";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AuthProvider>
                <NotificationsProvider>
                    <AvatarProvider>
                        <Router>
                            <Layout/>
                        </Router>
                    </AvatarProvider>
                </NotificationsProvider>
            </AuthProvider>
        </ThemeProvider>

    );
}

export default App;
