import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../useAuth";


const RotasPrivadas = () => {
    const { user } = useAuth();
    console.log(user);

    return user?.autenticado ? (
        <Outlet />
    ) : <Navigate to="/login" />;
};

export default RotasPrivadas;
