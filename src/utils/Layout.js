import {Route, Routes, useLocation} from "react-router-dom";
import {Box} from "@mui/material";
import React from "react";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import AuthPage from "../pages/AuthPage";
import OAuth2RedirectHandler from "../components/OAuth2RedirectHandler";
import FriendPage from "../pages/FriendPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import Footer from "../components/Footer";

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
                <>
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
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Box>
                    <Footer />
                </>

        </Box>
    );
}

export default Layout;
