import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../apiUrls";
import Loading from '../../../components/loading/Loading';
import { requestCreate } from "../../../funcoes/requestCreate";
import { createAxiosConfig } from "../../../createAxiosConfig";

function NovoCertificado() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [arquivo, setArquivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const axiosConfig = createAxiosConfig(setLoading);

    const handleArquivo = (e) => {
        setArquivo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!arquivo) {
            alert("Nenhum arquivo foi selecionado.");
            return;
        }

        const formData = new FormData();
        formData.append("file", arquivo);
        formData.append("descricao", descricao);

        requestCreate(axiosConfig, apiUrls.certificadosUrl, formData, setLoading, navigation);
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', rowGap: 10, width: 500 }}>
                <input defaultValue={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: 10 }} type="text" name="descricao" placeholder="Descrição" required />
                <label htmlFor="arquivo" style={{ backgroundColor: '#fff', borderRadius: 3, display: 'flex', padding: 10, cursor: 'pointer' }}>
                    <span style={{ color: '#000', fontSize: 15 }}>{arquivo.name || "seleione um arquivo"}</span>
                    <input
                        type="file"
                        id="arquivo"
                        placeholder="Selecione um arquivo"
                        style={{ padding: 10, display: 'none' }}
                        required
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

export default NovoCertificado;
