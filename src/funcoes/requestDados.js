export const requestDados = async (axiosConfig, url, setLoading, setDados, setTotalRegistros, setTotalPaginas) => {
    try {
        setLoading(true);
        setDados([]);
        const response = await axiosConfig.get(url);
        setDados(response.data.registros);
        setTotalRegistros(response.data.totalRegistros);
        setTotalPaginas(response.data.totalPaginas);
    } catch (error) {
        alert(error.response.data.retorno.mensagem);
    }
}