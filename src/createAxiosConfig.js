import axios from "axios";

export const createAxiosConfig = (setLoading) => {
    const axiosConfig = axios.create({
        baseURL: "https://horas-complementares-api.onrender.com",
        // baseURL: "http://localhost:5000",
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });

    axiosConfig.interceptors.response.use(
        (response) => {
            if (setLoading) setLoading(false); // define loading false após sucesso
            return response;
        },
        (error) => {
            if (setLoading) setLoading(false); // define loading false em erro

            if (error.response?.data?.retorno?.status === 401) {
                alert(error.response?.data.retorno.mensagem);
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return axiosConfig;
};
