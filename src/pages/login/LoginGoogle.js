import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importando a biblioteca js-cookie
import { apiUrls } from '../../apiUrls';

const LoginGoogle = ({ setLoading }) => {
  const navigation = useNavigate();

  const handleLogin = async (response) => {
    // Enviar o token do Google para o backend para validação
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const result = await axios.post(apiUrls.loginAlunoUrl, { token: response.credential }, requestOptions);

      // Verifique se a resposta contém o token e armazene no cookie
      if (result.data?.retorno?.registros?.token) {
        // Armazenar o token no cookie com opções de segurança
        Cookies.set('token', result.data.retorno.registros.token, {
          expires: 7, // Expira em 7 dias
          secure: false, // Garante que o cookie seja enviado apenas via HTTPS
          sameSite: 'Lax', // Previne o envio do cookie em requisições de outros sites
        });
        navigation('/');
      } else {
        throw new Error("Token não encontrado na resposta.");
      }
    } catch (error) {
      setLoading(false);

      // Melhor tratamento de erros
      const errorMessage = error?.response?.data?.retorno?.mensagem || "Ocorreu um erro. Tente novamente mais tarde.";
      alert(errorMessage);
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => alert('Login Falhou, tente novamente.')}
      shape='circle'
    />
  );
};

export default LoginGoogle;
