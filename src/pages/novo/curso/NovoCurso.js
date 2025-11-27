import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../apiUrls";
import Loading from "../../../components/loading/Loading";

function NovoCurso() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();


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
            const response = await axios.post(apiUrls.cursosUrl, formValues, requestOptions);
            alert(response.data.retorno.mensagem);
            navigation(-1);

        } catch (error) {
            setLoading(false);
            alert(error.response.data.retorno.mensagem)
        }
    }
    if (loading) {
        return (
            <Loading/>
        )
    }
    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input type="text" placeholder="Nome" style={{ padding: 10 }} required name="nome" />
                <input type="number" placeholder="Horas Complementares" style={{ padding: 10 }} name="horas_complementares" />
                <input type="number" placeholder="ano_inicio" style={{ padding: 10 }} name="ano_inicio" />
                <input type="submit" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default NovoCurso;
