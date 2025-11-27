import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrls } from "../../../apiUrls.js";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import DescriptionHeader from '../../../components/descriptionHeader/DescriptionHeader.js';
import Loading from "../../../components/loading/Loading.js";
import styles from './ListarTurmas.module.scss';

const ListarTurmas = () => {
    const [turmas, setTurmas] = useState([]);
    const navigation = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cursos, setCursos] = useState([]);
    const [cursoId, setCursoId] = useState(0);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

    const requestTurmas = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setTurmas([]);
            setLoading(true);
            const url = cursoId > 0
                ? `${apiUrls.turmasUrl}?curso_id=${cursoId}&page=${paginaAtual}&limit=${registrosPorPagina}`
                : `${apiUrls.turmasUrl}?page=${paginaAtual}&limit=${registrosPorPagina}`;

            const response = await axios.get(url, requestOptions);
            setTurmas(response.data.registros);
            setTotalRegistros(response.data.totalRegistros);
            setTotalPaginas(response.data.totalPaginas);
        } catch (error) {
            alert(error.response?.data.retorno.mensagem);
        } finally {
            requestCursos();
        }
    };
    useEffect(() => {
        requestTurmas();
    }, [cursoId, paginaAtual, registrosPorPagina]);

    const requestCursos = async () => {
        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            const response = await axios.get(apiUrls.cursosUrl, requestOptions);
            setCursos(response.data.registros);
        } catch (error) {
            alert(error.response?.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setPaginaAtual(1);
    }, [registrosPorPagina]);

    const remove = async (turma_id) => {
        const confirmDelete = window.confirm(`Tem certeza de que deseja excluir esta turma ${turma_id}? Esta ação não pode ser desfeita.`);
        if (!confirmDelete) return;

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        };

        try {
            setLoading(true);
            const response = await axios.delete(`${apiUrls.turmasUrl}/${turma_id}`, requestOptions);
            alert(response.data.retorno.mensagem);
        } catch (error) {
            alert(error.response?.data.retorno.mensagem);
        } finally {
            //  recarrega os dados se a pagina for igual a 1
            if (paginaAtual == 1) {
                requestTurmas();
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
        <div className={styles.containerListarTurmas}>
            <div className={styles.areaListarTurmas}>
                <DescriptionHeader descricao="Listagem de Turmas" />
                <button onClick={() => navigation('/turma/create')} style={{ height: 50, width: 50, borderRadius: 50, border: 'none', cursor: 'pointer', position: 'fixed', bottom: 50, right: 50, fontSize: 25 }}>+</button>
                <div className={styles.tabelaTurmasScroll}>
                    <table>
                        {turmas?.length > 0 ?
                            <> <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Ano Início</th>
                                    <th>Ano Fim</th>
                                    <th>Período</th>
                                    <th>Curso</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {turmas?.map((item) => (
                                        <tr key={item?.id}>
                                            <td>{item?.nome}</td>
                                            <td>{item?.ano_inicio}</td>
                                            <td>{item?.ano_fim}</td>
                                            <td>
                                                {item?.periodo === 'M' && 'Matutino'}
                                                {item?.periodo === 'T' && 'Vespertino'}
                                                {item?.periodo === 'N' && 'Noturno'}
                                            </td>
                                            <td>{item?.curso_nome}</td>
                                            <td>
                                                <div className={styles.acoesLinha}>
                                                    <button onClick={() => navigation(`/turma/update/${item?.id}`)}>
                                                        <MdOutlineEdit />
                                                    </button>
                                                    <button onClick={() => remove(item.id)}>
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
                {turmas?.length > 0 &&
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

export default ListarTurmas;
