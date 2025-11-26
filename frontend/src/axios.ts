import axios, {type InternalAxiosRequestConfig} from "axios";

//https://starlineextenstion-nestjsbackend-sdkwyu-50f64a-95-111-243-134.traefik.me/

const baseURL = import.meta.env.MODE === 'development'
    ? "https://vosst.qit.kg/"
    : "http://localhost:3000";

const axiosApi = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("tkn");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token.replace(/^"+|"+$/g, '')}`;
    }
    config.headers['Origin'] = 'https://starline-online.ru';

    return config;
});

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if ([402].includes(error.response?.status)) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosApi;