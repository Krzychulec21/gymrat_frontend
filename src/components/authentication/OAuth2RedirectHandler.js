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
            authService.setToken(token);
            navigate('/');
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    return null;
};

export default OAuth2RedirectHandler;
