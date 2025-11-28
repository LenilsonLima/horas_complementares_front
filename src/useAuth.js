import axios from "axios";
import { useEffect, useState } from "react";
import { apiUrls } from "./apiUrls";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get(apiUrls.verificarLoginUrl, { withCredentials: true });
                setUser(data.registros[0]); // salva o usuário
            } catch {
                setUser(null);
                navigate('/login'); // redireciona se não estiver logado
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    return { user, loading };
};