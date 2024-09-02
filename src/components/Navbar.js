import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomButton from './Button/CustomButton';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page
    };

    return (
        <nav>
            <CustomButton to="/" >Home</CustomButton>
            {isAuthenticated ? (
                <CustomButton onClick={handleLogout} >Logout</CustomButton>
            ) : (
                <nav style={{ float: 'right' }}>
                    <CustomButton to="/auth" >Join Us</CustomButton>
                </nav>
            )}
        </nav>
    );
}

export default Navbar;
