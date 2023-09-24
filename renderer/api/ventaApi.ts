import axios from 'axios';

const ventaApi = axios.create({
    baseURL: '/api'
});

export default ventaApi;