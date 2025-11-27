import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../apiUrls";
import Loading from "../../../components/loading/Loading";

function AlterarCurso() {
    const [loading, setLoading] = useState(false);
    const [curso, setCurso] = useState({});
    const navigation = useNavigate();
    const params = useParams();

    const requestOneCurso = async () => {
        setCurso([]);
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrls.cursosUrl}/${params?.curso_id}`, requestOptions);
            setCurso(response.data.registros[0])
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.retorno.mensagem)
            navigation(-1);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        requestOneCurso();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        const ano_inicio = parseInt(formValues.ano_inicio);

        const anoValid = Number.isInteger(ano_inicio) && ano_inicio > 0 && ano_inicio <= new Date().getFullYear();
        if (!anoValid) {
            alert('Ano de inicio invalido, tente novamente.');
            return
        }

        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };
            const response = await axios.put(`${apiUrls.cursosUrl}/${params?.curso_id}`, formValues, requestOptions);
            alert(response.data.retorno.mensagem);
            navigation(-1);

        } catch (error) {
            console.log(error.response.data);
            setLoading(false);
            alert(error.response.data.retorno.mensagem)
        }
    }
    if (loading) {
        return (
            <Loading />
        );
    }
    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" defaultValue={curso?.nome} />
                <input type="number" placeholder="Horas Complementares" style={{ padding: 10 }} name="horas_complementares" defaultValue={curso?.horas_complementares} />
                <input type="number" placeholder="ano_inicio" style={{ padding: 10 }} name="ano_inicio" defaultValue={curso?.ano_inicio} />
                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default AlterarCurso;
