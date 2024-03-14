import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://vapi.vnappmob.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    function (config) {
        let token =
            window.localStorage.getItem('persist:auth') && JSON.parse(window.localStorage.getItem('persist:auth'))?.token?.slice(1, -1);
        config.headers = {
            authorization: token ? `Bearer ${token}` : null
        };
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosClient;
