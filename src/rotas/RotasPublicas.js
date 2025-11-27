import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';


const RotasPublicas = () => {
    const token = Cookies.get('token');
    return token ? (
        <Navigate to="/login" />
    ) : <Outlet />;
};

export default RotasPublicas;
