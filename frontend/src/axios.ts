import axios, {type InternalAxiosRequestConfig} from "axios";

const axiosApi = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("tkn");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token.replace(/^"+|"+$/g, '')}`;
    }
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