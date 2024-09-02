import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
