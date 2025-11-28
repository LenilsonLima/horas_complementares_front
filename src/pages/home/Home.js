import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../apiUrls";
import { ContextGlobal } from "../../context/GlobalContext";
import styles from "./Home.module.scss";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { GrDocumentPdf } from "react-icons/gr";
import DescriptionHeader from "../../components/descriptionHeader/DescriptionHeader";
import Loading from "../../components/loading/Loading";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

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

    const formatDate = (dateString) => {
        if (!dateString || dateString === "0000-00-00T00:00:00.000Z") return "Não registrado";
        const date = new Date(dateString);
        return date.toLocaleString("pt-BR");
    };

    const handleDados = useCallback(async () => {
        setLoading(true);
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        try {
            const url = `${apiUrls.userUrl}?tipo_user_filter=${tipoUser}&page=${paginaAtual}&limit=${registrosPorPagina}`;

            const { data } = await axios.get(url, requestOptions);

            setUsers(data.registros || []);
            setTotalRegistros(data.totalRegistros || 0);
            setTotalPaginas(data.totalPaginas || 0);
        } catch (error) {
            console.error("Erro ao carregar dados:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, [cursoId, tipoUser, paginaAtual, registrosPorPagina]);

    useEffect(() => {
        handleDados();
    }, [handleDados]);

    const editar = (usuario_id) => navigate(`/usuario/update/${usuario_id}`);

    const remove = async (usuario_id) => {
        const confirmDelete = window.confirm("Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.");
        if (!confirmDelete) return;

        setLoading(true);
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        try {
            const { data } = await axios.delete(`${apiUrls.userUrl}/${usuario_id}`, requestOptions);
            alert(data.retorno.mensagem || "Usuário excluído com sucesso!");
            handleDados(); // Recarrega os dados após exclusão
        } catch (error) {
            console.error("Erro ao excluir usuário:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => paginaAtual < totalPaginas && setPaginaAtual(paginaAtual + 1);
    const handlePrevPage = () => paginaAtual > 1 && setPaginaAtual(paginaAtual - 1);
    const [decoded, setDecoded] = useState({});

    // const decodeJwt = () => {
    //     const token = Cookies.get('token');
    //     if (token) {
    //         try {
    //             const decodedData = jwtDecode(token);
    //             setDecoded(decodedData);
    //         } catch (error) {
    //             console.error("Erro ao decodificar token:", error);
    //             setDecoded({ tipo: 0 });
    //         }
    //     } else {
    //         setDecoded({ tipo: 0 });
    //     }
    // };

    // useEffect(() => {
    //     decodeJwt();
    // }, []);

    if (loading) return <Loading />;

    return (
        <div className={styles.containerListarUsuarios}>
            <div className={styles.areaListarUsuarios}>
                <DescriptionHeader descricao="Listagem de Usuários" />
                <button onClick={() => navigate('/user/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                {Cookies.get('token') && decoded?.tipo === 1 && (
                    <select onChange={(e) => setTipoUser(Number(e.target.value))} value={tipoUser}>
                        <option value="0">Aluno</option>
                        <option value="1">Administrador</option>
                    </select>
                )}
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
