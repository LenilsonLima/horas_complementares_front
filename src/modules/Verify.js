import { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ContextGlobal } from '../context/GlobalContext';
import './Veryfi.scss';
import { apiUrls } from '../apiUrls';
import { createAxiosConfig } from '../createAxiosConfig';
import Loading from '../components/loading/Loading';

const HeaderNavigation = ({ tipo, onLogout, onNavigate, usuario_id }) => {
    const adminButtons = [
        { label: 'Home', path: '/' },
        { label: 'Turmas', path: '/turma/read' },
        { label: 'Cursos', path: '/curso/read' },
    ];

    const commonButtons = [
        { label: 'Home', path: '/' },
        { label: 'Certificados', path: `/certificado/read/${usuario_id}` },
    ];

    // const buttons = tipo === 1 ? adminButtons : commonButtons;
    const buttons = adminButtons;

    return (
        <ul style={{ display: 'flex', columnGap: 15, listStyle: 'none', color: '#83c483', padding: 5 }}>
            {buttons.map((btn, index) => (
                <li style={{ cursor: 'pointer' }}><a style={{ color: '#83c483', fontSize: 14 }} onClick={() => onNavigate(btn.path)}>{btn.label}</a></li>
            ))}
            <li style={{ cursor: 'pointer' }}><a style={{ color: '#83c483', fontSize: 14 }} onClick={onLogout}>Sair</a></li>
        </ul>
    );
};

const Verify = () => {
    const [decoded, setDecoded] = useState({});
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const { cursos, setCursoId, cursoId, registrosPorPagina, setRegistrosPorPagina } = useContext(ContextGlobal);
    const axiosConfig = createAxiosConfig(setLoading);

    const handleLogout = async () => {
        try {
            setLoading(true);

            axiosConfig.get(apiUrls.logoutUrl);
            navigation('/login');

        } catch (error) {
            alert(error.response.data.retorno.mensagem);
        }
    };

    return (
        <div className='container-verify'>
            <div className="header-topo">
                <div className='area-header-topo'>
                    <p>Instituto Federal de Mato Grosso do Sul</p>
                    <span>Gerenciamento de Atividade Complementares</span>
                </div>
                <div className='verify-filter'>
                    <div className='verify-filter-area'>
                        <select onChange={(e) => setCursoId(e.target.value)} value={cursoId}>
                            <option>- selecione um curso -</option>
                            {cursos?.map((item) => (
                                <option value={item?.id} key={item?.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <HeaderNavigation
                        usuario_id={decoded?.usuario_id}
                        tipo={decoded?.tipo}
                        onLogout={handleLogout}
                        onNavigate={(path) => navigation(path)}
                    />
                </div>
            </div>

            <div className='area-verify'>
                {loading ?
                    <Loading />
                    :
                    <Outlet />
                }
            </div>
        </div >
    );
};

export default Verify;
