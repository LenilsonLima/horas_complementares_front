import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginGoogle from "./LoginGoogle.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from 'js-cookie'; // Importando a biblioteca para manipular cookies
import { apiUrls } from "../../apiUrls.js";
import './Login.scss'
import DescriptionHeader from "../../components/descriptionHeader/DescriptionHeader.js";
import Loading from "../../components/loading/Loading.js";
const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            setLoading(true);

            const response = await axios.post(apiUrls.loginAdmUrl, formValues, { headers: { "Content-Type": "application/json", }, withCredentials: true });

            // Armazenar o token no cookie
            // Cookies.set('token', response.data.retorno.registros.token, { expires: 7, secure: false, sameSite: 'Lax' });

            // Redirecionar para a página inicial
            navigation('/');

        } catch (error) {
            setLoading(false);
            alert(error.response.data.retorno.mensagem);
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="body-login">
            <div className="container-login">
                <div className="area-login">
                    <DescriptionHeader descricao="Autenticação de acesso - Administrativo" />
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">
                            <span>Email</span>
                            <input type="email" id="email" required name="email" />
                        </label>
                        <label htmlFor="senha">
                            <span>Senha</span>
                            <input type="password" id="senha" name="senha" />
                        </label>
                        <input type="submit" className="btn" value="Entrar" />
                    </form>
                    <DescriptionHeader descricao="Autenticação de acesso - Estudante" />
                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} >
                        <LoginGoogle setLoading={setLoading} />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    );
};

export default Login;
