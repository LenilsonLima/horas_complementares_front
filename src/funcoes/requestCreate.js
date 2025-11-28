export const requestCreate = async (axiosConfig, url, body, setLoading, navigation) => {
    try {
        setLoading(true);
        const response = await axiosConfig.post(url, body);
        navigation(-1);
        alert(response.data.retorno.mensagem);

    } catch (error) {
        alert(error.response.data.retorno.mensagem);
    }
}