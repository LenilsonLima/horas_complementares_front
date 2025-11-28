import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/home/Home";
import ListarTurmas from "../pages/listar/turmas/ListarTurmas";
import ListarCursos from "../pages/listar/cursos/ListarCursos";
import ListarCertificados from "../pages/listar/certificados/ListarCertificados";
import AlterarUser from "../pages/alterar/user/AlterarUser";
import AlterarCertificado from "../pages/alterar/certificado/AlterarCertificado";
import AlterarTurma from "../pages/alterar/turma/AlterarTurma";
import AlterarCurso from "../pages/alterar/curso/AlterarCurso";
import NovoUser from "../pages/novo/usuario/NovoUser";
import NovaTurma from "../pages/novo/turma/NovaTurma";
import NovoCurso from "../pages/novo/curso/NovoCurso";
import NovoCertificado from "../pages/novo/certificado/NovoCertificado";
import Login from "../pages/login/Login";
import Verify from "../modules/Verify";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Verify />,
        children: [
            // READ
            {
                path: "",
                element: <Home />
            },
            {
                path: "turma/read",
                element: <ListarTurmas />
            },
            {
                path: "curso/read",
                element: <ListarCursos />
            },
            {
                path: "certificado/read/:usuario_id",
                element: <ListarCertificados />
            },

            // UPDATE
            {
                path: "usuario/update/:usuario_id",
                element: <AlterarUser />
            },
            {
                path: "turma/update/:turma_id",
                element: <AlterarTurma />
            },
            {
                path: "curso/update/:curso_id",
                element: <AlterarCurso />
            },
            {
                path: "certificado/update/:certificado_id/:usuario_id",
                element: <AlterarCertificado />
            },

            // CREATE
            {
                path: "user/create",
                element: <NovoUser />
            },
            {
                path: "turma/create",
                element: <NovaTurma />
            },
            {
                path: "curso/create",
                element: <NovoCurso />
            },
            {
                path: "certificado/create",
                element: <NovoCertificado />
            },
            {
                path: 'login',
                element: <Login />,
            }
        ]
    }
]);

const Rotas = () => {
    return (
        <RouterProvider router={router} />
    )
}
export default Rotas;