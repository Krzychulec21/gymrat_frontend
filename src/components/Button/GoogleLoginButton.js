import React from 'react';

const GoogleLoginButton = () => {
    const googleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
            <button onClick={googleLogin}>Login with Google</button>
    );
};

export default GoogleLoginButton;
