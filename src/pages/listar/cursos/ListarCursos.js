import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../apiUrls.js";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import DescriptionHeader from '../../../components/descriptionHeader/DescriptionHeader.js';
import Loading from "../../../components/loading/Loading.js";
import styles from './ListarCursos.module.scss';

const ListarCursos = () => {
    const [cursos, setCursos] = useState([]);
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    // Página atual e número de registros por página
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

    const requestCursos = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Ensures that cookies are sent with the request
        };

        try {
            setCursos([]);
            setLoading(true);
            const url = `${apiUrls.cursosUrl}?page=${paginaAtual}&limit=${registrosPorPagina}`;
            const response = await axios.get(url, requestOptions);
            setCursos(response.data.registros);
            setTotalRegistros(response.data.totalRegistros);  // Supõe que a API retorna o total de registros
            setTotalPaginas(response.data.totalPaginas);
        } catch (error) {
            alert(error.response.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        requestCursos();
    }, [paginaAtual, registrosPorPagina]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [registrosPorPagina]);

    const remove = async (curso_id) => {
        // Exibir uma mensagem de confirmação
        const confirmDelete = window.confirm(`Tem certeza de que deseja excluir este curso ${curso_id}? Esta ação não pode ser desfeita.`);

        if (!confirmDelete) {
            // Se o usuário cancelar, interrompa a execução
            return;
        }

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,  // Ensures that cookies are sent with the request
        };

        try {
            setLoading(true);
            const response = await axios.delete(`${apiUrls.cursosUrl}/${curso_id}`, requestOptions);
            alert(response.data.retorno.mensagem);
        } catch (error) {
            alert(error.response.data.retorno.mensagem);
        } finally {
            //  recarrega os dados se a pagina for igual a 1
            if (paginaAtual == 1) {
                requestCursos();
            }

            // troca a pagina pra 1 e recarrega os dados se o valor anterior não for 1
            setPaginaAtual(1);
        }
    };

    const handleNextPage = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const handlePrevPage = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className={styles.containerListarCursos}>
            <div className={styles.areaListarCursos}>
                <DescriptionHeader descricao="Listagem de Cursos" />
                <button onClick={() => navigation('/curso/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                <div className={styles.tabelaCursosScroll}>
                    <table>
                        {cursos?.length > 0 ?
                            <>
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>nome</th>
                                        <th>ano_inicio</th>
                                        <th>horas_complementares</th>
                                        <th>ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cursos?.map((item, index) => (
                                        <tr key={item?.id}>
                                            <td>{item?.id}</td>
                                            <td>{item?.nome}</td>
                                            <td>{item?.ano_inicio}</td>
                                            <td>{item?.horas_complementares}</td>
                                            <td style={{ padding: 5 }}>
                                                <div className={styles.acoesLinha}>
                                                    <button onClick={() => navigation(`/curso/update/${item?.id}`)} title="Alteração">
                                                        <MdOutlineEdit />
                                                    </button>
                                                    <button onClick={() => remove(item.id)} title="Exclusão">
                                                        <MdDeleteOutline />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                            :
                            <p>Nenhuma informação foi localizada</p>
                        }
                    </table>
                </div>
                {cursos?.length > 0 &&
                    <div className={styles.controlePaginacao}>
                        <button onClick={handlePrevPage} disabled={paginaAtual <= 1}>
                            <MdKeyboardArrowLeft />
                        </button>
                        <span>{paginaAtual} de {totalPaginas} ({totalRegistros} registros)</span>
                        <button onClick={handleNextPage} disabled={paginaAtual >= totalPaginas}>
                            <MdKeyboardArrowRight />
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default ListarCursos;
