// const BASE_URL = 'https://horas-complementares-api.onrender.com'
const BASE_URL = 'http://localhost:5000'
export const apiUrls = {
    userUrl: `${BASE_URL}/usuario`,
    turmasUrl: `${BASE_URL}/turmas`,
    cursosUrl: `${BASE_URL}/cursos`,
    camposUrl: `${BASE_URL}/campos`,
    certificadosUrl: `${BASE_URL}/pdf`,
    loginAdmUrl: `${BASE_URL}/usuario/login/adm`,
    loginAlunoUrl: `${BASE_URL}/usuario/login/aluno`,
    verificarLoginUrl: `${BASE_URL}/usuario/auth`,
    logoutUrl: `${BASE_URL}/usuario/logout`,
}