import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginGoogle from "./LoginGoogle.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { apiUrls } from "../../apiUrls.js";
import './Login.scss'
import DescriptionHeader from "../../components/descriptionHeader/DescriptionHeader.js";
import Loading from "../../components/loading/Loading.js";
import { createAxiosConfig } from "../../createAxiosConfig.js";
import { requestLogin } from "../../funcoes/requestLogin.js";
const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const axiosConfig = createAxiosConfig(setLoading);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        requestLogin(axiosConfig, apiUrls.loginAdmUrl, formValues, setLoading, navigation);
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
                            <apan>Email</apan>
                            <input type="email" id="email" required name="email" />
                        </label>
                        <label htmlFor="senha">
                            <apan>Senha</apan>
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
