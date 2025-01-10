import {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import authService from '../../service/authService';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const hasExecutedRef = useRef(false);

    useEffect(() => {
        if (hasExecutedRef.current) return;
        hasExecutedRef.current = true;

        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
            console.log("Setting token in localStorage:", token);
            authService.setToken(token);
            console.log("Token set in localStorage");
            navigate('/');
        } else {
            console.log("No token found, redirecting to auth");
            navigate('/auth');
        }
    }, [navigate]);

    return null;
};

export default OAuth2RedirectHandler;
