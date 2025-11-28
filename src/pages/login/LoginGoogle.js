import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { apiUrls } from '../../apiUrls';
import { createAxiosConfig } from '../../createAxiosConfig';
import { requestLogin } from '../../funcoes/requestLogin';

const LoginGoogle = ({ setLoading }) => {
  const navigation = useNavigate();
  const axiosConfig = createAxiosConfig(setLoading);

  const handleLogin = async (response) => {
    requestLogin(axiosConfig, apiUrls.loginAlunoUrl, { token: response.credential }, setLoading, navigation);
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
