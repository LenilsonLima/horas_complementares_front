import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../apiUrls";
import Loading from '../../../components/loading/Loading';
import { createAxiosConfig } from "../../../createAxiosConfig";
import { requestCreate } from "../../../funcoes/requestCreate";
import { requestDados } from "../../../funcoes/requestDados";
import styles from './NovoUser.module.scss';
import DescriptionHeader from "../../../components/descriptionHeader/DescriptionHeader";


function NovoUser() {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [turmas, setTurmas] = useState([]);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const axiosConfig = createAxiosConfig(setLoading);

    const fetchTurmas = async () => {
        requestDados(axiosConfig, apiUrls.turmasUrl, setLoading, setTurmas, setTotalRegistros, setTotalPaginas);
    }

    useEffect(() => {
        fetchTurmas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);
        requestCreate(axiosConfig, apiUrls.userUrl, formValues, setLoading, navigation);
    }
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <div className={styles.containerListarTurmas}>
            <div className={styles.areaListarTurmas}>
                <DescriptionHeader descricao="Cadastro de Usuário" />
                <form onSubmit={handleSubmit} >
                    <label>
                        <span>Nome:</span>
                        <input type="text" placeholder="Nome" required name="nome" />
                    </label>
                    <label>
                        <span>E-mail:</span>
                        <input type="email" placeholder="Email" required name="email" />
                    </label>
                    <label>
                        <span>CPF:</span>
                        <input type="number" placeholder="CPF" required name="cpf" />
                    </label>
                    <label>
                        <span>Senha:</span>
                        <input type="password" placeholder="Senha" required name="senha" />
                    </label>
                    <label>
                        <span>Confirmar Senha:</span>
                        <input type="password" placeholder="Senha" required name="confirmar_senha" />
                    </label>
                    <label>
                        <span>Matrícula:</span>
                        <input type="text" placeholder="matricula" required name="matricula" />
                    </label>
                    <label>
                        <span>Semestre:</span>
                        <input type="number" placeholder="semestre" required name="semestre" />
                    </label>
                    <label>
                        <span>RA:</span>
                        <input type="text" placeholder="RA" required name="ra" />
                    </label>
                    <label>
                        <span>Turma:</span>
                        <select name="turma_id">
                            <option value="">Selecione a Turma</option>
                            {turmas.map(turma => (
                                <option key={turma.id} value={turma.id}>
                                    {turma.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>Tipo:</span>
                        <select name="tipo">
                            <option value={0}>Aluno</option>
                            <option value={1}>Administrador</option>
                        </select>
                    </label>
                    <button>Cadastrar</button>
                </form>
            </div>
        </div>
    );
}

export default NovoUser;
