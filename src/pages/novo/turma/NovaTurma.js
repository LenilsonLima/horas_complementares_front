import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../apiUrls";
import Loading from "../../../components/loading/Loading";
import { createAxiosConfig } from "../../../createAxiosConfig";
import { requestCreate } from "../../../funcoes/requestCreate";
import { requestDados } from "../../../funcoes/requestDados";

function NovaTurma() {
    const [loading, setLoading] = useState(true);
    const [cursos, setCursos] = useState([]);
    const [totalRegistros, setTotalRegistros] = useState(9999999999);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const navigation = useNavigate();
    const axiosConfig = createAxiosConfig(setLoading);

    const fetchCursos = async () => {
        requestDados(axiosConfig, apiUrls.cursosUrl, setLoading, setCursos, setTotalRegistros, setTotalPaginas);
    }

    useEffect(() => {
        fetchCursos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        const ano_inicio = parseInt(formValues.ano_inicio);
        const ano_fim = parseInt(formValues.ano_fim);

        const anoValid = ano_inicio <= ano_fim;
        if (!anoValid) {
            alert('Periodo informado é inválido, tente novamente.');
            return;
        }

        requestCreate(axiosConfig, apiUrls.turmasUrl, formValues, setLoading, navigation);
    }

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" />
                <input type="number" placeholder="ano_inicio" style={{ padding: 10 }} name="ano_inicio" />
                <input type="number" placeholder="ano_fim" style={{ padding: 10 }} name="ano_fim" />
                <select style={{ padding: 10 }} name="periodo" required>
                    <option value="">Selecione o periodo</option>
                    <option value="M">Matutino</option>
                    <option value="T">Vespertino</option>
                    <option value="N">Noturno</option>
                </select>
                <select style={{ padding: 10 }} name="curso_id" required>
                    <option value="">Selecione o curso</option>
                    {cursos.map(campo => (
                        <option key={campo.id} value={campo.id}>
                            {campo.nome}
                        </option>
                    ))}
                </select>
                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default NovaTurma;
