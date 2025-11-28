import { useEffect, useState } from "react";
import { apiUrls } from "../../../apiUrls.js";
import { MdDeleteOutline, MdOutlineEdit, MdKeyboardArrowRight, MdKeyboardArrowLeft, MdCheck } from "react-icons/md";
import DescriptionHeader from '../../../components/descriptionHeader/DescriptionHeader.js';
import Loading from "../../../components/loading/Loading.js";
import styles from './ListarCertificados.module.scss';
import { useNavigate, useParams } from "react-router-dom";
import { createAxiosConfig } from "../../../createAxiosConfig.js";
import { requestDados } from "../../../funcoes/requestDados";
import { requestDelete } from "../../../funcoes/requestDelete";
import { MdOutlineAdd } from "react-icons/md";

const ListarCertificados = () => {
    const [certificados, setCertificados] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);
    const axiosConfig = createAxiosConfig(setLoading);

    const params = useParams();
    const navigation = useNavigate();

    const requestCertificados = async () => {
        requestDados(axiosConfig, `${apiUrls.certificadosUrl}/${params.usuario_id}`, setLoading, setCertificados, setTotalRegistros, setTotalPaginas);
    }
    useEffect(() => {
        requestCertificados();
    }, []);

    const editar = (certificado_id, usuario_id) => {
        navigation(`/certificado/update/${certificado_id}/${usuario_id}`)
    }

    const remove = async (certificado_id) => {
        requestDelete(
            "Tem certeza de que deseja excluir este certificado? Esta ação não pode ser desfeita.",
            axiosConfig,
            `${apiUrls.certificadosUrl}/${certificado_id}`,
            setLoading,
            requestCertificados,
            setPaginaAtual,
            paginaAtual
        );
    }

    const handleValidar = async (descricao) => {
        const confirmValidar = window.confirm(`Deseja validar o certificado "${descricao}"`);
    }

    useEffect(() => {
        setPaginaAtual(1);
    }, [registrosPorPagina]);

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
        )
    }

    return (
        <div className={styles.containerListarCertificados}>
            <div className={styles.areaListarCertificados}>
                <DescriptionHeader descricao="Listagem de Certificados" icone={<MdOutlineAdd onClick={() => navigation('/certificado/create')} />} />
                <div className={styles.tabelaCertificadosScroll}>
                    <table>
                        {certificados?.length > 0 ?
                            <>
                                <thead>
                                    <tr>
                                        <th>Descricao</th>
                                        <th>Usuário</th>
                                        <th>Status</th>
                                        <th>Upload</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certificados?.map((item, index) => (
                                        <tr key={item?.id}>
                                            <td><a href={item?.s3_url} target="_blank">{item?.descricao}</a></td>
                                            <td>{item?.usuarios_nome}</td>
                                            <td>{item?.status === 0 && 'pendente'}{item?.status === 1 && 'aprovado'}{item?.status === 2 && 'rejeitado'}</td>
                                            <td>{String(item?.created_at).substring(0, 10).split('-').reverse().join('/')}</td>
                                            <td style={{ padding: 5 }}>
                                                <div className={styles.acoesLinha}>
                                                    <button onClick={() => editar(item.id, item.usuario_id)} title="Alteração">
                                                        <MdOutlineEdit />
                                                    </button>
                                                    <button onClick={() => remove(item.id)} title="Exclusão">
                                                        <MdDeleteOutline />
                                                    </button>
                                                    <button onClick={() => handleValidar(item.descricao)} title="Validar">
                                                        <MdCheck />
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
                {certificados?.length > 0 &&
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

export default ListarCertificados;
