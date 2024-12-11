import authService from "../service/authService";
import {Navigate, Outlet} from "react-router-dom";

const PublicRoute = () => {
    const isAuthenticated = authService.isAuthenticated();
    const role = authService.getRole();

    if (isAuthenticated) {
        return <Navigate to={role === "ROLE_ADMIN" ? "/admin/dashboard" : "/profile"} replace />;
    }

    return <Outlet />;
};


export default PublicRoute;