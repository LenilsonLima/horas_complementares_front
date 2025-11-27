import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const RotasPrivadas = () => {
    const token = Cookies.get('token');
    return token ? (
        <Outlet />
    ) : <Navigate to="/login" />;
};

export default RotasPrivadas;
