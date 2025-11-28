import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../useAuth';

const RotasPublicas = () => {
    const { user } = useAuth();
    console.log(user);

    return user?.autenticado ? (
        <Navigate to="/login" />
    ) : <Outlet />;
};

export default RotasPublicas;
