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
        // Adjunta el token de autenticación si existe
        const token = getCookie('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        // Adjunta el token CSRF para las peticiones que no son seguras (POST, PUT, etc.)
        if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(config.method.toUpperCase())) {
            const csrftoken = getCookie('csrftoken');
            config.headers['X-CSRFToken'] = csrftoken;
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

export const deleteEmpleado = (id) => {
    return apiClient.delete(`empleados/${id}/`);
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

export const createResolucion = (resolucionData) => {
    return apiClient.post('resoluciones/', resolucionData);
};

export const getTiposSancion = () => {
    return apiClient.get('sanciones/');
};

export const aplicarSancionEmpleado = (sancionData) => {
    return apiClient.post('sanciones-empleados/', sancionData);
};

export const getSancionesEmpleados = () => {
    return apiClient.get('sanciones-empleados/');
};

export const getSancionById = (id) => {
    return apiClient.get(`sanciones-empleados/${id}/`);
};

/**
 * Obtiene la lista de empleados que aún no tienen un rostro registrado.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const getEmpleadosSinRostro = () => {
    return apiClient.get('empleados-sin-rostro/');
};

/**
 * Registra el rostro de un empleado.
 * @param {number} empleadoId - El ID del empleado.
 * @param {string} image - La imagen en formato base64.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const registrarRostro = (empleadoId, image) => {
    const payload = { empleado_id: empleadoId, image: image };
    return apiClient.post('rostro/', payload);
};

/**
 * Obtiene la lista de empleados que ya tienen un rostro registrado.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const getEmpleadosConRostro = () => {
    return apiClient.get('empleados-con-rostro/');
};

/**
 * Modifica el rostro de un empleado existente.
 * @param {number} empleadoId - El ID del empleado.
 * @param {string} image - La nueva imagen en formato base64.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const modificarRostro = (empleadoId, image) => {
    const payload = { empleado_id: empleadoId, image: image };
    return apiClient.put('rostro/', payload);
};

/**
 * Marca la asistencia de un empleado mediante reconocimiento facial.
 * @param {string} image - La imagen en formato base64.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const marcarAsistencia = (image) => {
    const payload = { image: image };
    return apiClient.post('marcar/', payload);
};

/**
 * Obtiene el historial de asistencias para un empleado específico.
 * @param {number} empleadoId - El ID del empleado.
 * @returns {Promise} La promesa de la petición de Axios.
 */
export const getAsistenciasByEmpleadoId = (empleadoId, page = 1) => {
    return apiClient.get(`asistencias-empleado/${empleadoId}/`, { params: { page } });
};

export default apiClient;
