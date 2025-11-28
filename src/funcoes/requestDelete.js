export const requestDelete = async (texto, axiosConfig, url, setLoading, requestFuncao, setPaginaAtual, paginaAtual) => {
    // Exibir uma mensagem de confirmação
    const confirmDelete = window.confirm(texto);

    if (!confirmDelete) {
        // Se o usuário cancelar, interrompa a execução
        return;
    }

    try {
        setLoading(true);
        const response = await axiosConfig.delete(url);
        alert(response.data.retorno.mensagem);
        
    } catch (error) {
        alert(error.response.data.retorno.mensagem);
    } finally {
        //  recarrega os dados se a pagina for igual a 1
        if (paginaAtual == 1) {
            requestFuncao();
        }

        // troca a pagina pra 1 e recarrega os dados se o valor anterior não for 1
        setPaginaAtual(1);
    }
}