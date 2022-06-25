import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { LOGIN, UNAUTHORIZED } from '../config/routes/paths';


export default function RequireAuth({ allowedRoles }) {

    const location = useLocation();

    const { userInfo } = useAuthContext();

    return (
        userInfo?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : userInfo?.name
                ? <Navigate to={UNAUTHORIZED} state={{ from: location }} replace/>
                : <Navigate to={LOGIN} state={{ from: location }} replace/>    
    );
};