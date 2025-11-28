import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrls } from "../../../apiUrls";
import Loading from '../../../components/loading/Loading';

function AlterarCertificado() {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [arquivo, setArquivo] = useState('');
    const [descricao, setDescricao] = useState('');

    const requestCertificado = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            };

            const response = await axios.get(`${apiUrls.certificadosUrl}/${params.certificado_id}/${params.usuario_id}`, requestOptions);

            setDescricao(response.data.registros[0]?.descricao || '');
            setLoading(false);
        } catch (error) {
            alert(error.response?.data?.retorno?.mensagem || "Erro ao carregar o certificado.");
            navigation(-1);
        }
    };

    useEffect(() => {
        requestCertificado();
    }, [params.certificado_id, params.usuario_id]);

    const handleArquivo = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!arquivo || !descricao) {
            alert("Todos os campos são obrigatórios, tente novamente.");
            return;
        }

        const formData = new FormData();
        formData.append("file", arquivo);
        formData.append("descricao", descricao);

        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                },
                withCredentials: true
            };
            const response = await axios.put(`${apiUrls.certificadosUrl}/${params.certificado_id}`, formData, requestOptions);
            alert(response.data.retorno.mensagem);
            setArquivo(''); // Limpa o arquivo após o envio
            navigation(-1); // Redireciona para a página anterior
        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.retorno?.mensagem || "Erro ao enviar o arquivo.");
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: 10 }} type="text" name="descricao" placeholder="Descrição" required />
                <label htmlFor="arquivo" style={{ backgroundColor: '#fff', borderRadius: 3, display: 'flex', padding: 10, cursor: 'pointer' }}>
                    <span style={{ color: '#000', fontSize: 15 }}>{arquivo.name || "Selecione um arquivo"}</span>
                    <input
                        type="file"
                        id="arquivo"
                        placeholder="Selecione um arquivo"
                        style={{ padding: 10, display: 'none' }}
                        onChange={handleArquivo}
                        name="arquivo"
                        accept="application/pdf"
                    />
                </label>
                <input type="submit" value="Enviar" style={{ padding: 10 }} />
            </form>
        </div>
    );
}

export default AlterarCertificado;
