import axios from 'axios';

// Función para obtener el valor de una cookie por su nombre
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const API_URL = 'http://localhost:8000/api/';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getEmpleados = () => {
    return apiClient.get('empleados/');
};

export const getEmpleadoById = (id) => {
    return apiClient.get(`empleados/${id}/`);
};

export const createEmpleado = (empleadoData) => {
    return apiClient.post('empleados/', empleadoData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateEmpleado = (id, empleadoData) => {
    return apiClient.put(`empleados/${id}/`, empleadoData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default apiClient;
