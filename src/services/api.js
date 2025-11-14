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

export const getEmpleadosBasico = () => {
    return apiClient.get('empleados-basico/');
};

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

export const getRecibosByDni = (dni) => {
    return apiClient.get(`recibos/por-dni/${dni}/`);
};

export const getEmpleadoByDni = (dni) => {
    return apiClient.get(`empleados/por-dni/${dni}/`);
};

export const createRecibo = (reciboData) => {
    return apiClient.post('recibos/', reciboData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateRecibo = (id, reciboData) => {
    return apiClient.patch(`recibos/${id}/`, reciboData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const createHorario = (horarioData) => {
    return apiClient.post('horarios/', horarioData);
};

export const getHorarios = () => {
    return apiClient.get('horarios/');
};

export const sincronizarEmpleadosHorario = (horarioId, empleadoIds) => {
    const data = {
        empleado_ids: empleadoIds
    };
    return apiClient.post(`horarios/${horarioId}/sincronizar-empleados/`, data);
};

export const getHistorialAsignacionesDetallado = () => {
    return apiClient.get('historial-asignaciones/');
};

export const getIncidentesAgrupados = () => {
    return apiClient.get('incidentes-agrupados/');
};

export const getIncidenteAgrupadoPorId = (id) => {
    return apiClient.get(`incidentes-agrupados/${id}/`);
};

export const getTiposIncidente = () => {
    return apiClient.get('incidentes/');
};

export const createIncidenteEmpleado = (incidenteData) => {
    return apiClient.post('incidente-empleado/', incidenteData);
};

export const corregirIncidente = (id, incidenteData) => {
    return apiClient.post(`incidentes-agrupados/${id}/corregir/`, incidenteData);
};


export default apiClient;
