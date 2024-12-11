import {Navigate, Outlet} from "react-router-dom";
import authService from "../service/authService";
import {useAuth} from "../context/AuthContext";

const PrivateRoute = ({ adminOnly = false }) => {
    const { isAuthenticated } = useAuth();
    const role = authService.getRole();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (adminOnly && role !== 'ROLE_ADMIN') {
        return <Navigate to="/profile" />;
    }

    if (!adminOnly && role === 'ROLE_ADMIN' && window.location.pathname !== '/admin/dashboard') {
        return <Navigate to="/admin/dashboard" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
