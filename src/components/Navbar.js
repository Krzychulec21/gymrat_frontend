import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomButton from './Button/CustomButton';

function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <CustomButton to="/" >Home</CustomButton>
            {isAuthenticated ? (
                <CustomButton onClick={logout} >Logout</CustomButton>
            ) : (
                <nav style={{ float: 'right' }}>
                    <CustomButton to="/auth" >Join Us</CustomButton>
                </nav>
            )}
        </nav>
    );
}

export default Navbar;
