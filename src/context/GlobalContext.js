import { createContext, useEffect, useState } from "react";
import { apiUrls } from "../apiUrls";
import axios from "axios";

export const ContextGlobal = createContext({});

const GlobalContext = ({ children }) => {
    const [cursos, setCursos] = useState([]);
    const [cursoId, setCursoId] = useState(0);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

    const handleDadosCursos = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Ensure cookies are sent with the request
        };

        try {
            const response = await axios.get(apiUrls.cursosUrl, requestOptions);
            setCursos(response.data.registros);
        } catch (error) {
            console.log(error.response.data);
        }
    };
    useEffect(() => {
        handleDadosCursos();
    }, []);
    return (
        <ContextGlobal.Provider value={{ cursos, cursoId, setCursoId, registrosPorPagina, setRegistrosPorPagina }}>
            {children}
        </ContextGlobal.Provider>
    )
}
export default GlobalContext;