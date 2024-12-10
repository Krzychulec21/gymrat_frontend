import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {NotificationsProvider} from './context/NotificationContext';
import {ThemeProvider} from '@mui/material/styles';
import Layout from "./utils/Layout";
import theme from "./utils/theme"
import {CssBaseline} from "@mui/material";
import {AvatarProvider} from "./context/AvatarContext";
import {SnackbarProvider} from "./context/SnackbarContext";


function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AuthProvider>
                <SnackbarProvider>
                    <NotificationsProvider>
                        <AvatarProvider>
                            <Router>
                                <Layout/>
                            </Router>
                        </AvatarProvider>
                    </NotificationsProvider>
                </SnackbarProvider>
            </AuthProvider>
        </ThemeProvider>

    );
}

export default App;
