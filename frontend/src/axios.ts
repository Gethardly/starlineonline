import axios from "axios";

const axiosApi = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
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