import axios from "axios";

const api = axios.create({
    baseUrl: 'http://localhost:8000'
});


export default api;