import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../apiUrls";
import { ContextGlobal } from "../../context/GlobalContext";
import styles from "./Home.module.scss";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { GrDocumentPdf } from "react-icons/gr";
import DescriptionHeader from "../../components/descriptionHeader/DescriptionHeader";
import Loading from "../../components/loading/Loading";
import { createAxiosConfig } from "../../createAxiosConfig";
import { requestDados } from '../../funcoes/requestDados';
import { requestDelete } from '../../funcoes/requestDelete';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
    const [tipoUser, setTipoUser] = useState(0);
    const { cursoId } = useContext(ContextGlobal);
    const navigate = useNavigate();
    const axiosConfig = createAxiosConfig(setLoading);

    const formatDate = (dateString) => {
        if (!dateString || dateString === "0000-00-00T00:00:00.000Z") return "Não registrado";
        const date = new Date(dateString);
        return date.toLocaleString("pt-BR");
    };

    const handleDados = async () => {
        const url = `${apiUrls.userUrl}?tipo_user_filter=${tipoUser}&page=${paginaAtual}&limit=${registrosPorPagina}`;
        requestDados(axiosConfig, url, setLoading, setUsers, setTotalRegistros, setTotalPaginas);
    };

    useEffect(() => {
        handleDados();
    }, [cursoId, tipoUser, paginaAtual, registrosPorPagina]);

    const editar = (usuario_id) => navigate(`/usuario/update/${usuario_id}`);

    const remove = async (usuario_id) => {
        requestDelete(
            "Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.",
            axiosConfig,
            `${apiUrls.userUrl}/${usuario_id}`,
            setLoading,
            requestDados,
            setPaginaAtual,
            paginaAtual
        );
    };

    const handleNextPage = () => paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1);
    const handlePrevPage = () => paginaAtual > 1 && setPaginaAtual(paginaAtual - 1);

    if (loading) return <Loading />;

    return (
        <div className={styles.containerListarUsuarios}>
            <div className={styles.areaListarUsuarios}>
                <DescriptionHeader descricao="Listagem de Usuários" />
                <button onClick={() => navigate('/user/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                <select onChange={(e) => setTipoUser(Number(e.target.value))} value={tipoUser}>
                    <option value="0">Aluno</option>
                    <option value="1">Administrador</option>
                </select>
                <div className={styles.tabelaUsuariosScroll}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Turma</th>
                                <th>Curso</th>
                                <th>Horas Complementares</th>
                                <th>Último Login</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <p>{item.nome || "****"}</p>
                                        <p>{item.cpf || "****"}</p>
                                    </td>
                                    <td>{item.email || "****"}</td>
                                    <td>{item.tipo > 0 ? "Adm" : "Aluno" || "****"}</td>
                                    <td>{item.turma_nome || "****"}</td>
                                    <td>{item.curso_nome || "****"}</td>
                                    <td>{item.horas_complementares || "****"}</td>
                                    <td>{formatDate(item.last_login || "****")}</td>
                                    <td>
                                        <div className={styles.acoesLinha}>
                                            <button onClick={() => editar(item.id)} title="Alteração">
                                                <MdOutlineEdit />
                                            </button>
                                            <button onClick={() => remove(item.id)} title="Exclusão">
                                                <MdDeleteOutline />
                                            </button>
                                            <button onClick={() => navigate(`/certificado/read/${item.id}`)} title="Certificados">
                                                <GrDocumentPdf />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.controlePaginacao}>
                    <button onClick={handlePrevPage} disabled={paginaAtual <= 1}>
                        <MdKeyboardArrowLeft />
                    </button>
                    <span>{paginaAtual} de {totalPaginas} ({totalRegistros} registros)</span>
                    <button onClick={handleNextPage} disabled={paginaAtual >= totalPaginas}>
                        <MdKeyboardArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
