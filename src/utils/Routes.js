import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../pages/Home";
import AuthPage from "../pages/AuthPage";
import OAuth2RedirectHandler from "../components/OAuth2RedirectHandler";
import FriendPage from "../pages/FriendPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;
