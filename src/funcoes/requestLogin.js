export const requestLogin = async (axiosConfig, url, body, setLoading, navigation) => {
    try {
        setLoading(true);
        const response = await axiosConfig.post(url, body);
        navigation('/');
        alert(response.data.retorno.mensagem);

    } catch (error) {
        alert(error.response.data.retorno.mensagem);
    }
}