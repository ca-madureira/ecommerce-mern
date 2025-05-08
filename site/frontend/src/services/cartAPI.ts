import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api/shop/cart', // ajuste conforme seu backend
    timeout: 10000,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido/expirou - redirecionar para login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;